import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import userRoutes from './src/routes/users.js';
import adRoutes from './src/routes/ads.js';
import commentRoutes from './src/routes/comments.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'src/uploads')));

app.use('/api/users', userRoutes);
app.use('/api/ads', adRoutes);
app.use('/api/comments', commentRoutes);

// WebSocket (чат)
io.on('connection', (socket) => {
  console.log('👤 Новое подключение:', socket.id);

  socket.on('join-room', (userId) => {
    console.log(`📦 Пользователь ${socket.id} присоединился к комнате user-${userId}`);
    socket.join(`user-${userId}`);
    socket.emit('joined-room', { userId, room: `user-${userId}` });
  });

  socket.on('send-message', (data) => {
    const { toUserId, text } = data;
    console.log(`💬 Сообщение от ${socket.id} к пользователю ${toUserId}: "${text}"`);
    io.to(`user-${toUserId}`).emit('new-message', {
      from: socket.id,
      text,
      timestamp: new Date().toISOString(),
    });
    socket.emit('new-message', {
      from: 'me',
      text,
      timestamp: new Date().toISOString(),
    });
  });

  socket.on('disconnect', () => {
    console.log('👋 Отключение:', socket.id);
  });
});

const port = process.env.PORT || 5000;

// ⭐ Экспорт для Vercel
export default app;

// Локальный запуск
if (process.env.NODE_ENV !== 'production') {
  server.listen(port, () => {
    console.log(`🚀 Сервер запущен на порту ${port}`);
  });
}