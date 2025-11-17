import prodDB from '../db.js';
import { createWordsIfNotExist, getWordIDsFromList, createFridgeWords, deleteFridgeWordsByFridgeID } from './wordModel.js';
import { deleteSettingByFridgeID } from './settingModel.js';
import { deleteInvitationsByFridgeID, createInvitation } from './invitationModel.js';
import { inviteSender } from '../services/mailService.js';
import { getUserByID } from './userModel.js';

export async function getFridgeByID(id, db = prodDB) {
    const result = await db.query(`SELECT * FROM fridge WHERE id = $1`, [id]);
    return result.rows[0];
}

export async function updateFridge(id, body, db = prodDB) {
    const result = await db.query(`UPDATE fridge SET name = $1::text WHERE id = $2
        RETURNING *;`, [body.name, id]);
    return result.rows[0];
}

export async function createFridge(body, db = prodDB) {
    // TODO Let creator change their default settings on fridge create.
    let fridge;

    try {
        await db.query('BEGIN;');
        fridge = (await db.query(`INSERT INTO fridge (owner_id, name)
        VALUES ($1, $2)
        RETURNING *;`, [body.ownerID, body.name])).rows[0];

        await createWordsIfNotExist(body.wordList);
        const wordIDs = await getWordIDsFromList(body.wordList);
        const fridgeWords = await createFridgeWords(wordIDs, fridge.id);

        for (let invitee of body.invitees) {
            const invitation = await createInvitation(invitee, body.ownerID, fridge.id);
            invitation.fridgeName = body.name;
            invitation.fromDisplayName = (await getUserByID(body.ownerID)).display_name;

            inviteSender(invitee, invitation);
        }
        await db.query('COMMIT;');
    } catch (e) {
        await db.query('ROLLBACK;');

        const error = new Error(`Error while creating fridge: ${e.message}`);
        error.status = 500;
        throw error;
    }

    return fridge;
}

export async function deleteFridge(id, db = prodDB) {
    let success;

    try {
        await db.query('BEGIN;');
        await deleteFridgeWordsByFridgeID(id);
        // TODO? Delete words used only by this fridge? 
        await deleteInvitationsByFridgeID(id);
        await deleteSettingByFridgeID(id);
        await db.query(`DELETE FROM fridge WHERE id = $1`, [id]);
        await db.query('COMMIT;');
        success = true;
    } catch (e) {
        await db.query('ROLLBACK;');
        success = false;

        const error = new Error(`Error while deleting fridge: ${e.message}`);
        error.status = 500;
        throw error;
    }

    return success;
}

export async function getFridgeUsersToDisplay(fridgeID, db = prodDB) {
    const result = await db.query(`SELECT user_invitation.to_id, COALESCE (setting.display_name, users.display_name) AS display_name FROM user_invitation
            INNER JOIN users ON user_invitation.to_id = users.id
            LEFT JOIN setting ON user_invitation.to_id = setting.user_id
            WHERE user_invitation.status = 'ACCEPTED'
            AND user_invitation.fridge_id = $1
            UNION ALL
            SELECT fridge.owner_id, COALESCE(setting.display_name, users.display_name) AS display_name FROM fridge
            INNER JOIN users ON fridge.owner_id = users.id
            LEFT JOIN setting ON fridge.owner_id = setting.user_id
            WHERE fridge.id = $1
            `, [fridgeID]);

    return result.rows;
}
