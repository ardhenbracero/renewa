import { and, eq } from "drizzle-orm";

import { db } from "./database"; // adjust to however you export your db
import { Member, members } from "./schema";

export function getMembers(subscriptionId: number): Member[] {
  return db
    .select()
    .from(members)
    .where(eq(members.subscriptionId, subscriptionId))
    .orderBy(members.id)
    .all();
}

export function addMember(
  subscriptionId: number,
  name: string,
  isManager = false,
) {
  db.insert(members)
    .values({
      subscriptionId,
      name,
      isManager,
      paid: isManager, // the manager already pays the provider
      createdAt: new Date().toISOString(),
    })
    .run();
}

export function setMemberPaid(id: number, paid: boolean) {
  db.update(members).set({ paid }).where(eq(members.id, id)).run();
}

export function deleteMember(id: number) {
  db.delete(members).where(eq(members.id, id)).run();
}

export function deleteMembersForSubscription(subscriptionId: number) {
  db.delete(members).where(eq(members.subscriptionId, subscriptionId)).run();
}

// New billing cycle: everyone except the manager goes back to unpaid
export function resetPaidForSubscription(subscriptionId: number) {
  db.update(members)
    .set({ paid: false })
    .where(
      and(
        eq(members.subscriptionId, subscriptionId),
        eq(members.isManager, false),
      ),
    )
    .run();
}
