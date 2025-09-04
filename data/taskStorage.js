import sqlite3 from "sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import { promisify } from "util";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, "tasks.db");

/**
 * Task model structure:
 * {
 *   id: string,
 *   title: string,
 *   description: string,
 *   priority: 'low' | 'medium' | 'high',
 *   status: 'pending' | 'completed',
 *   createdAt: string (ISO date)
 * }
 */

class SqliteStorage {
  constructor() {
    this.db = null;
    this.isInitialized = false;
  }

  async ensureInitialized() {
    if (this.isInitialized) return;
    
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(DB_FILE, (err) => {
        if (err) {
          reject(new Error(`Failed to connect to database: ${err.message}`));
          return;
        }
        
        // Create tasks table if it doesn't exist
        this.db.run(`
          CREATE TABLE IF NOT EXISTS tasks (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            description TEXT DEFAULT '',
            priority TEXT DEFAULT 'medium' CHECK(priority IN ('low', 'medium', 'high')),
            status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'completed')),
            createdAt TEXT NOT NULL
          )
        `, (err) => {
          if (err) {
            reject(new Error(`Failed to create table: ${err.message}`));
            return;
          }
          this.isInitialized = true;
          resolve();
        });
      });
    });
  }

  async runQuery(sql, params = []) {
    await this.ensureInitialized();
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function(err) {
        if (err) reject(err);
        else resolve({ lastID: this.lastID, changes: this.changes });
      });
    });
  }

  async getQuery(sql, params = []) {
    await this.ensureInitialized();
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  async allQuery(sql, params = []) {
    await this.ensureInitialized();
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    });
  }

  generateId() {
    return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  buildWhereClause(filters) {
    const conditions = [];
    const params = [];
    
    if (filters.status) {
      conditions.push('status = ?');
      params.push(filters.status);
    }
    
    if (filters.priority) {
      conditions.push('priority = ?');
      params.push(filters.priority);
    }
    
    return {
      whereClause: conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '',
      params
    };
  }

  buildOrderByClause(sortBy) {
    if (!sortBy) return '';
    
    if (sortBy === 'createdAt') {
      return 'ORDER BY createdAt DESC';
    }
    return `ORDER BY ${sortBy} ASC`;
  }

  async getAllTasks(filters = {}) {
    const { whereClause, params } = this.buildWhereClause(filters);
    const orderByClause = this.buildOrderByClause(filters.sortBy);
    
    const sql = `SELECT * FROM tasks ${whereClause} ${orderByClause}`;
    return await this.allQuery(sql, params);
  }

  async createTask(taskData) {
    const newTask = {
      id: this.generateId(),
      title: taskData.title,
      description: taskData.description || "",
      priority: taskData.priority || "medium",
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    const sql = `
      INSERT INTO tasks (id, title, description, priority, status, createdAt)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const params = [
      newTask.id,
      newTask.title,
      newTask.description,
      newTask.priority,
      newTask.status,
      newTask.createdAt
    ];

    await this.runQuery(sql, params);
    return newTask;
  }

  async updateTaskStatus(taskId, status) {
    const newStatus = status ? "completed" : "pending";
    const sql = 'UPDATE tasks SET status = ? WHERE id = ?';
    const result = await this.runQuery(sql, [newStatus, taskId]);
    
    if (result.changes === 0) {
      throw new Error("Task not found");
    }
    
    return await this.getTaskById(taskId);
  }

  async deleteTask(taskId) {
    const task = await this.getTaskById(taskId); // Will throw if not found
    const sql = 'DELETE FROM tasks WHERE id = ?';
    await this.runQuery(sql, [taskId]);
    return task;
  }

  async getTaskById(taskId) {
    const sql = 'SELECT * FROM tasks WHERE id = ?';
    const task = await this.getQuery(sql, [taskId]);
    
    if (!task) {
      throw new Error("Task not found");
    }
    
    return task;
  }

  // Graceful shutdown method
  async close() {
    if (this.db) {
      return new Promise((resolve) => {
        this.db.close(resolve);
      });
    }
  }
}

export default new SqliteStorage();
