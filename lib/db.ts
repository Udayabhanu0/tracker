import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

// Ensure database directory exists
const dbDir = path.join(process.cwd(), "prisma");
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(path.join(dbDir, "dev.db"));

// Initialize database schema if it doesn't exist
const tableExists = db.prepare(`
  SELECT name FROM sqlite_master WHERE type='table' AND name='Expense'
`).get();

if (!tableExists) {
  db.exec(`
    CREATE TABLE Expense (
      id TEXT PRIMARY KEY,
      description TEXT NOT NULL,
      amount REAL NOT NULL,
      category TEXT NOT NULL,
      date TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );

    INSERT INTO Expense (id, description, amount, category, date, createdAt, updatedAt)
    VALUES
      ('1', 'Grocery Shopping', 45.50, 'Food', '2024-01-28', datetime('now'), datetime('now')),
      ('2', 'Gas', 35.00, 'Transportation', '2024-01-27', datetime('now'), datetime('now')),
      ('3', 'Movie Tickets', 25.00, 'Entertainment', '2024-01-26', datetime('now'), datetime('now'));
  `);
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export function getAllExpenses(): Expense[] {
  return db.prepare("SELECT * FROM Expense ORDER BY date DESC").all() as Expense[];
}

export function getExpensesByCategory(category: string): Expense[] {
  return db.prepare("SELECT * FROM Expense WHERE category = ? ORDER BY date DESC").all(category) as Expense[];
}

export function createExpense(expense: Omit<Expense, "id" | "createdAt" | "updatedAt">): Expense {
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  
  db.prepare(`
    INSERT INTO Expense (id, description, amount, category, date, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(id, expense.description, expense.amount, expense.category, expense.date, now, now);
  
  return db.prepare("SELECT * FROM Expense WHERE id = ?").get(id) as Expense;
}

export function deleteExpense(id: string): boolean {
  const result = db.prepare("DELETE FROM Expense WHERE id = ?").run(id);
  return result.changes > 0;
}

export function getTotalByCategory(): { category: string; total: number }[] {
  return db.prepare(`
    SELECT category, SUM(amount) as total 
    FROM Expense 
    GROUP BY category 
    ORDER BY total DESC
  `).all() as { category: string; total: number }[];
}

export function getGrandTotal(): number {
  const result = db.prepare("SELECT SUM(amount) as total FROM Expense").get() as { total: number | null };
  return result.total || 0;
}

export function getCategories(): string[] {
  const results = db.prepare("SELECT DISTINCT category FROM Expense ORDER BY category").all() as { category: string }[];
  return results.map(r => r.category);
}
