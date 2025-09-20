export async function getUserByEmail(db, email) {
    const result = await db.query(
        `SELECT * FROM users 
        INNER JOIN email ON users.email_id = email.id
        WHERE email.email = $1`,
        [email]
    );
    return result.rows[0];
}

export async function createUser(db, body) {
    const emailResult = (await db.query(`INSERT INTO email (email, is_verified) VALUES ($1, 'f') RETURNING *`, [body.email])).rows[0];
    const result = await db.query(
        'INSERT INTO users (email_id, passhash) VALUES ($1, $2) RETURNING *',
        [emailResult.id, body.passhash]
    );
    return result.rows[0];
}

export async function updateUserDefaults(db, userID, body) {
    if (body.displayName) {
        await db.query(
            'UPDATE users SET display_name = $1 WHERE id = $2',
            [body.displayName, userID]
        );
    }
    if (body.color) {
        await db.query(
            'UPDATE users SET color = $1 WHERE id = $2',
            [body.color, userID]
        );
    }
    if (body.notifications) {
        await db.query(
            'UPDATE users SET notifications = $1 WHERE id = $2',
            [body.notifications, userID]
        );
    }
    const result = await db.query(`SELECT * FROM users WHERE id = $1`, [userID]);
    return result.rows[0];
}
