import { Client } from 'pg'

const client = new Client({
    user: 'postgres',
    password: 'password',
    host: 'localhost',
    port: 5432,
    database: 'fridge_poetry',
})
await client.connect();

export default client;
