import pool from '../config/db.js';

// Получить все объявления
export const getAds = async (req, res) => {
  const { category, city, search, page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  let query = `
    SELECT 
      ads.*, 
      users.email as author_email, 
      users.id as author_id,
      (SELECT COUNT(*) FROM ad_likes WHERE ad_id = ads.id) as likes_count
    FROM ads 
    JOIN users ON ads.user_id = users.id
  `;
  const params = [];
  let paramIndex = 1;

  const conditions = [];

  if (search) {
    conditions.push(`(ads.title ILIKE $${paramIndex} OR ads.description ILIKE $${paramIndex})`);
    params.push(`%${search}%`);
    paramIndex++;
  }

  if (category) {
    conditions.push(`ads.category = $${paramIndex++}`);
    params.push(category);
  }

  if (city) {
    conditions.push(`ads.city = $${paramIndex++}`);
    params.push(city);
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  query += ` ORDER BY ads.created_at DESC LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
  params.push(limit, offset);

  try {
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('❌ Ошибка получения объявлений:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

// Получить одно объявление
export const getAd = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT ads.*, users.email as author_email, users.id as author_id 
       FROM ads 
       JOIN users ON ads.user_id = users.id 
       WHERE ads.id = $1`,
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Объявление не найдено' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('❌ Ошибка получения объявления:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

// Создать объявление
export const createAd = async (req, res) => {
  const { title, description, price, city, category } = req.body;
  const userId = req.userId;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

  if (!title || !description || !price || !city || !category) {
    return res.status(400).json({ error: 'Все поля обязательны' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO ads (title, description, price, city, category, image_url, user_id) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [title, description, price, city, category, imageUrl, userId]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('❌ Ошибка создания объявления:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

// Редактировать объявление
export const updateAd = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;
  const { title, description, price, city, category } = req.body;

  try {
    const check = await pool.query('SELECT * FROM ads WHERE id = $1', [id]);
    if (check.rows.length === 0) {
      return res.status(404).json({ error: 'Объявление не найдено' });
    }
    if (check.rows[0].user_id !== userId) {
      return res.status(403).json({ error: 'Нет прав на редактирование' });
    }

    const result = await pool.query(
      `UPDATE ads 
       SET title = $1, description = $2, price = $3, city = $4, category = $5 
       WHERE id = $6 
       RETURNING *`,
      [title, description, price, city, category, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error('❌ Ошибка редактирования объявления:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

// Удалить объявление
export const deleteAd = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  try {
    const check = await pool.query('SELECT * FROM ads WHERE id = $1', [id]);
    if (check.rows.length === 0) {
      return res.status(404).json({ error: 'Объявление не найдено' });
    }
    if (check.rows[0].user_id !== userId) {
      return res.status(403).json({ error: 'Нет прав на удаление' });
    }

    await pool.query('DELETE FROM ads WHERE id = $1', [id]);
    res.json({ message: 'Объявление удалено' });
  } catch (error) {
    console.error('❌ Ошибка удаления объявления:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

// Получить объявления текущего пользователя
export const getMyAds = async (req, res) => {
  const userId = req.userId;

  console.log('📥 Получение моих объявлений для пользователя:', userId);

  try {
    const result = await pool.query(
      `SELECT ads.*, users.email as author_email, users.id as author_id,
       (SELECT COUNT(*) FROM ad_likes WHERE ad_id = ads.id) as likes_count
       FROM ads 
       JOIN users ON ads.user_id = users.id 
       WHERE ads.user_id = $1 
       ORDER BY ads.created_at DESC`,
      [userId]
    );
    console.log('✅ Найдено объявлений:', result.rows.length);
    res.json(result.rows);
  } catch (error) {
    console.error('❌ Ошибка получения моих объявлений:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

// Лайкнуть объявление
export const likeAd = async (req, res) => {
  const { adId } = req.body;
  const userId = req.userId;

  console.log('📥 Лайк объявления:', { adId, userId });

  if (!adId) {
    return res.status(400).json({ error: 'ID объявления обязателен' });
  }

  try {
    // Проверяем, существует ли объявление
    const adCheck = await pool.query('SELECT * FROM ads WHERE id = $1', [adId]);
    if (adCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Объявление не найдено' });
    }

    // Проверяем, есть ли уже лайк
    const existingLike = await pool.query(
      'SELECT * FROM ad_likes WHERE user_id = $1 AND ad_id = $2',
      [userId, adId]
    );

    if (existingLike.rows.length > 0) {
      // Если лайк есть — удаляем
      await pool.query(
        'DELETE FROM ad_likes WHERE user_id = $1 AND ad_id = $2',
        [userId, adId]
      );
      console.log('✅ Лайк убран');
      return res.json({ message: 'Лайк убран' });
    } else {
      // Если лайка нет — добавляем
      await pool.query(
        'INSERT INTO ad_likes (user_id, ad_id) VALUES ($1, $2)',
        [userId, adId]
      );
      console.log('✅ Лайк поставлен');
      return res.json({ message: 'Лайк поставлен' });
    }
  } catch (error) {
    console.error('❌ Ошибка лайка объявления:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

// Получить количество лайков объявления
export const getAdLikes = async (req, res) => {
  const { adId } = req.params;

  console.log('📥 Получение лайков для объявления:', adId);

  try {
    const result = await pool.query(
      'SELECT COUNT(*) FROM ad_likes WHERE ad_id = $1',
      [adId]
    );
    res.json({ likes: parseInt(result.rows[0].count) });
  } catch (error) {
    console.error('❌ Ошибка получения лайков:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

// Получить объявления, которые лайкнул пользователь
export const getLikedAds = async (req, res) => {
  const userId = req.userId;

  console.log('📥 Получение лайкнутых объявлений для пользователя:', userId);

  try {
    const result = await pool.query(
      `SELECT ads.*, users.email as author_email, users.id as author_id,
       (SELECT COUNT(*) FROM ad_likes WHERE ad_id = ads.id) as likes_count
       FROM ads 
       JOIN users ON ads.user_id = users.id
       JOIN ad_likes ON ads.id = ad_likes.ad_id
       WHERE ad_likes.user_id = $1
       ORDER BY ad_likes.created_at DESC`,
      [userId]
    );
    console.log('✅ Найдено лайкнутых объявлений:', result.rows.length);
    res.json(result.rows);
  } catch (error) {
    console.error('❌ Ошибка получения лайкнутых объявлений:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};