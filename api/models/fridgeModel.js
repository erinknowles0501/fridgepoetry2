import db from '../db.js';

export async function getFridgeById(id) {
    const result = await db.query(`SELECT * FROM fridge WHERE id = $1::int`, [id]);
    return result.rows[0];
}

export async function updateFridge(id, body) {
    const result = await db.query(`UPDATE fridge SET name = $1::text WHERE id = $2::int
        RETURNING *;`, [body.name, id]);
    return result.rows[0];
}

export async function createFridge(body) {
    const result = await db.query(`INSERT INTO fridge (owner_id, name, word_list)
        VALUES ($1::int, $2::text, $3)
        RETURNING *;`, [body.ownerID, body.name, body.wordList]);
    return result.rows[0];
}
