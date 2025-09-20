import { migrate } from '../helpers.js';

// TODO createClient() that creates instance of db with parameters name, user, pass, host, port

const isTesting = process.argv[2];
const filepath = process.argv[3];
console.log('isTesting, filepath:', isTesting, filepath);

migrate(isTesting, filepath);
