import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';
import mysql from 'mysql2';

const app = express();
const PORT = process.env.PORT || 3001;
const __dirname = path.resolve();

app.use(cors());
app.use(bodyParser.json());

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '../')));

// Conexión a MySQL
const db = mysql.createConnection({
  host: 'localhost',      // Cambia si usas hosting externo
  user: 'TU_USUARIO',     // Tu usuario de MySQL
  password: 'TU_PASSWORD',// Tu contraseña de MySQL
  database: 'kaelolive'   // El nombre de la base de datos
});
db.connect((err) => {
  if (err) {
    console.error('Error de conexión a la base de datos:', err);
    return;
  }
  console.log('Conectado a la base de datos MySQL');
});

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

  // Guardar en la base de datos
  const sql = 'INSERT INTO mensajes_contacto (nombre, email, mensaje) VALUES (?, ?, ?)';
  db.query(sql, [name, email, message], (err, result) => {
    if (err) {
      console.error('Error al guardar mensaje en la base de datos:', err);
      // No retornamos error al usuario, seguimos con el flujo
    } else {
      console.log('Mensaje guardado en la base de datos con id:', result.insertId);
    }
  });

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

// Endpoint para obtener todos los mensajes de contacto
app.get('/api/messages', (req, res) => {
  const sql = 'SELECT id, nombre, email, mensaje, fecha_envio FROM mensajes_contacto ORDER BY fecha_envio DESC';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error al obtener mensajes de la base de datos:', err);
      return res.status(500).json({ error: 'Error en el servidor' });
    }
    res.json(results);
  });
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
}); 