import prodDB from '../db.js';

export async function getInvitationByID(invitationID, db = prodDB) {
    const result = await db.query(`SELECT * FROM user_invitation WHERE id = $1`, [invitationID]);
    return result.rows[0];
}

export async function getInvitationByDetails(fridgeID, userID, db = prodDB) {
    const result = await db.query(`SELECT * FROM user_invitation WHERE fridge_id = $1
        AND to_id = $2`, [fridgeID, userID]);
    return result.rows[0];
}

export async function createInvitation(toEmail, fromID, fridgeID, db = prodDB) {
    // check if toEmail is associated with existing user
    //   if it is, create a user_invitation invite
    // if it isn't, check if it's in shadow_user
    //   if it isn't, create a shadow user with that email
    //   either way, create invitation_to_unknown invite
    let table, userID;

    const existingUser = (await db.query(`SELECT users.id, users.email_id, users.display_name, email.email, email.is_verified FROM users
        INNER JOIN email ON users.email_id = email.id
        WHERE email.email = $1`, [toEmail])).rows[0];
    console.log('existingUser', existingUser);

    if (existingUser) {
        table = 'user_invitation';
        userID = existingUser.id;
    } else {
        let existingShadowUser = (await db.query(`SELECT * FROM shadow_user WHERE email = $1`, [toEmail])).rows[0];

        console.log('existingShadowUser', existingShadowUser);

        if (!existingShadowUser) {
            existingShadowUser = (await db.query(`INSERT INTO shadow_user (email) VALUES ($1) RETURNING *`, [toEmail])).rows[0];
            console.log('existingShadowUser after insert', existingShadowUser);
        }

        table = 'invitation_to_unknown';
        userID = existingShadowUser.id;

    }

    console.log('database, userID', table, userID);

    const invite = (await db.query(`INSERT INTO ${table} (fridge_id, from_id, to_id, status) 
            VALUES ($1, $2, $3, 'PENDING')
            RETURNING *`, [fridgeID, fromID, userID])).rows[0];
    console.log('invite', invite);

    return invite;

}

export async function deleteInvitationsByFridgeID(fridgeID, db = prodDB) {
    // This is called from within deleteFridgeByID, which is itself wrapped in a transaction. Otherwise you'd need one here.
    const resultUserInvitations = await db.query(`DELETE FROM user_invitation WHERE fridge_id = $1`, [fridgeID]);
    const resultUnknown = await db.query(`DELETE FROM invitation_to_unknown WHERE fridge_id = $1`, [fridgeID]);
}

export async function getOpenInvitationsByFridge(fridgeID, db = prodDB) {
    // Also returns DECLINED for reasons of not re-inviting someone who has declined an invite.

    const emailResult = await db.query(`SELECT to_id, invitation_to_unknown.created_at, email, status FROM invitation_to_unknown 
    INNER JOIN shadow_user ON invitation_to_unknown.to_id = shadow_user.id
    WHERE fridge_id = $1`, [fridgeID]);
    const userResult = await db.query(`SELECT to_id, user_invitation.created_at, email, status FROM user_invitation 
    INNER JOIN users ON user_invitation.to_id = users.id
    INNER JOIN email ON users.email_id = email.id
    WHERE fridge_id = $1 AND status IN ('PENDING', 'DECLINED')`, [fridgeID]);

    const result = [...emailResult.rows, ...userResult.rows].map(invite => {
        return { to: invite.email, createdAt: invite.created_at, status: invite.status }
    });
    return result;
}

export async function getOpenInvitationsByUser(userID, db = prodDB) {
    const result = await db.query(`SELECT to_id, from_id, created_at, user_invitation.fridge_id, fridge.name, status, display_name FROM user_invitation 
    INNER JOIN fridge ON user_invitation.fridge_id = fridge.id
    INNER JOIN setting
      ON setting.user_id = user_invitation.from_id
      AND setting.fridge_id = user_invitation.fridge_id
    WHERE user_id = $1 AND status = 'PENDING'`, [userID]);

    return result.rows.map(invite => {
        return {
            id: invite.id,
            fridgeID: invite.fridge_id,
            fridgeName: invite.fridge_name,
            fromDisplayName: invite.display_name,
            createdAt: invite.createdAt
        }
    });
}

export async function setInvitation(inviteID, status, db = prodDB) {
    // takes id, to_id, fridgeID
    // TODO: 'Accepting' invitation_to_unknown invite requires registration of the user, deletion of the old invite, and creation of a user_invitation row.
    // At this point in the process we can assume the user has been created. This means we just have to check whether invite id is in invitation_to_unknown, and move it if it is.

    const result = await db.query(`UPDATE user_invitation
        SET status = $1
        WHERE id = $2 AND status != $1
        RETURNING *`, [status, inviteID]);

    return result.rows[0];
}
