import pool from '../config/db.js';

// Получить все комментарии к объявлению (с лайками)
export const getComments = async (req, res) => {
  const { adId } = req.params;

  try {
    const result = await pool.query(
      `SELECT 
        comments.*, 
        users.email,
        (SELECT COUNT(*) FROM comment_likes WHERE comment_id = comments.id) as likes_count
       FROM comments 
       JOIN users ON comments.user_id = users.id 
       WHERE ad_id = $1 
       ORDER BY created_at DESC`,
      [adId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('❌ Ошибка получения комментариев:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

// Создать комментарий
export const createComment = async (req, res) => {
  const { text, adId } = req.body;
  const userId = req.userId;

  if (!text || !adId) {
    return res.status(400).json({ error: 'Текст и ID объявления обязательны' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO comments (text, user_id, ad_id) VALUES ($1, $2, $3) RETURNING *',
      [text, userId, adId]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('❌ Ошибка создания комментария:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

// Удалить комментарий (только автор)
export const deleteComment = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  try {
    const check = await pool.query('SELECT * FROM comments WHERE id = $1', [id]);
    if (check.rows.length === 0) {
      return res.status(404).json({ error: 'Комментарий не найден' });
    }
    if (check.rows[0].user_id !== userId) {
      return res.status(403).json({ error: 'Нет прав на удаление' });
    }

    await pool.query('DELETE FROM comments WHERE id = $1', [id]);
    res.json({ message: 'Комментарий удалён' });
  } catch (error) {
    console.error('❌ Ошибка удаления комментария:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

// Лайкнуть комментарий
export const likeComment = async (req, res) => {
  const { commentId } = req.body;
  const userId = req.userId;

  if (!commentId) {
    return res.status(400).json({ error: 'ID комментария обязателен' });
  }

  try {
    // Проверяем, существует ли комментарий
    const commentCheck = await pool.query('SELECT * FROM comments WHERE id = $1', [commentId]);
    if (commentCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Комментарий не найден' });
    }

    // Пробуем добавить лайк
    await pool.query(
      'INSERT INTO comment_likes (user_id, comment_id) VALUES ($1, $2)',
      [userId, commentId]
    );
    res.json({ message: 'Лайк поставлен' });
  } catch (error) {
    if (error.code === '23505') {
      // Если лайк уже есть — удаляем его (дизлайк)
      await pool.query(
        'DELETE FROM comment_likes WHERE user_id = $1 AND comment_id = $2',
        [userId, commentId]
      );
      res.json({ message: 'Лайк убран' });
    } else {
      console.error('❌ Ошибка лайка:', error);
      res.status(500).json({ error: 'Ошибка сервера' });
    }
  }
};