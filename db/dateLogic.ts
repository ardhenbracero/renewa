import { BillingCycle, Subscription } from "./schema";

function addInterval(
  date: Date,
  cycle: BillingCycle,
  customDays: number | null,
): Date {
  const result = new Date(date);
  switch (cycle) {
    case "weekly":
      result.setDate(result.getDate() + 7);
      break;
    case "monthly":
      result.setMonth(result.getMonth() + 1);
      break;
    case "yearly":
      result.setFullYear(result.getFullYear() + 1);
      break;
    case "custom":
      result.setDate(result.getDate() + (customDays ?? 30));
      break;
  }
  return result;
}

// Given a subscription, returns its next renewal date rolled forward
// past today, if it's fallen behind (e.g. app wasn't opened for a while)
export function getUpcomingRenewalDate(sub: Subscription): Date {
  let next = new Date(sub.nextRenewalDate);
  const today = new Date();

  while (next < today) {
    next = addInterval(next, sub.billingCycle, sub.customIntervalDays);
  }

  return next;
}

// Converts a subscription's cost into a monthly-equivalent amount,
// used for the "Monthly total" figure on the Vault screen
export function toMonthlyAmount(sub: Subscription): number {
  switch (sub.billingCycle) {
    case "weekly":
      return sub.amount * 4.345;
    case "monthly":
      return sub.amount;
    case "yearly":
      return sub.amount / 12;
    case "custom":
      return sub.amount * (30 / (sub.customIntervalDays ?? 30));
  }
}

// Projects a subscription's renewal cycle forward from its stored
// nextRenewalDate and returns every occurrence that falls within the
// given calendar month (month is 0-indexed, JS Date convention).
// Used by the Timeline screen to plot renewal dots on a month grid.
export function getRenewalOccurrencesInMonth(
  sub: Subscription,
  year: number,
  month: number,
): Date[] {
  const occurrences: Date[] = [];
  const monthStart = new Date(year, month, 1);
  const monthEnd = new Date(year, month + 1, 1);

  let cursor = new Date(sub.nextRenewalDate);

  // Fast-forward cursor up to the start of the target month.
  // Capped iteration count as a safety net against bad data.
  let safety = 0;
  while (cursor < monthStart && safety < 240) {
    cursor = addInterval(cursor, sub.billingCycle, sub.customIntervalDays);
    safety++;
  }

  safety = 0;
  while (cursor < monthEnd && safety < 60) {
    if (cursor >= monthStart && cursor < monthEnd) {
      occurrences.push(new Date(cursor));
    }
    cursor = addInterval(cursor, sub.billingCycle, sub.customIntervalDays);
    safety++;
  }

  return occurrences;
}
