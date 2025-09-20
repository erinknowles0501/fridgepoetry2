import prodDB from '../db.js';
import { createWordsIfNotExist, getWordIDsFromList, createFridgeWords, deleteFridgeWordsByFridgeID } from './wordModel.js';
import { deleteSettingByFridgeID } from './settingModel.js';

export async function getFridgeById(id, db = prodDB) {
    const result = await db.query(`SELECT * FROM fridge WHERE id = $1`, [id]);
    return result.rows[0];
}

export async function updateFridge(id, body, db = prodDB) {
    const result = await db.query(`UPDATE fridge SET name = $1::text WHERE id = $2
        RETURNING *;`, [body.name, id]);
    return result.rows[0];
}

export async function createFridge(body, db = prodDB) {
    // TODO Invite the list of invitees
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
        await db.query('COMMIT;');
    } catch (e) {
        console.log('e', e);
        await db.query('ROLLBACK;');
    }

    return !!fridge; // TODO Error handling!?!?
}

export async function deleteFridge(id, db = prodDB) {
    let success;

    try {
        await db.query('BEGIN;');
        await deleteFridgeWordsByFridgeID(id);
        // TODO? Delete words used only by this fridge? 
        // TODO Delete invitations to this fridge
        await deleteSettingByFridgeID(id);
        await db.query(`DELETE FROM fridge WHERE id = $1`, [id]);
        await db.query('COMMIT;');
        success = true;
    } catch (e) {
        console.log('e', e);
        await db.query('ROLLBACK;');
        success = false;
    }

    return success;
}
