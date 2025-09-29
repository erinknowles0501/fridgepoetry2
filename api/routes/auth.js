import { Router } from 'express';
import { signupUser, loginUser } from '../services/authService.js';

const router = Router();

router.post('/signup', async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            const error = new Error('Email and password required');
            error.status = 401; // TODO
            throw error;
        }

        const user = await signupUser(email, password);
        req.session.regenerate(() => {
            req.session.user = { id: user.id, email: user.email };
        });
        req.session.user = { id: user.id, email: user.email };

        res.status(201).json({ id: user.id, email: user.email });
    } catch (err) {
        next(err);
    }
});

router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await loginUser(email, password);
        req.session.regenerate(() => {
            req.session.user = { id: user.id, email: user.email };
            req.session.save(() => {
                res.json({ id: user.id, email: user.email });
            });
        });
    } catch (err) {
        next(err);
    }
});

router.post('/logout', (req, res) => {
    req.session.destroy(() => {
        res.json({ message: "success" });
    });
});

export default router;
