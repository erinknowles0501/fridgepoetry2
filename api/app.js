import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import session from './authorization.js';
import mountRoutes from './routes/index.js';

const app = express()
const port = 3000
app.use(cors({
    origin: process.env.APP_URL,
    credentials: true
}));
app.use(express.json());

app.use(session);
mountRoutes(app);

app.use((err, req, res, next) => {
    console.error(err.status, err.stack)
    res.status(err.status || 500).json({ failed: true, message: err.message })
})

app.get('/', (req, res) => {
    res.json({ data: 'Hello crochet catan!' })
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}: ${process.env.API_URL}`)
})
