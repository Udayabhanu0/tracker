import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

// Ensure prisma directory exists
const dbDir = path.join(process.cwd(), "prisma");
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(path.join(dbDir, "dev.db"));

// Create expenses table
db.exec(`
  CREATE TABLE IF NOT EXISTS Expense (
    id TEXT PRIMARY KEY,
    description TEXT NOT NULL,
    amount REAL NOT NULL,
    category TEXT NOT NULL,
    date TEXT NOT NULL,
    createdAt TEXT NOT NULL DEFAULT (datetime('now')),
    updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
  )
`);

// Check if we have any data
const count = db.prepare("SELECT COUNT(*) as count FROM Expense").get();

if (count.count === 0) {
  // Seed with sample data
  const insert = db.prepare(`
    INSERT INTO Expense (id, description, amount, category, date, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))
  `);

  const sampleExpenses = [
    { id: "1", description: "Grocery shopping", amount: 125.50, category: "Food", date: "2026-01-28" },
    { id: "2", description: "Electric bill", amount: 89.99, category: "Utilities", date: "2026-01-25" },
    { id: "3", description: "Netflix subscription", amount: 15.99, category: "Entertainment", date: "2026-01-20" },
    { id: "4", description: "Gas station", amount: 45.00, category: "Transportation", date: "2026-01-22" },
    { id: "5", description: "Restaurant dinner", amount: 67.80, category: "Food", date: "2026-01-27" },
    { id: "6", description: "Gym membership", amount: 50.00, category: "Health", date: "2026-01-15" },
    { id: "7", description: "Office supplies", amount: 32.45, category: "Other", date: "2026-01-18" },
    { id: "8", description: "Internet bill", amount: 79.99, category: "Utilities", date: "2026-01-10" },
  ];

  for (const expense of sampleExpenses) {
    insert.run(expense.id, expense.description, expense.amount, expense.category, expense.date);
  }

  console.log("Database seeded with sample expenses!");
} else {
  console.log("Database already has data, skipping seed.");
}

console.log("Database setup complete!");
db.close();
