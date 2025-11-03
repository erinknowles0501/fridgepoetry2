import { toSnake } from "snake-camel";
import prodDB from '../db.js';

export async function getUserByEmail(email, db = prodDB) {
    const result = await db.query(
        `SELECT users.id, users.email_id, users.passhash, users.created_at, users.display_name, users.color, users.notifications, email.email, email.is_verified FROM users 
        INNER JOIN email ON users.email_id = email.id
        WHERE email.email = $1`,
        [email]
    );
    return result.rows[0];
}

export async function getShadowUserByEmail(email, db = prodDB) {
    const result = await db.query(
        `SELECT * FROM shadow_user 
        WHERE email = $1`,
        [email]
    );
    return result.rows[0];
}

export async function getUserByID(id, db = prodDB) {
    const result = await db.query(`SELECT * from users WHERE id = $1`, [id]);
    return result.rows[0];
}

export async function createUser(body, db = prodDB) {
    try {
        await db.query('BEGIN;');
        const emailResult = (await db.query(`INSERT INTO email (email, is_verified) VALUES ($1, 'false') RETURNING *`, [body.email])).rows[0];
        const userResult = (await db.query(
            'INSERT INTO users (email_id, passhash) VALUES ($1, $2) RETURNING *',
            [emailResult.id, body.passhash]
        )).rows[0];
        console.log('userResult', userResult);

        // If shadow user exists (ie, if this email has been invited before) convert the invitations to user_invitations.
        // Invitations cannot be accepted or declined until the user exists, so they can only be PENDING (or SENDING, once the invitation service is up).
        // TODO: What happens when an invitation is revoked? Is there logic here to check for whether there's any pending invites,
        // or is there logic in invitation_revoke to destroy the shadow_user if it has no more invites?
        const shadowUser = (await db.query(`SELECT * from shadow_user WHERE email = $1`, [body.email])).rows[0];
        if (shadowUser) {
            const userInvitations = (await db.query(`INSERT INTO user_invitation (fridge_id, from_id, to_id, status)
            SELECT fridge_id, from_id, $1 AS to_id, status FROM invitation_to_unknown
            WHERE to_id = $2
            RETURNING *`, [userResult.id, shadowUser.id])).rows;

            console.log('shadowUser, userInvitations', shadowUser, userInvitations);

            const deleteInvitesResult = (await db.query(`DELETE FROM invitation_to_unknown WHERE to_id = $1`, [shadowUser.id])).rows;
            const deleteShadowUserResult = (await db.query(`DELETE FROM shadow_user WHERE id = $1`, [shadowUser.id])).rows;
        }

        await db.query('COMMIT;');
        return { ...emailResult, ...userResult }; // If you reverse this order, emailResult.id overwrites userResult.id :)
    } catch (e) {
        await db.query('ROLLBACK;');

        const error = new Error(`Error while creating user: ${e.message}`);
        error.status = 500;
        throw error;
    }

}

export async function updateUserDefaults(userID, body, db = prodDB) {
    const safeBody = Object.entries(toSnake(body)).filter(([key, value]) => {
        return key == 'display_name' ||
            key == 'color' ||
            key == 'notifications';
    });

    for (const [key, value] of safeBody) {
        await db.query(`UPDATE users SET ${key} = $1 WHERE id = $2`, [value, userID]);
    }

    const result = await db.query(`SELECT * FROM users WHERE id = $1`, [userID]);
    return result.rows[0];
}
