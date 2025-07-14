import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';

const app = express();
const PORT = process.env.PORT || 3001;
const __dirname = path.resolve();

app.use(cors());
app.use(bodyParser.json());

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '../')));

// Configuración de nodemailer (Gmail SMTP)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'djbackend15@gmail.com',
    pass: 'segunsml123'
  }
});
const DESTINATARIOS = ['kaelo.ar@gmail.com', 'djpintoarg@gmail.com'];

// Endpoint de contacto
app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing fields' });
  }
  const entry = { name, email, message, date: new Date().toISOString() };
  const file = path.join(__dirname, 'messages.json');
  let messages = [];
  if (fs.existsSync(file)) {
    messages = JSON.parse(fs.readFileSync(file));
  }
  messages.push(entry);
  fs.writeFileSync(file, JSON.stringify(messages, null, 2));

  // Enviar email a los destinatarios
  const mailOptions = {
    from: 'KAΕLO LIVE <djbackend15@gmail.com>',
    to: DESTINATARIOS.join(','),
    subject: 'Nuevo mensaje de contacto KAΕLO LIVE',
    text: `Nombre: ${name}\nEmail: ${email}\nMensaje: ${message}`,
    html: `<b>Nombre:</b> ${name}<br><b>Email:</b> ${email}<br><b>Mensaje:</b><br>${message.replace(/\n/g,'<br>')}`
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error enviando email:', error);
      return res.status(500).json({ error: 'Error sending email' });
    }
    res.json({ success: true });
  });
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
}); 