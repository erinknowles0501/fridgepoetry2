import { Router } from 'express';
import { updateUserDefaults } from '../models/userModel.js';
import { isCurrentUser } from '../authorization.js';
import { loginUser } from '../services/authService.js';

const router = Router();

router.patch('/:userID', async (req, res) => {
    const user = await loginUser(req.body.email, req.body.password);
    req.session.regenerate(() => {
        req.session.user = { id: user.id, email: user.email };
        req.session.save(async () => {
            if (!(await isCurrentUser(req.session.user, req.params.userID))) {
                const error = new Error(`Can not PATCH user ${req.params.userID}: you are not this user. You: ${req.session.user.id}`);
                error.status = 403;
                throw error;
            }

            const result = await updateUserDefaults(req.params.userID, {
                displayName: req.body.displayName,
                color: req.body.color,
                notifications: req.body.notifications // TODO notifications. Might remove. This isn't really a default setting per se.
            });

            res.json(result);
        });
    });
});

export default router;
