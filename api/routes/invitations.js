import { Router } from "express";
const router = Router();

router.get('/user/:userID', async () => {
    // Get open invitation by user
    /* Res:
        {
            id: "invite1",
            fridgeID: "fridge1",
            fridgeName: "Alice's fridge",
            fromDisplayName: "Alice",
        },
        { ... }
         */
});

router.get('/fridge/:fridgeID', async () => {
    // Get open invitations by fridge
    // Res: { to: 'erin@knowles.com', sendDate: '2025-04-01' },
});

router.post('/accept/:inviteID', async () => {
    // Accept invitation
    /* Req:
        {
            "id": "inviteUID",
            "to": "erin@knowles.com",
            "fridge": "fridgeID",
            "////...TODO. Want it to verify on backend. What else does it need?
        }
  */
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
