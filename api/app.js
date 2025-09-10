import express from 'express';
import cors from 'cors';

import session from './authorization.js';
import mountRoutes from './routes/index.js';

const app = express()
const port = 3000
app.use(cors());
app.use(express.json());

app.use(session);
mountRoutes(app);

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})

app.get('/', (req, res) => {
    res.json({ data: 'Hello crochet catan!' })
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}: http://localhost:${port}`)
})
