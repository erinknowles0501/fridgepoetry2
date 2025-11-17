import nodemailer from 'nodemailer';
import 'dotenv/config'
import jwt from 'jsonwebtoken';
import { DateTime } from 'luxon';
import { setInvitation } from '../models/invitationModel.js';
import { setTimeout as asyncTimeout } from 'node:timers/promises';

const transporter = nodemailer.createTransport({
    service: "SendinBlue",
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});
await transporter.verify();

export async function sendVerificationEmail(email) {
    // TODO cooldown on emails sent
    const exp = DateTime.now().plus({ minutes: 30 }).toUnixInteger();
    const token = jwt.sign({ exp, email }, process.env.EMAIL_VERIFICATION_SECRET);

    const sentMail = await transporter.sendMail({
        from: `"Fridge Poetry" <${process.env.SENDER_ADDRESS}>`,
        to: email,
        subject: "Verify your email address for Fridge Poetry",
        text: `Click this link to verify your email address and get started! ${process.env.API_URL}/verify/${token}`,
        html: `<p>Click this link to verify your email address and get started! <a href="${process.env.API_URL}/verify/${token}">Click here</a></p>`
    });
    console.log('sentMail', sentMail);
}

export async function sendInvitation(email, invitation) {
    // TODO cooldown on emails sent.

    const sentMail = await transporter.sendMail({
        from: `"Fridge Poetry <${process.env.SENDER_ADDRESS}>`,
        to: email,
        subject: `${invitation.fromDisplayName} invited you to join their fridge!`,
        text: `${invitation.fromDisplayName} invited you to join their fridge, ${invitation.fridgeName}. Accept invitation: ${process.env.API_URL}/invitations/accept/${invitation.id}?redirect=true   Decline invitation: ${process.env.API_URL}/invitations/decline/${invitation.id}?redirect=true`,
        html: `
        <h1>${invitation.fromDisplayName} invited you to join their fridge, ${invitation.fridgeName}!</h1>
        <p>To accept the invitation, <a href="${process.env.API_URL}/invitations/accept/${invitation.id}?redirect=true">Click here</a></p>
        <p>To decline the invitation, <a href="${process.env.API_URL}/invitations/decline/${invitation.id}?redirect=true">Click here</a></p>
        `
    });
    await setInvitation(invite.id, 'PENDING');

    console.log('sentMail', sentMail);
}

export async function inviteSender(to, invite) {
    await setInvitation(invite.id, 'SENDING');

    let success = false;
    for (let attempt of [1, 2, 3]) {
        success = await asyncTimeout((attempt ** 3) * 1000, new Promise(async (resolve, reject) => {
            try {
                await sendInvitation(to, invite);
                resolve(true);
            } catch (e) {
                console.error(e);
                resolve(false);
            }
        }));
        if (success) break;
    }

    if (success === false) {
        await setInvitation(invite.id, 'FAILED');
    }
}
