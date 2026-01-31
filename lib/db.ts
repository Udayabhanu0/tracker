import { createClient } from "@libsql/client";
import path from "path";
import fs from "fs";

// Ensure database directory exists (use /tmp in serverless)
const baseDir = process.env.VERCEL ? "/tmp" : process.cwd();
const dbDir = path.join(baseDir, "prisma");
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = createClient({
  url: `file:${path.join(dbDir, "dev.db")}`
});

// Initialize database schema if it doesn't exist
async function initializeDatabase() {
  const tableExists = await db.execute(`
    SELECT name FROM sqlite_master WHERE type='table' AND name='Expense'
  `);

  if (tableExists.rows.length === 0) {
    await db.batch([
      `CREATE TABLE Expense (
        id TEXT PRIMARY KEY,
        description TEXT NOT NULL,
        amount REAL NOT NULL,
        category TEXT NOT NULL,
        date TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      )`,
      `INSERT INTO Expense (id, description, amount, category, date, createdAt, updatedAt)
       VALUES
         ('1', 'Grocery Shopping', 45.50, 'Food', '2024-01-28', datetime('now'), datetime('now')),
         ('2', 'Gas', 35.00, 'Transportation', '2024-01-27', datetime('now'), datetime('now')),
         ('3', 'Movie Tickets', 25.00, 'Entertainment', '2024-01-26', datetime('now'), datetime('now'))`
    ]);
  }
}

// Initialize the database
initializeDatabase().catch(console.error);

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export async function getAllExpenses(): Promise<Expense[]> {
  const result = await db.execute("SELECT * FROM Expense ORDER BY date DESC");
  return result.rows.map(row => ({
    id: row.id as string,
    description: row.description as string,
    amount: row.amount as number,
    category: row.category as string,
    date: row.date as string,
    createdAt: row.createdAt as string,
    updatedAt: row.updatedAt as string,
  }));
}

export async function getExpensesByCategory(category: string): Promise<Expense[]> {
  const result = await db.execute({
    sql: "SELECT * FROM Expense WHERE category = ? ORDER BY date DESC",
    args: [category]
  });
  return result.rows.map(row => ({
    id: row.id as string,
    description: row.description as string,
    amount: row.amount as number,
    category: row.category as string,
    date: row.date as string,
    createdAt: row.createdAt as string,
    updatedAt: row.updatedAt as string,
  }));
}

export async function createExpense(expense: Omit<Expense, "id" | "createdAt" | "updatedAt">): Promise<Expense> {
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  
  await db.execute({
    sql: `INSERT INTO Expense (id, description, amount, category, date, createdAt, updatedAt)
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
    args: [id, expense.description, expense.amount, expense.category, expense.date, now, now]
  });
  
  const result = await db.execute({
    sql: "SELECT * FROM Expense WHERE id = ?",
    args: [id]
  });
  
  const row = result.rows[0];
  return {
    id: row.id as string,
    description: row.description as string,
    amount: row.amount as number,
    category: row.category as string,
    date: row.date as string,
    createdAt: row.createdAt as string,
    updatedAt: row.updatedAt as string,
  };
}

export async function deleteExpense(id: string): Promise<boolean> {
  const result = await db.execute({
    sql: "DELETE FROM Expense WHERE id = ?",
    args: [id]
  });
  return result.rowsAffected > 0;
}

export async function getTotalByCategory(): Promise<{ category: string; total: number }[]> {
  const result = await db.execute(`
    SELECT category, SUM(amount) as total 
    FROM Expense 
    GROUP BY category 
    ORDER BY total DESC
  `);
  return result.rows.map(row => ({
    category: row.category as string,
    total: row.total as number,
  }));
}

export async function getGrandTotal(): Promise<number> {
  const result = await db.execute("SELECT SUM(amount) as total FROM Expense");
  const total = result.rows[0]?.total as number | null;
  return total || 0;
}

export async function getCategories(): Promise<string[]> {
  const result = await db.execute("SELECT DISTINCT category FROM Expense ORDER BY category");
  return result.rows.map(row => row.category as string);
}