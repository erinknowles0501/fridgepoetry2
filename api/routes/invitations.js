import { Router } from "express";
import { getInvitationByID, getInvitationsByFridge, getOpenInvitationsByUser, setInvitation, createInvitation } from "../models/invitationModel.js";
import { isLoggedIn, isCurrentUser, isOwner, hasAnyInvitationToFridge } from "../authorization.js";
import { sendInvitation } from "../services/mailService.js";
import { getFridgeByID, getFridgeUsersToDisplay } from "../models/fridgeModel.js";
import { getShadowUserByEmail, getUserByEmail } from "../models/userModel.js";

const router = Router();

router.get('/id/:id', async (req, res) => {
    const result = await getInvitationByID(req.params.id);
    res.json(result);
});

router.get('/user/:userID', isLoggedIn, async (req, res) => {
    if (!(await isCurrentUser(req.session.user, req.params.userID))) {
        const error = new Error(`User ${req.session.user.id} is not permitted to GET invitations of user ${req.params.userID}`);
        error.status = 403;
        throw error;
    }

    const result = await getOpenInvitationsByUser(req.params.userID);
    res.json(result);
});

router.get('/fridge/:fridgeID', isLoggedIn, async (req, res) => {
    if (!(await isOwner(req.session.user.id, req.params.fridgeID))) {
        const error = new Error(`User ${req.session.user.id} is not permitted to GET invitations of fridge ${req.params.fridgeID}`);
        error.status = 403;
        throw error;
    }

    const result = await getInvitationsByFridge(req.params.fridgeID);
    res.json(result);
});

router.get('/accept/:inviteID', async (req, res) => {
    // TODO: If to shadow user, redirect to frontend /login&invite={id}&status=accept. Carry the invite throughout and once signed up, accept/decline.
    const invitation = await getInvitationByID(req.params.inviteID);
    console.log('invitation', invitation);

    if (!invitation || invitation.status !== 'PENDING') {
        const error = new Error(`Could not accept: Invitation ${req.params.inviteID} not found or not pending`);
        error.status = 403;
        throw error;
    }

    if (invitation.to_type == 'shadow') {
        res.redirect(`http://localhost:5173/login?invite=${req.params.inviteID}&status=accept`);
    } else {
        const result = await setInvitation(req.params.inviteID, 'ACCEPTED');
        if (req.query.redirect == 'true') res.redirect(`http://localhost:5173`);
        else res.json(result);
    }
});

router.get('/decline/:inviteID', isLoggedIn, async (req, res) => {
    // TODO update to match /accept
    // TODO look into DRYing this up with /handle/:id&status=accept/decline or whatever
    const invitation = await getInvitationByID(req.params.inviteID);
    if (!invitation || invitation.to_id !== req.session.user.id || invitation.status !== 'PENDING') {
        const error = new Error(`Could not decline: Invitation ${req.params.inviteID} not found or not to user ${req.session.user.id} or not pending`);
        error.status = 403;
        throw error;
    }

    const result = await setInvitation(req.params.inviteID, 'DECLINED');
    res.json(result);
});

router.post('/send', isLoggedIn, async (req, res) => {
    if (!(await isCurrentUser(req.session.user, req.body.fromID))) {
        const error = new Error(`Can not send invitation from a different user. Tried to send as: ${req.body.fromID}. You: ${req.session.user.id}`);
        error.status = 403;
        throw error;
    }

    if (!(await isOwner(req.session.user.id, req.body.fridgeID))) {
        const error = new Error(`Can not send invitation: you (${req.session.user.id}) are not the owner of this fridge (${req.body.fridgeID}).`);
        error.status = 403;
        throw error;
    }

    const existingUser = await getUserByEmail(req.body.toEmail);
    const existingShadowUser = await getShadowUserByEmail(req.body.toEmail);

    if (existingUser && (await isOwner(existingUser.id, req.body.fridgeID))) {
        const error = new Error(`Can not send invitation: invited user (${existingUser.id}) is already the owner of this fridge (${req.body.fridgeID}).`);
        error.status = 403;
        throw error;
    }

    if ((existingUser && await hasAnyInvitationToFridge(existingUser.id, req.body.fridgeID)) || (existingShadowUser && await hasAnyInvitationToFridge(existingShadowUser.id, req.body.fridgeID))) {
        const error = new Error(`Can not send invitation: invited user (${req.body.toEmail} is already invited to this fridge (${req.body.fridgeID}). They may have accepted or declined, or it may still be pending.`);
        error.status = 403;
        throw error;
    }
    // TODO check fridge not at capacity

    const fridge = await getFridgeByID(req.body.fridgeID);
    const fromUsers = await getFridgeUsersToDisplay(req.body.fridgeID); // TODO Owner-only version?
    const fromUser = fromUsers.filter(user => user.to_id == req.body.fromID)[0];

    // TODO: Jobs queue - invitation status set to 'SENDING', queue runs on a separate process and checks for invitations with SENDING statuses and tries them, eventually setting to FAILED if continues to fail. Also add col num_failures (or failures col which is just array of JSON objects/strings to capture the errors over time. Length = num_failures) to capture the number of times an invite has been tried to be sent so it can start at the earliest SENDING status and go through to the most recent invitation, then start again at the top.
    const invitation = await createInvitation(req.body.toEmail, req.body.fromID, req.body.fridgeID);

    invitation.fridgeName = fridge.name;
    invitation.fromDisplayName = fromUser.display_name;

    // TODO: Before jobs queue - just call a function that progressively-backoff tries to call this 3 times. Set to FAILED if failed after that.
    sendInvitation(req.body.toEmail, invitation);

    res.json(invitation);
});

export default router;
