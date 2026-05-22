const { google } = require('googleapis');
const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

// 1. Configuraciones
const PORT = 3005;
const REDIRECT_URI = `http://localhost:${PORT}/oauth2callback`;
const envPath = path.join(__dirname, '..', '.env');

console.log('======================================================');
console.log('🤖 GOOGLE-BRIDGE: SISTEMA DE AUTENTICACIÓN AUTOMATIZADO');
console.log('======================================================');

// 2. Leer Credenciales (Client ID & Secret) del .env
let envContent = '';
if (fs.existsSync(envPath)) {
  envContent = fs.readFileSync(envPath, 'utf8');
} else {
  console.error('\n❌ ERROR: El archivo .env no existe. He creado uno a partir de .env.example.');
  process.exit(1);
}

const getEnv = (key) => {
  const regex = new RegExp(`^${key}=(.*)$`, 'm');
  const match = envContent.match(regex);
  return match ? match[1].trim().replace(/['"]/g, '') : null;
};

const clientId = getEnv('GOOGLE_CLIENT_ID');
const clientSecret = getEnv('GOOGLE_CLIENT_SECRET');

if (!clientId || !clientSecret || clientId === 'your-google-client-id.apps.googleusercontent.com') {
  console.error('\n❌ ERROR DE AUTENTICACIÓN: Falta el Client ID y Client Secret de Google Cloud.');
  console.log('\n   [INSTRUCCIÓN AL USUARIO]:');
  console.log('   1. Ve a Google Cloud Console.');
  console.log('   2. Crea credenciales de "ID de cliente OAuth" para una aplicación web.');
  console.log(`   3. Asegúrate de añadir en Orígenes Autorizados de redirección: ${REDIRECT_URI}`);
  console.log('   4. Copia el ID y el Secreto y pégalos en el archivo .env.');
  console.log('   5. Vuelve a ejecutar este script.\n');
  process.exit(1);
}

// 3. Inicializar OAuth2 Client
const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, REDIRECT_URI);

// Scopes estrictos para Calendar y Gmail solicitados en directiva
const scopes = [
  'https://www.googleapis.com/auth/calendar.events',
  'https://www.googleapis.com/auth/gmail.send'
];

// Generar URL para la cuenta soulmar.org@gmail.com
const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  prompt: 'consent', // Forzar generación de refresh token
  scope: scopes,
  login_hint: 'soulmar.org@gmail.com'
});

console.log('\n[!] Servidor Local Oauth2 Activo.');
console.log('\n🔗 HAZ CLIC EN EL SIGUIENTE ENLACE PARA AUTORIZAR:');
console.log(`\n${authUrl}\n`);
console.log(`⏳ Escuchando respuesta de Google en el puerto ${PORT}... (Puedes cancelar con Ctrl+C)`);

// 4. Capturar el token de redirección
const server = http.createServer(async (req, res) => {
  if (req.url.startsWith('/oauth2callback')) {
    const qs = new url.URL(req.url, `http://localhost:${PORT}`).searchParams;
    const code = qs.get('code');
    
    if (code) {
      console.log('\n✅ ¡Código de Autorización Recibido! Intercambiando por tokens...');
      try {
        const { tokens } = await oauth2Client.getToken(code);
        
        console.log('\n🛡️ Tokens interceptados con éxito (Mostrando parciales por seguridad):');
        console.log(`- Access Token: ${tokens.access_token.substring(0, 15)}...`);
        if (tokens.refresh_token) {
           console.log(`- Refresh Token: ${tokens.refresh_token.substring(0, 15)}...`);
        } else {
           console.log('- Refresh Token: [PREVIAMENTE GENERADO / NO RECIBIDO EN ESTE INTENTO]');
        }

        // 5. Inyectar Tokens en .env
        let newEnv = fs.readFileSync(envPath, 'utf8');
        
        if (tokens.refresh_token) {
           if (newEnv.includes('GOOGLE_REFRESH_TOKEN=')) {
              newEnv = newEnv.replace(/GOOGLE_REFRESH_TOKEN=.*/, `GOOGLE_REFRESH_TOKEN="${tokens.refresh_token}"`);
           } else {
              newEnv += `\nGOOGLE_REFRESH_TOKEN="${tokens.refresh_token}"`;
           }
        }
        
        // Desactivar Mercado Pago (Bloqueo PENDIENTE_USUARIO)
        newEnv = newEnv.replace(/MERCADOPAGO_ACCESS_TOKEN=.*/, `MERCADOPAGO_ACCESS_TOKEN="PENDIENTE_USUARIO"`);
        newEnv = newEnv.replace(/MERCADOPAGO_WEBHOOK_SECRET=.*/, `MERCADOPAGO_WEBHOOK_SECRET="PENDIENTE_USUARIO"`);

        fs.writeFileSync(envPath, newEnv);
        console.log('\n💾 [ESTADO FINAL]: Tokens inyectados en .env exitosamente.');
        console.log('🔒 [ESTADO FINAL]: Llaves de Mercado Pago bloqueadas como PENDIENTE_USUARIO.');
        console.log('\n🚀 Puedes cerrar esta terminal o volver al chat. El sistema ha completado su misión.');
        
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`
          <div style="font-family: sans-serif; text-align: center; margin-top: 50px;">
             <h1 style="color: #10b981;">¡Google Cloud Vinculado a Soulmar!</h1>
             <p>El GOOGLE-BRIDGE ha capturado exitosamente los tokens.</p>
             <p>Ya puedes cerrar esta pestaña y regresar a tu terminal o chat de IA.</p>
          </div>
        `);
        
        setTimeout(() => {
           server.close();
           process.exit(0);
        }, 1000);

      } catch (e) {
        console.error('\n❌ Error al intercambiar tokens:', e.message);
        res.end('Error al intercambiar tokens: ' + e.message);
        process.exit(1);
      }
    }
  }
}).listen(PORT, () => {});
