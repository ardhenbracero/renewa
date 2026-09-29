export function formatCurrency(
  amount: number,
  currency: string = "PHP",
): string {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `$${amount.toFixed(2)}`;
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
