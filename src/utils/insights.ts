import { getRenewalOccurrencesInMonth, toMonthlyAmount } from "@db/dateLogic";
import type { BillingCycle, Subscription } from "@db/schema";

const COLORS = ["#4338CA", "#EF4444", "#F59E0B", "#10B981", "#38BDF8"];
const REST_COLOR = "#9CA3AF";
const MAX_SLICES = 5;

export type CategorySlice = {
  name: string;
  amount: number;
  percent: number;
  color: string;
};

// Spend per category, as a monthly equivalent (yearly / 12, weekly x 4.345)
export function buildCategoryBreakdown(subs: Subscription[]) {
  const byCategory = new Map<string, number>();
  for (const s of subs) {
    byCategory.set(
      s.category,
      (byCategory.get(s.category) ?? 0) + toMonthlyAmount(s),
    );
  }

  const sorted = Array.from(byCategory.entries()).sort((a, b) => b[1] - a[1]);
  const total = sorted.reduce((sum, [, v]) => sum + v, 0);
  const overflow = sorted.length > MAX_SLICES;

  // More than 5 categories: keep the top 4 and group the rest
  const rows: [string, number][] = overflow
    ? [
        ...sorted.slice(0, MAX_SLICES - 1),
        [
          "More categories",
          sorted.slice(MAX_SLICES - 1).reduce((sum, [, v]) => sum + v, 0),
        ],
      ]
    : sorted;

  const slices: CategorySlice[] = rows.map(([name, amount], i) => ({
    name,
    amount,
    percent: total > 0 ? amount / total : 0,
    color:
      overflow && i === rows.length - 1
        ? REST_COLOR
        : COLORS[i % COLORS.length],
  }));

  return { slices, total, categoryCount: sorted.length };
}

export function buildCycleSummary(subs: Subscription[]) {
  const summary: Record<BillingCycle, { count: number; sum: number }> = {
    weekly: { count: 0, sum: 0 },
    monthly: { count: 0, sum: 0 },
    yearly: { count: 0, sum: 0 },
    custom: { count: 0, sum: 0 },
  };
  for (const s of subs) {
    summary[s.billingCycle].count += 1;
    summary[s.billingCycle].sum += s.amount;
  }
  return summary;
}

export type OutlookMonth = { label: string; total: number; date: Date };

// Scheduled charges for this month and the next (months - 1)
export function buildOutlook(subs: Subscription[], months = 6): OutlookMonth[] {
  const now = new Date();
  return Array.from({ length: months }, (_, i) => {
    const date = new Date(now.getFullYear(), now.getMonth() + i, 1);
    const total = subs.reduce(
      (sum, s) =>
        sum +
        getRenewalOccurrencesInMonth(s, date.getFullYear(), date.getMonth())
          .length *
          s.amount,
      0,
    );
    return {
      label: date.toLocaleDateString("en-US", { month: "short" }),
      total,
      date,
    };
  });
}
