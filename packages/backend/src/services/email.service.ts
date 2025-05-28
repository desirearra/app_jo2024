import nodemailer from 'nodemailer';

/**
 * Send an email with a simple HTML template (mock: log only)
 * @param to string - recipient email
 * @param subject string - email subject
 * @param html string - HTML content
 * @returns Promise<void>
 */
export const sendEmail = async (to: string, subject: string, html: string): Promise<void> => {
  // Log the email sending (mock)
  // In real usage, plug a real email provider here
  console.log(`[EMAIL] To: ${to} | Subject: ${subject}\n${html}`);
};

/**
 * Render a simple HTML template for OTP/MFA
 * @param code string - OTP code
 * @returns string - HTML content
 */
export const renderOtpTemplate = (code: string): string => {
  return `
    <html>
      <body style="font-family: Arial, sans-serif;">
        <h2>Votre code de vérification</h2>
        <p>Utilisez le code suivant pour valider votre connexion :</p>
        <div style="font-size: 2em; font-weight: bold; margin: 16px 0;">${code}</div>
        <p>Ce code est valable 5 minutes.</p>
      </body>
    </html>
  `;
};

/**
 * Envoie un email via Mailgun SMTP
 * @param to Destinataire (email)
 * @param subject Sujet de l'email
 * @param html Contenu HTML de l'email
 * @returns Promise<void>
 */
export async function sendMail(to: string, subject: string, html: string): Promise<void> {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST, // ex: 'smtp.mailgun.org'
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false, // true pour 465, false pour 587
    auth: {
      user: process.env.SMTP_USER, // ex: 'postmaster@tondomaine.mailgun.org'
      pass: process.env.SMTP_PASS, // mot de passe SMTP Mailgun
    },
  });

  await transporter.sendMail({
    from: process.env.SMTP_FROM || 'noreply@tondomaine.com',
    to,
    subject,
    html,
  });
}
