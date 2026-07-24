import resend from "../config/resend.js";
import ApiError from "../utils/ApiError.js";

const sendPasswordResetEmail = async ({ email, resetUrl }) => {
  try {
    await resend.emails.send({
      from: "Project Management <onboarding@resend.dev>",
      to: email,
      subject: "Reset your password",
      html: `
    <div style="margin:0;padding:40px 20px;background-color:#f5f7fb;font-family:Arial,Helvetica,sans-serif;color:#1f2937;">
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;padding:40px;box-shadow:0 2px 10px rgba(0,0,0,0.05);">
        <tr>
          <td>

            <h1 style="margin:0 0 24px;font-size:28px;color:#111827;">
              Reset your password
            </h1>

            <p style="margin:0 0 16px;font-size:16px;line-height:1.7;">
              We received a request to reset the password for your
              <strong>Project Management</strong> account.
            </p>

            <p style="margin:0 0 32px;font-size:16px;line-height:1.7;">
              Click the button below to choose a new password. This password
              reset link will expire in <strong>15 minutes</strong>.
            </p>

            <div style="text-align:center;margin:40px 0;">
              <a
                href="${resetUrl}"
                style="
                  display:inline-block;
                  background:#2563eb;
                  color:#ffffff;
                  text-decoration:none;
                  padding:14px 28px;
                  border-radius:8px;
                  font-size:16px;
                  font-weight:600;
                "
              >
                Reset Password
              </a>
            </div>

            <p style="margin:0 0 12px;font-size:15px;line-height:1.7;">
              If the button doesn't work, copy and paste this link into your browser:
            </p>

            <p style="margin:0 0 32px;font-size:14px;word-break:break-word;">
              <a href="${resetUrl}" style="color:#2563eb;">
                ${resetUrl}
              </a>
            </p>

            <hr style="border:none;border-top:1px solid #e5e7eb;margin:32px 0;" />

            <p style="margin:0 0 12px;font-size:15px;line-height:1.7;">
              If you didn't request a password reset, you can safely ignore this email.
              Your password will remain unchanged.
            </p>

            <p style="margin:0;font-size:15px;line-height:1.7;">
              If you continue to receive unexpected password reset emails,
              we recommend reviewing your account security.
            </p>

            <p style="margin:40px 0 0;font-size:15px;">
              Thanks,<br />
              <strong>Project Management Team</strong>
            </p>

          </td>
        </tr>
      </table>
    </div>
  `,
    });
  } catch (error) {
    throw new ApiError(500, "Failed to send password reset email.");
  }
};

const emailService = {
  sendPasswordResetEmail,
};

export default emailService;
