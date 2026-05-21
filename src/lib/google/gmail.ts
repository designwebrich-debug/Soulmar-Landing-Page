// GOOGLE-BRIDGE: Gmail Transaccional Automation

export async function sendTransactionalEmail({
  to,
  subject,
  htmlBody
}: {
  to: string
  subject: string
  htmlBody: string
}) {
  console.log(`GOOGLE-BRIDGE: Sending email to ${to} | Subject: ${subject}`)
  
  // 1. Configure OAuth2 Client or Nodemailer with Gmail
  // const transporter = nodemailer.createTransport({ ... })
  
  // 2. Construct raw email if using Google API directly
  /*
  const message = [
    `To: ${to}`,
    `Subject: =?utf-8?B?${Buffer.from(subject).toString('base64')}?=`,
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=utf-8',
    '',
    htmlBody
  ].join('\n')
  
  const encodedMessage = Buffer.from(message).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
  */

  // 3. Send using Gmail API
  // const gmail = google.gmail({ version: 'v1', auth: oauth2Client })
  // await gmail.users.messages.send({ userId: 'me', requestBody: { raw: encodedMessage } })

  return { success: true, messageId: `mock-msg-${Date.now()}` }
}

export const emailTemplates = {
  paymentConfirmed: (name: string, meetLink: string, date: string) => `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #8da9c4;">¡Pago Confirmado, ${name}!</h2>
      <p>Tu sesión completa de terapia en Soulmar ha sido agendada con éxito.</p>
      <p><strong>Fecha y Hora:</strong> ${new Date(date).toLocaleString('es-CO')}</p>
      <div style="background-color: #f5f5f7; padding: 20px; border-radius: 12px; margin: 20px 0;">
        <p style="margin: 0;">Enlace a la sesión (Google Meet):</p>
        <a href="${meetLink}" style="color: #ffc971; font-weight: bold;">${meetLink}</a>
      </div>
      <p>Te recomendamos conectarte 5 minutos antes. ¡Nos vemos pronto!</p>
    </div>
  `,
  freeEvaluationConfirmed: (name: string, meetLink: string, date: string) => `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #ffc971;">Llamada de Valoración Confirmada</h2>
      <p>Hola ${name}, hemos reservado tu espacio gratuito de 15 minutos en Soulmar.</p>
      <p><strong>Fecha y Hora:</strong> ${new Date(date).toLocaleString('es-CO')}</p>
      <div style="background-color: #f5f5f7; padding: 20px; border-radius: 12px; margin: 20px 0;">
        <p style="margin: 0;">Enlace a la sala (Google Meet):</p>
        <a href="${meetLink}" style="color: #8da9c4; font-weight: bold;">${meetLink}</a>
      </div>
      <p>Esta llamada nos ayudará a entender cómo guiarte en tu proceso.</p>
    </div>
  `
}
