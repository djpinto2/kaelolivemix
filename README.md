# KAΕLO DJ - Proyecto Web

## Frontend
- Abre el archivo `index.html` con Live Server o cualquier servidor estático para desarrollo.

## Backend (Node.js + Express)

### Instalación
1. Ve a la carpeta `backend`:
   ```bash
   cd backend
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Inicia el servidor:
   ```bash
   npm start
   ```

El backend sirve los archivos estáticos del frontend y expone un endpoint de contacto en `/api/contact`.

### Contacto
- Envía un POST a `/api/contact` con `{ name, email, message }`.
- Los mensajes se guardan en `backend/messages.json`.

---

Puedes personalizar el backend para agregar endpoints de galería, administración, o integración con email. 