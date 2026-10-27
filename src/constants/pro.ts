import type { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";

// Master switch for Renewa Pro. false = everything unlocked and no Pro UI,
// so the app can ship 1.0 fully free and turn Pro on in a later update.
export const PRO_ENABLED = true;

// Free plan limit on active subscriptions. Users already above it keep
// everything; only adding new ones is blocked.
export const FREE_SUBSCRIPTION_LIMIT = 5;

// Shown until the App Store provides the localized price (see utils/purchases.ts)
export const PRO_PRICE_LABEL = "₱199";

export const PRO_FEATURES: {
  icon: ComponentProps<typeof Ionicons>["name"];
  title: string;
  body: string;
}[] = [
  {
    icon: "infinite-outline",
    title: "Unlimited subscriptions",
    body: `Track everything you pay for, not just ${FREE_SUBSCRIPTION_LIMIT}.`,
  },
  {
    icon: "people-outline",
    title: "Family Sharing",
    body: "Split a plan's cost and track who has paid you.",
  },
  {
    icon: "sparkles-outline",
    title: "Future Pro features",
    body: "Included at no extra cost when they arrive.",
  },
  {
    icon: "lock-closed-outline",
    title: "Still on-device only",
    body: "No account, no cloud. Pro doesn't change that.",
  },
];
