import session from 'express-session';
import { getFridgeById } from './models/fridgeModel.js';
import { getInvitationByID, getInvitationByDetails } from './models/invitationModel.js';

export default session({
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    secret: process.env.SESSION_SECRET,
    cookie: {
        secure: false, // set to true ONLY if using HTTPS!
        httpOnly: true,
        maxAge: 1000 * 60 * 60 // 1 hour
    }
});

// export function middlewareWrap(authFunc, ...args) {
//     console.log('middlewarewrap args', args);

//     return async (req, res, next, err) => {
//         const success = await authFunc(...args);
//         if (success) {
//             next();
//         } else {
//             next(err);
//         }
//     }
// }

// TODO: isOwnerMiddleware, isOwnerOrMemberMiddleware, isCurrentUserMiddleware Both of those are used often enough in pretty much exactly the same way. Have to look into it, but I think it would be handy to be able to call them in other ways too from within routes that aren't using them the standard way.

export async function isLoggedIn(req, res, next) {
    if (req.session.user) return next();
    else {
        const error = new Error('Not logged in');
        error.status = 401;
        throw error;
    }
}

// TODO isVerified. There are a lot of things users can't do unless they've verified their email! Like accept invitations to fridges, make fridges, move words...anything, really. Perhaps isLoggedIn should be reconfigured to isValidUser..?

export async function hasOpenInvitation(sessionUser, invitationID) {
    const invitation = await getInvitationByID(invitationID);
    console.log('invitation', invitation);

    if (invitation.status == 'PENDING' && invitation.to_id == sessionUser.id) {
        return true;
    } else {
        const error = new Error('Not owner of this resource');
        error.status = 401;
        throw error;
    }
}

export async function isOwner(sessionUser, fridgeID) {
    const fridge = await getFridgeById(fridgeID);
    if (fridge.owner_id == sessionUser.id) {
        return true;
    } else {
        return false;
    }
}

export async function isMember(sessionUser, fridgeID) {
    const invitation = await getInvitationByDetails(fridgeID, sessionUser.id);
    if (invitation && invitation.status == 'ACCEPTED') {
        return true;
    } else {
        const error = new Error('Not member of this resource');
        error.status = 401;
        throw error;
    }
}

export async function isCurrentUser(sessionUser, userID) {
    if (sessionUser.id == userID) return true;
    else {
        const error = new Error('Not owner of this resource');
        error.status = 403;
        throw error;
    }
}

// export function isAnyOf(...middlewares) {
//     return async (req, res, next) => {
//         let success = false;
//         for (const middleware of middlewares) {
//             success = await middleware(req, res, (err) => {
//                 if (err) return false;
//                 return true;
//             });
//         }
//         if (success) {
//             next();
//         } else {
//             const error = new Error('Forbidden');
//             error.status = 403;
//             throw error;
//         }
//     }
// }
