import assert from 'node:assert';
import { describe, it, before, after } from 'node:test';

import testDB from '../testdb.js';
import { getUserByEmail, createUser, updateUserDefaults } from '../../models/userModel.js';

describe('User model', async () => {
    let user;

    before(async () => {
        try {
            await testDB.query('BEGIN;');
            const email = (await testDB.query(`INSERT INTO email (email, is_verified)
                VALUES ('test@test.com', 'f')
                RETURNING *;`)).rows[0];
            user = (await testDB.query(`INSERT INTO users (email_id, passhash, display_name, color, notifications)
                VALUES ($1, 'abcde', 'Test user', 'blue', 'f')
                RETURNING *;`, [email.id])).rows[0];
        } catch (e) {
            console.log('e', e);
        }
    });

    it('can get user by email', async () => {
        const result = await getUserByEmail(testDB, 'test@test.com');
        assert.equal(result.email, 'test@test.com');
        assert.equal(result.color, 'blue');
    });

    it(`doesn't get nonexistent user`, async () => {
        const result = await getUserByEmail(testDB, 'bademail@test.com');
        assert.equal(result, undefined);
    });

    it('can create user', async () => {
        const newUser = {
            email: 'newtest@test.com',
            passhash: 'aaaa'
        };
        const result = await createUser(testDB, newUser);
        assert.equal(result.passhash, newUser.passhash);
    });

    it('can update user default display name, color, notifications settings', async () => {
        const newDetails = {
            displayName: 'New name',
            color: 'brown',
            notifications: true
        };
        const result = await updateUserDefaults(testDB, user.id, newDetails);
        result.displayName = result.display_name;
        assert.partialDeepStrictEqual(result, newDetails);
    });

    after(async () => {
        await testDB.query('ROLLBACK;');
    });
});
