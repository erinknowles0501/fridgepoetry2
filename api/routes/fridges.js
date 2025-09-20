import { Router } from 'express';
import { getFridgesByUserId } from '../models/fridgesModel.js';
import { isLoggedIn, isOwner } from '../authorization.js';

const router = Router();

router.get('/list/:userID', async (req, res) => {
    const result = await getFridgesByUserId(req.params.userID);
    res.json(result);
});


export default router;
