import { Router } from "express";
import { getOpenInvitationsByFridge, getOpenInvitationsByUser, setInvitation } from "../models/invitationModel.js";

const router = Router();

router.get('/user/:userID', async (req, res) => {
    const result = await getOpenInvitationsByUser(req.params.userID);
    res.json(result);
});

router.get('/fridge/:fridgeID', async (req, res) => {
    const result = await getOpenInvitationsByFridge(req.params.fridgeID);
    res.json(result);
});

router.post('/accept/:inviteID', async (req, res) => {
    const result = await setInvitation(req.params.inviteID, 'ACCEPTED');
    res.json(result);
});

router.post('/decline/:inviteID', async (req, res) => {
    const result = await setInvitation(req.params.inviteID, 'DECLINED');
    res.json(result);
});

router.post('/send', async () => {
    // Create+send invitation
    /* Req:
        {
            "to": "erinknowles@gmail.com",
            "from": "userID",
            "fridge": "fridgeID"
        }
  */
});

export default router;
