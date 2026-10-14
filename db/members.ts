import db from "./database";
import type { Member } from "./schema";

type MemberRow = {
  id: number;
  subscription_id: number;
  name: string;
  is_manager: number;
  paid: number;
  created_at: string;
};

// SQLite stores booleans as 0/1 and uses snake_case columns,
// so convert each row into the Member shape the app uses.
function toMember(row: MemberRow): Member {
  return {
    id: row.id,
    subscriptionId: row.subscription_id,
    name: row.name,
    isManager: row.is_manager === 1,
    paid: row.paid === 1,
    createdAt: row.created_at,
  };
}

export function getMembers(subscriptionId: number): Member[] {
  const rows = db.getAllSync<MemberRow>(
    "SELECT * FROM members WHERE subscription_id = ? ORDER BY id",
    [subscriptionId],
  );
  return rows.map(toMember);
}

export function addMember(
  subscriptionId: number,
  name: string,
  isManager = false,
) {
  db.runSync(
    `INSERT INTO members (subscription_id, name, is_manager, paid, created_at)
     VALUES (?, ?, ?, ?, ?)`,
    [
      subscriptionId,
      name,
      isManager ? 1 : 0,
      isManager ? 1 : 0, // the manager already pays the provider
      new Date().toISOString(),
    ],
  );
}

export function setMemberPaid(id: number, paid: boolean) {
  db.runSync("UPDATE members SET paid = ? WHERE id = ?", [paid ? 1 : 0, id]);
}

export function deleteMember(id: number) {
  db.runSync("DELETE FROM members WHERE id = ?", [id]);
}

export function deleteMembersForSubscription(subscriptionId: number) {
  db.runSync("DELETE FROM members WHERE subscription_id = ?", [subscriptionId]);
}

// New billing cycle: everyone except the manager goes back to unpaid
export function resetPaidForSubscription(subscriptionId: number) {
  db.runSync(
    "UPDATE members SET paid = 0 WHERE subscription_id = ? AND is_manager = 0",
    [subscriptionId],
  );
}
