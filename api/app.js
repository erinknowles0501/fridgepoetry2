import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import session from './authorization.js';
import mountRoutes from './routes/index.js';

const app = express()
const port = 3000
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());

app.use(session);
mountRoutes(app);

app.use((err, req, res, next) => {
    console.error(err.status, err.stack)
    res.status(err.status || 500).json({ success: false, message: err.message })
})

app.get('/', (req, res) => {
    res.json({ data: 'Hello crochet catan!' })
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}: http://localhost:${port}`)
})
