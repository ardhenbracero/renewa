import type { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";

import type { PaymentMethod } from "@db/schema";

// Where a subscription is paid from. Shared by the add form and Details.
export const PAYMENT_METHODS: {
  value: PaymentMethod;
  label: string;
  icon: ComponentProps<typeof Ionicons>["name"];
}[] = [
  { value: "debit", label: "Debit", icon: "wallet-outline" },
  { value: "credit", label: "Credit", icon: "card-outline" },
  { value: "cash", label: "Cash", icon: "cash-outline" },
];

export function paymentMethodLabel(method: PaymentMethod | null): string {
  return PAYMENT_METHODS.find((m) => m.value === method)?.label ?? "Not set";
}
