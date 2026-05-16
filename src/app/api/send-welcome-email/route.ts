import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy');

export async function POST(request: Request) {
  try {
    const { email, name } = await request.json();

    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'Bienvenida SoulMar <bienvenida@soulmar.org>',
      to: email,
      subject: `¡Bienvenido a SoulMar, ${name}! Tu camino al bienestar comienza aquí 🌊`,
      html: `
        <div style="font-family: 'Inter', Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #eaeaea; border-radius: 12px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #1d1d1f; font-size: 28px; margin: 0;">SoulMar</h1>
          </div>
          <h2 style="color: #8da9c4; font-size: 20px; font-weight: normal;">¡Hola ${name}! Nos alegra tenerte aquí.</h2>
          <p style="font-size: 16px; line-height: 1.5; color: #555;">Tu cuenta ha sido creada exitosamente. SoulMar es tu refugio digital de bienestar mental y emocional.</p>
          <div style="background-color: #f5f5f7; padding: 25px; border-radius: 16px; margin: 30px 0;">
            <p style="margin: 0 0 15px 0; font-size: 16px; color: #1d1d1f;"><strong>Desde tu panel personal podrás:</strong></p>
            <ul style="margin: 0; padding-left: 20px; color: #555; line-height: 1.8;">
              <li>Agendar y gestionar sesiones con especialistas</li>
              <li>Acceder a cursos exclusivos de bienestar</li>
              <li>Revisar el progreso de tus terapias</li>
            </ul>
          </div>
          <div style="text-align: center; margin-top: 40px; margin-bottom: 20px;">
            <a href="https://soulmar.org/login" style="background-color: #1d1d1f; color: white; padding: 14px 32px; text-decoration: none; border-radius: 30px; font-weight: bold; font-size: 16px; display: inline-block;">Iniciar Sesión en tu Panel</a>
          </div>
          <hr style="border: none; border-top: 1px solid #eaeaea; margin-top: 40px; margin-bottom: 20px;" />
          <p style="text-align: center; font-size: 12px; color: #888;">
            SoulMar © ${new Date().getFullYear()} Todos los derechos reservados.<br/>
            Si no creaste esta cuenta, puedes ignorar este correo.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend send error:", error);
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Resend general error:", error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
