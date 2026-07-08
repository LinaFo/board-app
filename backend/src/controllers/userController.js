import pool from '../config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
  console.log('📥 Получен запрос на регистрацию:', req.body);

  const { email, password } = req.body;

  if (!email || !password) {
    console.log('❌ Не хватает email или пароля');
    return res.status(400).json({ error: 'Email и пароль обязательны' });
  }

  try {
    console.log('🔑 Хешируем пароль...');
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('✅ Пароль захэширован');

    console.log('📤 Отправляем запрос в БД...');
    const result = await pool.query(
      'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email',
      [email, hashedPassword]
    );
    console.log('✅ Пользователь создан в БД:', result.rows[0]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('❌ ОШИБКА ПРИ РЕГИСТРАЦИИ:', error);
    console.error('❌ Детали ошибки:', error.message);
    console.error('❌ Код ошибки:', error.code);
    
    if (error.code === '23505') {
      res.status(400).json({ error: 'Пользователь уже существует' });
    } else {
      res.status(500).json({ error: 'Ошибка сервера' });
    }
  }
};

export const login = async (req, res) => {
  console.log('📥 Получен запрос на вход:', req.body);

  const { email, password } = req.body;

  if (!email || !password) {
    console.log('❌ Не хватает email или пароля');
    return res.status(400).json({ error: 'Email и пароль обязательны' });
  }

  try {
    console.log('🔍 Ищем пользователя в БД...');
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      console.log('❌ Пользователь не найден');
      return res.status(401).json({ error: 'Неверный email или пароль' });
    }

    console.log('✅ Пользователь найден, проверяем пароль...');
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      console.log('❌ Неверный пароль');
      return res.status(401).json({ error: 'Неверный email или пароль' });
    }

    console.log('✅ Пароль верный, создаём токен...');
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    console.log('✅ Токен создан, пользователь вошёл');

    res.json({ token, user: { id: user.id, email: user.email } });
  } catch (error) {
    console.error('❌ ОШИБКА ПРИ ВХОДЕ:', error);
    console.error('❌ Детали ошибки:', error.message);
    
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};