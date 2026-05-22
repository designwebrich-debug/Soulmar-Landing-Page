import nodemailer from 'nodemailer';

interface EmailProps {
  patientEmail: string;
  patientName: string;
  therapistName: string;
  dateStr: string;
  meetLink: string | null | undefined;
}

export async function sendConfirmationEmail({ patientEmail, patientName, therapistName, dateStr, meetLink }: EmailProps) {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    console.log(`[MOCK SYSTEM] Simulando envío de correo de confirmación a: ${patientEmail}`);
    return true;
  }

  console.log(`[GOOGLE BRIDGE] Enviando correo transaccional vía soulmar.org@gmail.com a ${patientEmail}...`);

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: 'soulmar.org@gmail.com', // Cuenta maestra
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
    }
  });

  // Basic styling for the email
  const mailOptions = {
    from: '"Soulmar Clínico" <soulmar.org@gmail.com>',
    to: patientEmail,
    subject: 'Confirmación de tu Sesión Psicológica - Soulmar',
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaec; border-radius: 12px;">
        <div style="text-align: center; margin-bottom: 24px;">
            <h1 style="color: #1a1a1a; margin: 0; font-size: 24px;">Confirmación de Reserva</h1>
            <p style="color: #666; font-size: 14px; margin-top: 8px;">Tu espacio ha sido asegurado exitosamente.</p>
        </div>
        
        <p style="color: #333; font-size: 16px;">Hola <strong>${patientName}</strong>,</p>
        <p style="color: #333; font-size: 16px; line-height: 1.5;">Hemos agendado tu sesión con <strong>${therapistName}</strong>.</p>
        
        <div style="background-color: #f7f7f9; border-radius: 8px; padding: 16px; margin: 24px 0;">
            <p style="margin: 0 0 8px 0; color: #666; font-size: 14px;"><strong>Fecha y Hora:</strong></p>
            <p style="margin: 0; color: #1a1a1a; font-size: 16px;">${new Date(dateStr).toLocaleString('es-CO', { timeZone: 'America/Bogota' })} (Hora Colombia)</p>
        </div>

        <div style="text-align: center; margin-top: 32px;">
            <a href="${meetLink || '#'}" style="display: inline-block; background-color: #000000; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 50px; font-weight: bold; font-size: 15px;">
                Unirme a la Videollamada
            </a>
        </div>
        
        <p style="color: #999; font-size: 12px; text-align: center; margin-top: 32px;">
            Enviado de forma automática por el sistema clínico de Soulmar.
        </p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
  return true;
}
