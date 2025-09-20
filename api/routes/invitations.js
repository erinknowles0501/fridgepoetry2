import { Router } from "express";
import { getOpenInvitationsByFridge, getOpenInvitationsByUser, setInvitation } from "../models/invitationModel.js";

const router = Router();

router.get('/user/:userID', async (req, res) => {
    const result = await getOpenInvitationsByUser(req.params.userID);
    console.log('result', result);
    res.json(result);
});

router.get('/fridge/:fridgeID', async (req, res) => {
    const result = await getOpenInvitationsByFridge(req.params.fridgeID);
    console.log('result', result);
    res.json(result);
});

router.post('/accept/:inviteID', async (req, res) => {
    const result = await setInvitation(req.params.inviteID, 'ACCEPTED');
    console.log('result', result);
    res.json(result);
});

router.post('/decline/:inviteID', async (req, res) => {
    const result = await setInvitation(req.params.inviteID, 'DECLINED');
    console.log('result', result);
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
