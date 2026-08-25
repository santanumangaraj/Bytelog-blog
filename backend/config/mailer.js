import "dotenv/config";
import nodemailer from "nodemailer";

const smtpHost = process.env.SMTP_HOST;
const smtpPort = Number(process.env.SMTP_PORT) || 587;
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;

// Unlike S3 (config/s3.js), which hard-fails at boot because avatar upload
// is core to registration, SMTP is allowed to be unconfigured — the server
// still starts, and only the password-reset request fails (loudly) if
// someone actually triggers it. Mirrors how Redis is treated as optional
// at boot in app.js.
let transporter = null;

if (smtpHost && smtpUser && smtpPass) {
    transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465, // true for 465 (implicit TLS), false uses STARTTLS on 587/others
        auth: {
            user: smtpUser,
            pass: smtpPass,
        },
    });
} else {
    console.warn(
        "⚠️  SMTP is not configured (SMTP_HOST/SMTP_USER/SMTP_PASS missing) — password-reset emails will fail until it's set in .env."
    );
}

export default transporter;
