export type BillingCycle = "weekly" | "monthly" | "yearly" | "custom";

export type SubscriptionStatus = "active" | "cancelled" | "archived";

export interface Subscription {
  id: number;
  name: string;
  amount: number;
  currency: string;
  billingCycle: BillingCycle;
  customIntervalDays: number | null;
  category: string;
  notes: string | null;
  isTrial: boolean;
  trialConvertsAt: string | null; // ISO date string
  autoPay: boolean;
  startDate: string; // ISO date string
  nextRenewalDate: string; // ISO date string
  status: SubscriptionStatus;
  createdAt: string;
}

// Shape used when creating a new subscription (no id/createdAt yet)
export type NewSubscription = Omit<Subscription, "id" | "createdAt">;
