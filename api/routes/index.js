import fridgeRouter from './fridge.js';
import fridgesRouter from './fridges.js';
import wordsRouter from './words.js';
import authRouter from './auth.js';
import invitationRouter from './invitations.js';
import verifyRouter from './verify.js';

const mountRoutes = (app) => {
    app.use('/fridge', fridgeRouter);
    app.use('/fridges', fridgesRouter);
    app.use('/words', wordsRouter);
    app.use('/auth', authRouter);
    app.use('/invitations', invitationRouter);
    app.use('/verify', verifyRouter);
}

export default mountRoutes
