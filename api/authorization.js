import session from 'express-session';
import { getFridgeById } from './models/fridgeModel.js';

export default session({
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    secret: 'shhhh, very secret' // TODO env var with secret
});

// console.log('session', session);



// async function hash(pass) {
//     const result = await bcrypt.hash(pass, 10);
//     return result;
// }

// function restrict(req, res, next) {
//     if (req.session.user) {
//         next();
//     } else {
//         req.session.error = 'Access denied!';
//         res.redirect('/login');
//     }
// }


export async function isLoggedIn(req, res, next) {
    if (req.session.user) {
        return next();
    } else {
        const error = new Error('Not logged in');
        error.status = 401;
        return next(error);
    }
}

export async function isMember(req, res, next) {
    // if user is member (invited user) of fridge that the resource is associated with
    // member of fridge, member of fridge that the word is on...
    // fridge members can:
    /* - get fridge
    TODO
    */

}

export async function isOwner(req, res, next) {
    // if user is owner of the fridge that the resource is associated with
    // owner of fridge, owner of word on fridge...

    const fridge = await getFridgeById(req.params.id);
    if (fridge.owner_id == req.session.user.id) {
        return next();
    } else {
        const error = new Error('Not owner of this resource');
        error.status = 401;
        return next(error);
    }
}
