/**
 * Notification Service for Soulmar
 * Handles automated welcome messages via Email and WhatsApp.
 */

interface NotificationData {
  userId: string;
  name: string;
  email: string;
  phone?: string;
}

/**
 * Sends a welcome email after successful registration.
 * Note: Supabase sends a basic confirmation email by default. 
 * This can be used for custom marketing or "Success" emails.
 */
export async function sendWelcomeEmail(data: NotificationData) {
  try {
    const response = await fetch('/api/send-welcome-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: data.email,
        name: data.name
      })
    });
    return response.ok;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return false;
  }
}

/**
 * Orchestrates all "Registration Success" notifications.
 */
export async function sendRegistrationSuccessNotification(data: NotificationData) {
  const emailSent = await sendWelcomeEmail(data);
  // WhatsApp is temporarily disabled as per user request
  const whatsappSent = false;
  
  return { emailSent, whatsappSent };
}
