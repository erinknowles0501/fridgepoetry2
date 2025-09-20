import prodDB from '../db.js';

// TODO createSetting()
// TODO getSettingByFridgeID

export async function deleteSettingByFridgeID(id, db = prodDB) {
    await db.query(`DELETE FROM setting WHERE fridge_id = $1`, [id]);
}
