import { Router } from 'express';
import { updateUserDefaults } from '../models/userModel.js';
import { isCurrentUser } from '../authorization.js';
import { loginUser } from '../services/authService.js';

const router = Router();

router.patch('/:userID', async (req, res, next) => {
    const user = await loginUser(req.body.email, req.body.password);

    if (!(isCurrentUser(req.session.user, req.params.userID))) {
        const error = new Error(`Can not PATCH user ${req.params.userID}: you are not this user. You: ${req.session.user.id}`);
        error.status = 403;
        throw error;
    }

    const result = await updateUserDefaults(req.params.userID, {
        displayName: req.body.displayName,
        color: req.body.color,
        notifications: req.body.notifications // TODO? notifications. Might remove. This isn't really a default setting per se.
    });
    console.log('result', result);

    req.session.regenerate((error) => {
        if (error) return next(error);

        const camelUser = {
            id: user.id,
            email: user.email, // TODO Don't love that I'm returning this
            isVerified: user.is_verified,
            emailID: user.email_id,
            createdAt: user.created_at,
            displayName: result.display_name,
            color: result.color,
            notifications: result.notifications
        }
        req.session.user = camelUser;

        req.session.save(async (error) => {
            if (error) return next(error);

            try {
                res.json(camelUser);
            } catch (error) {
                next(error);
            }
        });
    });
});

export default router;
