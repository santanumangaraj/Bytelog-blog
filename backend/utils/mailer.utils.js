import transporter from "../config/mailer.js";
import { ApiError } from "./ApiError.js";

const sendPasswordResetEmail = async (toEmail, resetUrl) => {
    if (!transporter) {
        throw new ApiError(500, "Email sending is not configured on this server");
    }

    await transporter.sendMail({
        from: process.env.MAIL_FROM || process.env.SMTP_USER,
        to: toEmail,
        subject: "Reset your ByteLog password",
        text:
            "We received a request to reset your ByteLog password. " +
            `Open this link to choose a new one (expires in 30 minutes):\n\n${resetUrl}\n\n` +
            "If you didn't request this, you can safely ignore this email.",
        html: `
            <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; color: #1a1a1a;">
                <h2 style="margin-bottom: 8px;">Reset your password</h2>
                <p>We received a request to reset your ByteLog password. This link expires in 30 minutes.</p>
                <p>
                    <a href="${resetUrl}"
                       style="display:inline-block;margin:16px 0;padding:10px 24px;background:#FF2DAA;color:#fff;border-radius:999px;text-decoration:none;font-weight:600;">
                        Reset Password
                    </a>
                </p>
                <p style="color:#666;font-size:13px;">
                    If you didn't request this, you can safely ignore this email — your password won't change.
                </p>
            </div>
        `,
    });
};

export { sendPasswordResetEmail };
