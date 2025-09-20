import assert from 'node:assert';
import { describe, it, before, after } from 'node:test';

import testDB from './testdb.js';


// TODO: Run create-tables sql

const fridgeSQL = `
WITH new_fridge AS (
    INSERT INTO fridge (name, owner_id)
    VALUES ('Test fridge', 1)
    RETURNING id
),
new_word AS (
    INSERT INTO word (text)
    VALUES ('testing')
    RETURNING id
)
INSERT INTO fridge_word (
    fridge_id,
    word_id,
    position_x,
    position_y
)
SELECT
    new_fridge.id,
    new_word.id,
    100,
    200
FROM new_fridge, new_word
RETURNING *;
`;

import { getFridgeById, updateFridge, createFridge } from '../models/fridgeModel.js';
import { getFridgeWords } from '../models/wordModel.js';

describe('Fridge management', async () => {
    let newFridge, newWord, newFridgeWord;

    before(async () => {
        await testDB.query('BEGIN;');
        await testDB.query(fridgeSQL);

        try {
            newFridge = (await testDB.query(`SELECT * FROM fridge WHERE name = 'Test fridge'`)).rows[0];
            newWord = (await testDB.query(`SELECT * FROM word WHERE text = 'testing'`)).rows[0];
            newFridgeWord = (await testDB.query(`SELECT * FROM fridge_word WHERE fridge_id = $1 AND word_id = $2`, [newFridge.id, newWord.id])).rows[0];
        } catch (e) {
            console.log('e', e);
        }
    });

    it('can get fridge by id', async () => {
        const result = await getFridgeById(testDB, newFridge.id);
        assert.strictEqual(newFridge.id, result.id);
    });

    it('can update fridge', async () => {
        const newName = 'New fridge name';
        const result = await updateFridge(testDB, newFridge.id, { name: newName });
        assert.strictEqual(newName, result.name);
    });

    it('can create fridge', async () => {
        const newFridge = {
            ownerID: 1,
            name: 'My new fridge'
        }

        const result = await createFridge(testDB, newFridge);
        assert.equal(result.owner_id, newFridge.ownerID);
        assert.equal(result.name, newFridge.name);
    });

    it('can get fridge words', async () => {
        const result = (await getFridgeWords(testDB, newFridge.id))[0];

        assert.equal(result.id, newFridgeWord.id);
        assert.deepStrictEqual([
            result.word_id,
            result.position_x,
            result.position_y,
        ], [
            newFridgeWord.word_id,
            newFridgeWord.position_x,
            newFridgeWord.position_y
        ]);
    });


    after(async () => {
        await testDB.query('ROLLBACK;');
    });
});
