import prodDB from '../db.js';

export async function getFridgesByUserId(userID, db = prodDB) {
    // TODO also get created_at when you reset db and that col exists
    // TODO do not include fridges you've declined an invitation to!
    const result = (await db.query(`SELECT fridge.id, name FROM fridge
        WHERE owner_id = $1
        UNION
        SELECT fridge.id, name FROM fridge
        INNER JOIN user_invitation ON fridge.id = user_invitation.fridge_id
        WHERE user_invitation.to_id = $1`, [userID])).rows;
    return result;
}
