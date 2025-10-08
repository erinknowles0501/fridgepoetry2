import { Router } from "express";
import { getInvitationByID, getOpenInvitationsByFridge, getOpenInvitationsByUser, setInvitation, createInvitation } from "../models/invitationModel.js";
import { isLoggedIn, isCurrentUser, isOwner } from "../authorization.js";
import { sendInvitation } from "../services/mailService.js";
import { getFridgeById, getFridgeUsersToDisplay } from "../models/fridgeModel.js";

const router = Router();

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
    if (!(await isOwner(req.session.user, req.params.fridgeID))) {
        const error = new Error(`User ${req.session.user.id} is not permitted to GET invitations of fridge ${req.params.fridgeID}`);
        error.status = 403;
        throw error;
    }

    const result = await getOpenInvitationsByFridge(req.params.fridgeID);
    res.json(result);
});

router.get('/accept/:inviteID', isLoggedIn, async (req, res) => {
    // TODO: If not logged in, redirect to frontend /login&invite={id}. Carry the invite throughout and once logged in / signed up, accept/decline.
    const invitation = await getInvitationByID(req.params.inviteID);
    console.log('invitation', invitation);

    if (!invitation || invitation.to_id !== req.session.user.id || invitation.status !== 'PENDING') {
        const error = new Error(`Could not accept: Invitation ${req.params.inviteID} not found or not to user ${req.session.user.id} or not pending`);
        error.status = 403;
        throw error;
    }

    const result = await setInvitation(req.params.inviteID, 'ACCEPTED');
    res.json(result);
});

router.get('/decline/:inviteID', isLoggedIn, async (req, res) => {
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
    // TODO
    /*
    auth:
        isLoggedIn
        is 'from' current session user
        isOwner of invite's fridgeID
        invitation 'to' is not already invited to this fridge (pending, accepted, or declined) AND is not fridge owner
            Right now this encompasses everyone already using the fridge. In the future (if we implement changing fridge owner, or permissions to let members invite other members) we might have to be smarter.
        fridge exists and not already at max capacity
  */
    console.log('req.body', req.body);

    const fridge = await getFridgeById(req.body.fridgeID);
    const fromUsers = await getFridgeUsersToDisplay(req.body.fridgeID);
    console.log('fromUsers', fromUsers);

    // TODO: Jobs queue - invitation status set to 'SENDING', queue runs on a separate process and checks for invitations with SENDING statuses and tries them, eventually setting to FAILED if continues to fail. Also add col num_failures (or failures col which is just array of JSON objects/strings to capture the errors over time. Length = num_failures) to capture the number of times an invite has been tried to be sent so it can start at the earliest SENDING status and go through to the most recent invitation, then start again at the top.
    const invitation = await createInvitation(req.body.toEmail, req.body.fromID, req.body.fridgeID);
    console.log('invitation', invitation);

    invitation.fridgeName = fridge.name;
    invitation.fromDisplayName = fromUsers.filter(user => user.to_id == req.body.fromID).display_name;

    sendInvitation(req.body.toEmail, invitation);

    res.json(invitation);
});

export default router;
