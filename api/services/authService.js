import bcrypt from 'bcrypt';

import { getUserByEmail, createUser } from '../models/userModel.js';
import { sendVerificationEmail } from './mailService.js';

const SALT_ROUNDS = 10;

export async function signupUser(email, password) {
    const userExists = await getUserByEmail(email);
    if (userExists) {
        const error = new Error(`User ${email} already exists`);
        error.status = 400;
        throw error;
    }

    const passhash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await createUser({
        email,
        passhash
    });

    await sendVerificationEmail(email);

    return user;
}

export async function loginUser(email, password) {
    const user = await getUserByEmail(email);
    if (!user) {
        const error = new Error(`Invalid email or password`);
        error.status = 400;
        throw error;
    }

    const valid = await bcrypt.compare(password, user.passhash);
    if (!valid) {
        const error = new Error('Invalid email or password');
        error.status = 401;
        throw error;
    }
    return user;
}
