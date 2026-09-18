import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync("renewa.db");

export function initDatabase() {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS subscriptions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      amount REAL NOT NULL,
      currency TEXT NOT NULL DEFAULT 'USD',
      billingCycle TEXT NOT NULL,
      customIntervalDays INTEGER,
      category TEXT NOT NULL DEFAULT 'Other',
      notes TEXT,
      isTrial INTEGER NOT NULL DEFAULT 0,
      trialConvertsAt TEXT,
      autoPay INTEGER NOT NULL DEFAULT 1,
      startDate TEXT NOT NULL,
      nextRenewalDate TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'active',
      createdAt TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
}

export default db;
