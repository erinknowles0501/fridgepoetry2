import { readFileSync } from 'node:fs';

import db from '../db.js';
import testDB from '../tests/testdb.js';

async function migrate(isTesting = false, filepath) {
    const dbToUse = JSON.parse(isTesting) ? testDB : db;
    const sqlFile = readFileSync(filepath, 'utf-8');
    //console.log('sql', sqlFile);

    const statements = sqlFile
        .split('/;\s*$/gm') // regex for semicolons at ends of lines
        .map(s => s.trim())
        .filter(s => s.length > 0);

    await dbToUse.query('BEGIN;');
    try {
        for (const statement of statements) {
            console.log('statement', statement);

            await dbToUse.query(statement);
        }
        await dbToUse.query('COMMIT;');
    } catch (e) {
        console.log(e);
        await dbToUse.query('ROLLBACK;');
    }
    await db.end();
}
export default migrate;

const isTesting = process.argv[2];
const filepath = process.argv[3];
console.log('isTesting, filepath', isTesting, filepath);

migrate(isTesting, filepath);
