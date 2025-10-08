import prodDB from '../db.js';

export async function getFridgesByUserId(userID, db = prodDB) {
    // TODO also get created_at when you reset db and that col exists
    const ownedFridges = (await db.query(`SELECT fridge.id, name FROM fridge
        WHERE owner_id = $1`, [userID])).rows;
    const invitedFridges = (await db.query(`SELECT fridge.id, name, status, user_invitation.id as invite_id FROM fridge
        INNER JOIN user_invitation ON fridge.id = user_invitation.fridge_id
        WHERE user_invitation.to_id = $1 AND user_invitation.status != 'DECLINED'`, [userID])).rows;
    return [...ownedFridges, ...invitedFridges];
}
