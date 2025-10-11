import nodemailer from 'nodemailer';
import 'dotenv/config'
import jwt from 'jsonwebtoken';
import { DateTime } from 'luxon';

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
        text: `Click this link to verify your email address and get started! http://localhost:3000/verify/${token}`,
        html: `<p>Click this link to verify your email address and get started! <a href="http://localhost:3000/verify/${token}">Click here</a></p>`
    });
    console.log('sentMail', sentMail);
}

export async function sendInvitation(email, invitation) {
    // TODO cooldown on emails sent.

    try {
        const sentMail = await transporter.sendMail({
            from: `"Fridge Poetry <${process.env.SENDER_ADDRESS}>`,
            to: email,
            subject: `${invitation.fromDisplayName} invited you to join their fridge!`,
            text: `${invitation.fromDisplayName} invited you to join their fridge, ${invitation.fridgeName}. Accept invitation: http://localhost:3000/invitations/accept/${invitation.id}?redirect=true   Decline invitation: http://localhost:3000/invitations/decline/${invitation.id}?redirect=true`,
            html: `
        <h1>${invitation.fromDisplayName} invited you to join their fridge, ${invitation.fridgeName}!</h1>
        <p>To accept the invitation, <a href="http://localhost:3000/invitations/accept/${invitation.id}?redirect=true">Click here</a></p>
        <p>To decline the invitation, <a href="http://localhost:3000/invitations/decline/${invitation.id}?redirect=true">Click here</a></p>
        `
        });
        // TODO invitation.status = PENDING

        console.log('sentMail', sentMail);
    } catch (e) {
        console.log('e', e);
        // TODO invitation.status = FAILED
    }

}
