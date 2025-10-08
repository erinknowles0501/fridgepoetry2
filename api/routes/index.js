import authRouter from './auth.js';
import fridgeRouter from './fridge.js';
import fridgesRouter from './fridges.js';
import invitationRouter from './invitations.js';
import userRouter from './user.js';
import verifyRouter from './verify.js';
import wordsRouter from './words.js';

const mountRoutes = (app) => {
    app.use('/auth', authRouter);
    app.use('/fridge', fridgeRouter);
    app.use('/fridges', fridgesRouter);
    app.use('/invitations', invitationRouter);
    app.use('/user', userRouter);
    app.use('/verify', verifyRouter);
    app.use('/words', wordsRouter);
}

export default mountRoutes
