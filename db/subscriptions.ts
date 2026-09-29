import db from "./database";
import { NewSubscription, Subscription } from "./schema";

// Converts a raw SQLite row (0/1 booleans) into a proper Subscription object
function rowToSubscription(row: any): Subscription {
  return {
    ...row,
    isTrial: !!row.isTrial,
    autoPay: !!row.autoPay,
  };
}

export function addSubscription(sub: NewSubscription): number {
  const result = db.runSync(
    `INSERT INTO subscriptions
      (name, amount, currency, billingCycle, customIntervalDays, category, notes, isTrial, trialConvertsAt, autoPay, startDate, nextRenewalDate, status, iconSlug)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      sub.name,
      sub.amount,
      sub.currency,
      sub.billingCycle,
      sub.customIntervalDays,
      sub.category,
      sub.notes,
      sub.isTrial ? 1 : 0,
      sub.trialConvertsAt,
      sub.autoPay ? 1 : 0,
      sub.startDate,
      sub.nextRenewalDate,
      sub.status,
      sub.iconSlug,
    ],
  );
  return result.lastInsertRowId;
}

export function getAllSubscriptions(): Subscription[] {
  const rows = db.getAllSync(
    "SELECT * FROM subscriptions ORDER BY nextRenewalDate ASC",
  );
  return rows.map(rowToSubscription);
}

export function getActiveSubscriptions(): Subscription[] {
  const rows = db.getAllSync(
    "SELECT * FROM subscriptions WHERE status = 'active' ORDER BY nextRenewalDate ASC",
  );
  return rows.map(rowToSubscription);
}

export function getSubscriptionById(id: number): Subscription | null {
  const row = db.getFirstSync("SELECT * FROM subscriptions WHERE id = ?", [id]);
  return row ? rowToSubscription(row) : null;
}

export function updateSubscription(
  id: number,
  sub: Partial<NewSubscription>,
): void {
  const fields = Object.keys(sub);
  if (fields.length === 0) return;

  const setClause = fields.map((f) => `${f} = ?`).join(", ");
  const values = fields.map((f) => {
    const value = (sub as any)[f];
    if (typeof value === "boolean") return value ? 1 : 0;
    return value;
  });

  db.runSync(`UPDATE subscriptions SET ${setClause} WHERE id = ?`, [
    ...values,
    id,
  ]);
}

export function deleteSubscription(id: number): void {
  db.runSync("DELETE FROM subscriptions WHERE id = ?", [id]);
}

export function archiveSubscription(id: number): void {
  updateSubscription(id, { status: "cancelled" });
}
