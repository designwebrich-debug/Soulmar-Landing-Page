import { google } from 'googleapis';

export async function createCalendarEvent({ patientName, therapistName, dateStr }: { patientName: string, therapistName: string, dateStr: string }) {
  // If no credentials, return Mock Meet link
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    console.log("[MOCK SYSTEM] Generando Enlace de Google Meet simulado...");
    return "https://meet.google.com/mock-meet-link";
  }

  console.log("[GOOGLE BRIDGE] Autenticando con Google Calendar API...");

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    "https://developers.google.com/oauthplayground"
  );

  oauth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });

  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  // Calculate End Time (+1 Hour)
  const startTime = new Date(dateStr);
  const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);

  const res = await calendar.events.insert({
    calendarId: 'primary', // The master calendar of soulmar.org@gmail.com
    conferenceDataVersion: 1,
    requestBody: {
      summary: `Sesión Soulmar: ${patientName} y ${therapistName}`,
      description: 'Sesión psicológica online agendada vía web.',
      start: { dateTime: startTime.toISOString(), timeZone: 'America/Bogota' },
      end: { dateTime: endTime.toISOString(), timeZone: 'America/Bogota' },
      conferenceData: {
        createRequest: { requestId: `soulmar-${Date.now()}` }
      }
    }
  });

  return res.data.hangoutLink;
}
