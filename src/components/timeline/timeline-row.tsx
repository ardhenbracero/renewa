import { router } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";

import { ServiceIcon } from "@/components/service-icon";
import { ThemedText } from "@/components/themed-text";
import { daysUntil } from "@/hooks/use-subscriptions";
import { formatCurrency } from "@/utils/format";
import type { Subscription } from "@db/schema";

function cycleSuffix(sub: Subscription) {
  switch (sub.billingCycle) {
    case "weekly":
      return "/week";
    case "monthly":
      return "/month";
    case "yearly":
      return "/year";
    default:
      return `/${sub.customIntervalDays ?? 30}d`;
  }
}

export function TimelineRow({
  subscription,
  date,
  showDate = false,
}: {
  subscription: Subscription;
  date: Date;
  showDate?: boolean;
}) {
  const days = daysUntil(date);
  const pill = days === 0 ? "Today" : days === 1 ? "Tomorrow" : null;
  const urgent = days === 0;

  const subtitle = showDate
    ? `${subscription.category} · ${date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })}`
    : subscription.category;

  return (
    <Pressable
      style={styles.card}
      onPress={() => router.push(`/subscription-details?id=${subscription.id}`)}
    >
      <ServiceIcon
        name={subscription.name}
        iconSlug={subscription.iconSlug}
        size={44}
      />

      <View style={{ flex: 1 }}>
        <View style={styles.nameRow}>
          <ThemedText style={styles.name} numberOfLines={1}>
            {subscription.name}
          </ThemedText>
          {subscription.autoPay && <View style={styles.autoDot} />}
          {pill && (
            <View style={[styles.pill, urgent && styles.pillUrgent]}>
              <ThemedText
                style={[styles.pillText, urgent && styles.pillTextUrgent]}
              >
                {pill}
              </ThemedText>
            </View>
          )}
        </View>
        <ThemedText style={styles.subtitle} numberOfLines={1}>
          {subtitle}
        </ThemedText>
      </View>

      <View style={styles.right}>
        <ThemedText style={styles.amount}>
          {formatCurrency(subscription.amount, subscription.currency)}
        </ThemedText>
        <ThemedText style={styles.per}>{cycleSuffix(subscription)}</ThemedText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  nameRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  name: { flexShrink: 1, fontSize: 15, fontWeight: "700", color: "#111827" },
  autoDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#10B981" },
  pill: {
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
  },
  pillUrgent: { backgroundColor: "#FEE2E2" },
  pillText: { fontSize: 10, fontWeight: "700", color: "#B45309" },
  pillTextUrgent: { color: "#DC2626" },
  subtitle: { fontSize: 12, color: "#9CA3AF", marginTop: 2 },
  right: { alignItems: "flex-end", flexDirection: "row", gap: 5 },
  amount: { fontSize: 15, fontWeight: "600", color: "#111827" },
  per: { fontSize: 11, color: "#9CA3AF", marginTop: 1 },
});
