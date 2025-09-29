import { Router } from 'express';
import jwt from 'jsonwebtoken';

import { setEmailVerified } from '../models/emailModel.js';

const router = Router();

router.get('/:token', async (req, res) => {
    const payload = jwt.verify(req.params.token, process.env.EMAIL_VERIFICATION_SECRET);
    console.log('payload', payload);

    await setEmailVerified(payload.email, true);

    res.redirect('http://localhost:5173/confirmSignup');
});

export default router;
