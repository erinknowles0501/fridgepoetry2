import { Router } from 'express';
import { getFridgesByUserId } from '../models/fridgesModel.js';
import { isLoggedIn, isCurrentUser } from '../authorization.js';

const router = Router();

router.get('/list/:userID', isLoggedIn, async (req, res) => {
    if (!(isCurrentUser(req.session.user, req.params.userID))) {
        const error = new Error(`Cannot get fridges for user ${req.params.userID}: current user ID mismatch (${req.session.user.id})`);
        error.status = 403;
        throw error;
    }
    const result = await getFridgesByUserId(req.params.userID);
    res.json(result);
});


export default router;
