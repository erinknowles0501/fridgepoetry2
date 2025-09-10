import db from '../db.js';

export async function getUserByEmail(email) {
    console.log('email', email);

    const result = await db.query(
        `SELECT * FROM users 
        INNER JOIN email ON users.email_id = email.id
        WHERE email.email = $1`,
        [email]
    );

    return result.rows[0];
}

export async function createUser(email, passwordHash) {
    const result = await db.query(
        'INSERT INTO users (email, passhash) VALUES ($1, $2) RETURNING *',
        [email, passwordHash]
    );
    return result.rows[0];
}
