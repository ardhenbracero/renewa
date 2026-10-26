export function formatCurrency(
  amount: number,
  currency: string = "PHP",
): string {
  // Whole amounts drop ".00" (₱549); real cents stay (₱149.50). Round to the
  // cent first so computed values like 549.0000001 still count as whole.
  const cents = Math.round(amount * 100);
  const digits = cents % 100 === 0 ? 0 : 2;
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    }).format(cents / 100);
  } catch {
    return `$${(cents / 100).toFixed(digits)}`;
  }
}

export function formatShortDate(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function cycleLabel(cycle: string): string {
  switch (cycle) {
    case "weekly":
      return "/wk";
    case "monthly":
      return "/mo";
    case "yearly":
      return "/yr";
    default:
      return "";
  }
}
