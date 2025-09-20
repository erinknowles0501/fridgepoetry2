export async function getFridgeById(db, id) {
    const result = await db.query(`SELECT * FROM fridge WHERE id = $1::int`, [id]);
    return result.rows[0];
}

export async function updateFridge(db, id, body) {
    const result = await db.query(`UPDATE fridge SET name = $1::text WHERE id = $2::int
        RETURNING *;`, [body.name, id]);
    return result.rows[0];
}

export async function createFridge(db, body) {
    const result = await db.query(`INSERT INTO fridge (owner_id, name)
        VALUES ($1, $2)
        RETURNING *;`, [body.ownerID, body.name]);
    return result.rows[0];
}
