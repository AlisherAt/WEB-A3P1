const Database = require('better-sqlite3');
const path = require('path');

// Создаем или подключаемся к базе данных
const dbPath = path.join(__dirname, 'focusflow.db');
const db = new Database(dbPath);

// Создаем таблицу habits, если она не существует
function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS habits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('Database initialized successfully');
}

// Инициализируем базу данных при загрузке модуля
initDatabase();

// CRUD операции
const habitsDb = {
  // Получить все привычки (отсортированные по id ASC)
  getAll() {
    try {
      const stmt = db.prepare('SELECT * FROM habits ORDER BY id ASC');
      return stmt.all();
    } catch (error) {
      throw error;
    }
  },

  // Получить привычку по id
  getById(id) {
    try {
      const stmt = db.prepare('SELECT * FROM habits WHERE id = ?');
      return stmt.get(id);
    } catch (error) {
      throw error;
    }
  },

  // Создать новую привычку
  create(title, description) {
    try {
      const stmt = db.prepare('INSERT INTO habits (title, description) VALUES (?, ?)');
      const result = stmt.run(title, description);
      return { id: result.lastInsertRowid, title, description };
    } catch (error) {
      throw error;
    }
  },

  // Обновить привычку по id
  update(id, title, description) {
    try {
      const stmt = db.prepare('UPDATE habits SET title = ?, description = ? WHERE id = ?');
      const result = stmt.run(title, description, id);
      return result.changes > 0;
    } catch (error) {
      throw error;
    }
  },

  // Удалить привычку по id
  delete(id) {
    try {
      const stmt = db.prepare('DELETE FROM habits WHERE id = ?');
      const result = stmt.run(id);
      return result.changes > 0;
    } catch (error) {
      throw error;
    }
  }
};

module.exports = { db, habitsDb };
