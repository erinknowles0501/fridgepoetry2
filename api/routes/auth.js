import { Router } from 'express';
import { signupUser, loginUser } from '../services/authService.js';
import { toCamel } from 'snake-camel';

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
            req.session.user = toCamel(user);
        });
        req.session.user = toCamel(user);
        // TODO I don't like how I'm returning user.passhash and user.email. 

        res.status(201).json(toCamel(user));
    } catch (err) {
        next(err);
    }
});

router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await loginUser(email, password);
        req.session.regenerate(() => {
            req.session.user = toCamel(user);
            req.session.save(() => {
                res.json(toCamel(user));
                // TODO I don't like how I'm returning user.passhash and user.email. 
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

router.get('/check-session', (req, res) => {
    if (req.session && req.session.user) {
        res.status(200).json({ isLoggedIn: true, user: req.session.user });
    } else {
        res.status(200).json({ isLoggedIn: false });
    }
});

export default router;
