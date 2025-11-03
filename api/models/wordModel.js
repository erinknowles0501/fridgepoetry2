import prodDB from '../db.js';

export async function getFridgeWords(fridgeID, db = prodDB) {
    const result = await db.query(`SELECT fridge_word.id, fridge_id, word_id, position_x, position_y, last_moved, last_moved_by, text FROM fridge_word
        INNER JOIN word ON fridge_word.word_id = word.id
        WHERE fridge_word.fridge_id = $1;`, [fridgeID]);

    return result.rows;
}

export async function createWordsIfNotExist(wordList, db = prodDB) {
    const result = (await db.query(`INSERT INTO word (text)
        SELECT unnest($1::text[])
        ON CONFLICT (text) DO NOTHING
        RETURNING id;`, [wordList])).rows;
    return result;
}

export async function getWordIDsFromList(wordList, db = prodDB) {
    const result = (await db.query(`SELECT id FROM word WHERE text = ANY($1::text[])`, [wordList])).rows;
    return result;
}

export async function createFridgeWords(wordIDList, fridgeID, db = prodDB) {
    // TODO Allow duplicate words
    function makePosition(limit) { return Math.round(Math.random() * limit) }

    const wordData = wordIDList.map((word) => {
        return {
            id: word.id,
            position_x: makePosition(550), // TODO: de-magic this. It's 400x600 minus some so words don't spill too much off the screen.
            position_y: makePosition(350)
        }
    });

    const result = (await db.query(`INSERT INTO fridge_word (fridge_id, word_id, position_x, position_y)
        SELECT
            $1,
            unnest($2::int[]),
            unnest($3::int[]),
            unnest($4::int[])
        RETURNING *;`, [fridgeID, wordData.map(w => w.id), wordData.map(w => w.position_x), wordData.map(w => w.position_y)])).rows;
    return result;
}

export async function moveWord(fridgeWordID, positionX, positionY, userID, db = prodDB) {
    const result = (await db.query(`UPDATE fridge_word SET 
        position_x = $1, 
        position_y = $2, 
        last_moved = NOW(), 
        last_moved_by = $3
        WHERE id = $4
        RETURNING *`, [positionX, positionY, userID, fridgeWordID])).rows[0];
    return result;
}

export async function deleteFridgeWordsByFridgeID(fridgeID, db = prodDB) {
    await db.query(`DELETE FROM fridge_word WHERE fridge_id = $1`, [fridgeID]);
}
