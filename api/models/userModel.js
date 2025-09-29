import { toSnake } from "snake-camel";
import prodDB from '../db.js';

export async function getUserByEmail(email, db = prodDB) {
    const result = await db.query(
        `SELECT users.id, users.email_id, users.passhash, users.created_at, users.display_name, users.color, users.notifications, email.email FROM users 
        INNER JOIN email ON users.email_id = email.id
        WHERE email.email = $1`,
        [email]
    );
    return result.rows[0];
}

export async function createUser(body, db = prodDB) {
    const emailResult = (await db.query(`INSERT INTO email (email, is_verified) VALUES ($1, 'false') RETURNING *`, [body.email])).rows[0];
    const result = await db.query(
        'INSERT INTO users (email_id, passhash) VALUES ($1, $2) RETURNING *',
        [emailResult.id, body.passhash]
    );
    return result.rows[0];
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
