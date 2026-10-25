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
    CREATE TABLE IF NOT EXISTS members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    subscription_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    is_manager INTEGER NOT NULL DEFAULT 0,
    paid INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_members_subscription ON members(subscription_id);
  `);

  migrateAddIconSlugColumn();
  migrateAddPaymentMethodColumn();
}

function migrateAddIconSlugColumn() {
  const columns = db.getAllSync<{ name: string }>(
    "PRAGMA table_info(subscriptions);",
  );
  const hasIconSlug = columns.some((col) => col.name === "iconSlug");
  if (!hasIconSlug) {
    db.execSync("ALTER TABLE subscriptions ADD COLUMN iconSlug TEXT;");
  }
}

function migrateAddPaymentMethodColumn() {
  const columns = db.getAllSync<{ name: string }>(
    "PRAGMA table_info(subscriptions);",
  );
  const hasPaymentMethod = columns.some((col) => col.name === "paymentMethod");
  if (!hasPaymentMethod) {
    db.execSync("ALTER TABLE subscriptions ADD COLUMN paymentMethod TEXT;");
  }
}

export default db;
