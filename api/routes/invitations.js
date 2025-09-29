import { Router } from "express";
import { getInvitationByID, getOpenInvitationsByFridge, getOpenInvitationsByUser, setInvitation } from "../models/invitationModel.js";
import { isLoggedIn, isCurrentUser, isOwner } from "../authorization.js";

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

router.post('/accept/:inviteID', isLoggedIn, async (req, res) => {
    const invitation = await getInvitationByID(req.params.inviteID);
    if (!invitation || !invitation.to_id !== req.session.user.id || invitation.status !== 'PENDING') {
        const error = new Error(`Could not accept: Invitation ${req.params.inviteID} not found or not to user ${req.session.user.id} or not pending`);
        error.status = 403;
        throw error;
    }

    const result = await setInvitation(req.params.inviteID, 'ACCEPTED');
    res.json(result);
});

router.post('/decline/:inviteID', isLoggedIn, async (req, res) => {
    const invitation = await getInvitationByID(req.params.inviteID);
    if (!invitation || !invitation.to_id !== req.session.user.id || invitation.status !== 'PENDING') {
        const error = new Error(`Could not delete: Invitation ${req.params.inviteID} not found or not to user ${req.session.user.id} or not pending`);
        error.status = 403;
        throw error;
    }

    const result = await setInvitation(req.params.inviteID, 'DECLINED');
    res.json(result);
});

router.post('/send', isLoggedIn, async () => {
    // TODO
    // Create+send invitation
    /* Req:
        {
            "to": "erinknowles@gmail.com",
            "from": "userID",
            "fridge": "fridgeID"
        }
    auth:
        isLoggedIn
        is 'from' current session user
        isOwner of invite's fridgeID
        invitation 'to' is not already invited to this fridge (pending, accepted, or declined)
        fridge not already at max capacity
  */
});

export default router;
