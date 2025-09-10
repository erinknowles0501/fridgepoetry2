import db from '../db.js';

export async function getFridgeWords(fridgeID) {
    const result = await db.query(`SELECT * FROM fridge_word
        INNER JOIN word ON fridge_word.word_id = word.id
        WHERE fridge_word.fridge_id = $1::int;`, fridgeID);
    return result;
}
