import prodDB from '../db.js';

export async function getFridgesByUserId(userID, db = prodDB) {
    // Should sort by:
    // Pending invitations, sorted by send date
    // Fridges and accepted invitations, sorted by last changed
    const myFridges = (await db.query(`SELECT fridge.id, name, fridge_word.last_moved AS last_changed FROM fridge
        LEFT JOIN user_invitation ON fridge.id = user_invitation.fridge_id AND user_invitation.to_id = $1 AND user_invitation.status = 'ACCEPTED'
        INNER JOIN fridge_word ON fridge.id = fridge_word.fridge_id OR user_invitation.fridge_id = fridge_word.fridge_id
        WHERE fridge.owner_id = $1 OR user_invitation.to_id = $1
        ORDER BY fridge_word.last_moved DESC`, [userID])).rows;
    const invitedFridges = (await db.query(`SELECT fridge.id, name, status, user_invitation.id AS invite_id, user_invitation.created_at FROM fridge
        INNER JOIN user_invitation ON fridge.id = user_invitation.fridge_id
        WHERE user_invitation.to_id = $1 AND user_invitation.status = 'PENDING'
        ORDER BY user_invitation.created_at DESC`, [userID])).rows;
    return [...invitedFridges, ...myFridges];
}
