import { Router } from 'express';
import { signupUser, loginUser } from '../services/authService.js';
import { toCamel } from 'snake-camel';

const router = Router();

router.post('/signup', async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            const error = new Error('Email and password required');
            error.status = 401;
            throw error;
        }

        if (password.length < 10 || password.length > 100) {
            const error = new Error('Password bad length - should be at least 10 characters and no more than 100.');
            error.status = 401;
            throw error;
        }

        const user = await signupUser(email, password);
        const camelUser = {
            id: user.id,
            email: user.email, // TODO Don't love that I'm returning this
            isVerified: user.is_verified,
            emailID: user.email_id,
            createdAt: user.created_at,
            displayName: user.display_name,
            color: user.color,
            notifications: user.notifications
        }

        req.session.regenerate(() => {
            req.session.user = camelUser;
            req.session.save(() => {
                res.status(201).json(camelUser);
            });
        });
    } catch (err) {
        next(err);
    }
});

router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await loginUser(email, password);
        const camelUser = {
            id: user.id,
            email: user.email, // TODO Don't love that I'm returning this
            isVerified: user.is_verified,
            emailID: user.email_id,
            createdAt: user.created_at,
            displayName: user.display_name,
            color: user.color,
            notifications: user.notifications
        } // TODO DRY this up. It's used here twice and in PATCH /user

        req.session.regenerate(() => {
            req.session.user = camelUser;
            req.session.save(() => {
                res.json(camelUser);
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
