import { Router } from 'express';
import jwt from 'jsonwebtoken';

import { setEmailVerified } from '../models/emailModel.js';

const router = Router();

router.get('/:token', async (req, res) => {
    const payload = jwt.verify(req.params.token, process.env.EMAIL_VERIFICATION_SECRET);
    console.log('payload', payload);

    const newUser = await setEmailVerified(payload.email, true);
    req.session.user.isVerified = true;

    res.redirect(process.env.APP_URL + `/confirmSignup?user=${newUser.rows[0].id}&email=${payload.email}`);
});

export default router;
