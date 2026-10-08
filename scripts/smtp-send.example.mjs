/**
 * Example Node mailer for later — do not run until SMTP details exist.
 *
 *   SMTP_HOST=
 *   SMTP_PORT=587
 *   SMTP_USER=
 *   SMTP_PASS=
 *   SMTP_FROM="Wedyora <hello@yourdomain.com>"
 *
 * Point VITE_MAIL_ENDPOINT at an API that calls this logic.
 */

export async function sendWithSmtp({ to, subject, text, html }) {
  const nodemailer = await import('nodemailer')
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

  return transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject,
    text,
    html,
  })
}
