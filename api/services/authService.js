import bcrypt from 'bcrypt';

import { getUserByEmail, createUser } from '../models/userModel.js';

const SALT_ROUNDS = 10;

export async function signupUser(email, password) {
    const userExists = await getUserByEmail(email);
    if (userExists) {
        throw new Error(`User ${email} already exists`);
    }

    const passhash = await bcrypt.hash(password, SALT_ROUNDS);
    return await createUser(db, {
        email,
        passhash
    }
    );
}

export async function loginUser(email, password) {
    const user = await getUserByEmail(email);
    if (!user) {
        throw new Error('Invalid email or password');
    }

    const valid = await bcrypt.compare(password, user.passhash);
    if (!valid) {
        throw new Error('Invalid email or password');
    }

    return user;
}
