import prodDB from '../db.js';

export async function setEmailVerified(email, status, db = prodDB) {
    const result = await db.query(`UPDATE email SET is_verified = $1 WHERE email = $2 RETURNING *`, [status, email]);
    return result;
}
