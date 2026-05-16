import { NextResponse } from 'next/server';
import twilio from 'twilio';

// Initialize only if keys exist to prevent build errors if not configured yet
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = accountSid && authToken ? twilio(accountSid, authToken) : null;

export async function POST(request: Request) {
  try {
    const { name, phone } = await request.json();

    if (!phone) {
      return NextResponse.json({ error: "No phone provided" }, { status: 400 });
    }

    if (!client) {
      return NextResponse.json({ error: "Twilio credentials not configured" }, { status: 500 });
    }

    // Default to Colombia (57) if no country code provided and it's a typical local number length
    let phoneFormatted = phone.replace(/\D/g, '');
    if (phoneFormatted.length === 10) {
      phoneFormatted = `57${phoneFormatted}`;
    }

    const message = await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_FROM || 'whatsapp:+14155238886',
      to: `whatsapp:+${phoneFormatted}`,
      body: `🌊 ¡Hola ${name}! Bienvenido a SoulMar. Tu cuenta ha sido creada con éxito. Tu camino hacia el bienestar mental comienza ahora. ¡Estamos aquí para acompañarte! 💙`
    });

    return NextResponse.json({ success: true, messageSid: message.sid });
  } catch (error) {
    console.error("Twilio API error:", error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
