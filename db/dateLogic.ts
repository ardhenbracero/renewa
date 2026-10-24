import { parseIsoDate } from "@/utils/date";
import { BillingCycle, Subscription } from "./schema";

// Adds `months` to a date, clamping to the last day of the target month
// (Jan 31 + 1 month = Feb 28, not Mar 3)
function addMonthsClamped(date: Date, months: number): Date {
  const result = new Date(date.getFullYear(), date.getMonth() + months, 1);
  const lastDay = new Date(
    result.getFullYear(),
    result.getMonth() + 1,
    0,
  ).getDate();
  result.setDate(Math.min(date.getDate(), lastDay));
  return result;
}

// Returns the date `times` billing cycles after `date`. Always counts from
// the same base date so a clamped month doesn't lose the original day
// (Jan 31 -> Feb 28 -> Mar 31, not Mar 28).
function addInterval(
  date: Date,
  cycle: BillingCycle,
  customDays: number | null,
  times = 1,
): Date {
  const result = new Date(date);
  switch (cycle) {
    case "weekly":
      result.setDate(result.getDate() + 7 * times);
      break;
    case "monthly":
      return addMonthsClamped(date, times);
    case "yearly":
      return addMonthsClamped(date, 12 * times);
    case "custom":
      result.setDate(result.getDate() + (customDays ?? 30) * times);
      break;
  }
  return result;
}

// Stored nextRenewalDate parsed as local midnight (older rows may carry a time)
function storedRenewalDate(sub: Subscription): Date {
  return parseIsoDate(sub.nextRenewalDate.slice(0, 10));
}

// How many cycles past the stored date the upcoming renewal is
function cyclesUntilUpcoming(sub: Subscription): number {
  const start = storedRenewalDate(sub);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let n = 0;
  while (addInterval(start, sub.billingCycle, sub.customIntervalDays, n) < today) {
    n++;
  }
  return n;
}

// Given a subscription, returns its next renewal date rolled forward
// past today, if it's fallen behind (e.g. app wasn't opened for a while)
export function getUpcomingRenewalDate(sub: Subscription): Date {
  return addInterval(
    storedRenewalDate(sub),
    sub.billingCycle,
    sub.customIntervalDays,
    cyclesUntilUpcoming(sub),
  );
}

// The date a subscription moves to when the user taps "Renew":
// one billing cycle after its current upcoming renewal.
export function getNextRenewalAfter(sub: Subscription): Date {
  return addInterval(
    storedRenewalDate(sub),
    sub.billingCycle,
    sub.customIntervalDays,
    cyclesUntilUpcoming(sub) + 1,
  );
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

  const start = storedRenewalDate(sub);
  const at = (n: number) =>
    addInterval(start, sub.billingCycle, sub.customIntervalDays, n);

  // Fast-forward up to the start of the target month.
  // Capped iteration count as a safety net against bad data.
  let n = 0;
  while (at(n) < monthStart && n < 240) n++;

  let safety = 0;
  while (at(n) < monthEnd && safety < 60) {
    const cursor = at(n);
    if (cursor >= monthStart) occurrences.push(cursor);
    n++;
    safety++;
  }

  return occurrences;
}
