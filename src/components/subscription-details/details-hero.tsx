import { FadeUpGroup } from "@/components/fade-up";
import { ServiceIcon } from "@/components/service-icon";
import { ThemedText } from "@/components/themed-text";
import { daysUntil } from "@/hooks/use-subscriptions";
import { formatCurrency } from "@/utils/format";
import { getUpcomingRenewalDate, toMonthlyAmount } from "@db/dateLogic";
import type { Subscription } from "@db/schema";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, View } from "react-native";

function cycleSuffix(sub: Subscription) {
  switch (sub.billingCycle) {
    case "weekly":
      return "/ week";
    case "monthly":
      return "/ month";
    case "yearly":
      return "/ year";
    default:
      return `/ ${sub.customIntervalDays ?? 30} days`;
  }
}

export function DetailsHero({ sub }: { sub: Subscription }) {
  const days = daysUntil(getUpcomingRenewalDate(sub));
  const urgent = days <= 0;
  const dueLabel =
    days <= 0
      ? "Due today"
      : days === 1
        ? "Due tomorrow"
        : `Due in ${days} days`;

  const equivalent =
    sub.billingCycle === "yearly"
      ? `EQUIVALENT TO ${formatCurrency(toMonthlyAmount(sub), sub.currency)} / MONTH`
      : `EQUIVALENT TO ${formatCurrency(toMonthlyAmount(sub) * 12, sub.currency)} / YEAR`;

  return (
    <FadeUpGroup step={100}>
      <LinearGradient
        colors={["#4338CA", "#5B21B6", "#3730A3"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <View style={styles.topRow}>
          <ServiceIcon name={sub.name} iconSlug={sub.iconSlug} size={56} />

          <View style={styles.titleBlock}>
            <ThemedText style={styles.name} numberOfLines={1}>
              {sub.name}
            </ThemedText>
            <ThemedText style={styles.category} numberOfLines={1}>
              {sub.category}
            </ThemedText>
          </View>

          <View style={styles.rightCol}>
            <View style={[styles.duePill, urgent && styles.duePillUrgent]}>
              <ThemedText
                style={[styles.dueText, urgent && styles.dueTextUrgent]}
              >
                {dueLabel}
              </ThemedText>
            </View>

            {sub.autoPay && (
              <View style={styles.tag}>
                <ThemedText style={styles.tagText}>Auto-pay</ThemedText>
              </View>
            )}
            {sub.isTrial && (
              <View style={styles.tag}>
                <ThemedText style={styles.tagText}>Free trial</ThemedText>
              </View>
            )}
          </View>
        </View>

        <ThemedText style={styles.price}>
          {formatCurrency(sub.amount, sub.currency)}{" "}
          <ThemedText style={styles.per}>{cycleSuffix(sub)}</ThemedText>
        </ThemedText>
        <ThemedText style={styles.equivalent}>{equivalent}</ThemedText>
      </LinearGradient>
    </FadeUpGroup>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 12,
    marginHorizontal: 20,
    borderRadius: 24,
    padding: 18,
    overflow: "hidden",
    shadowColor: "#5B21B6",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 18,
    elevation: 6,
  },
  topRow: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  titleBlock: { flex: 1, paddingTop: 4 },
  name: { fontSize: 22, fontWeight: "800", color: "#FFFFFF" },
  category: { fontSize: 13, color: "rgba(255,255,255,0.75)", marginTop: 2 },
  rightCol: { alignItems: "flex-end", gap: 6 },
  duePill: {
    backgroundColor: "#FFF3CB",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
  },
  duePillUrgent: { backgroundColor: "#FEE2E2" },
  dueText: { fontSize: 11, fontWeight: "700", color: "#B45309" },
  dueTextUrgent: { color: "#DC2626" },
  tag: {
    backgroundColor: "rgba(255,255,255,0.18)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  tagText: { fontSize: 11, fontWeight: "600", color: "#FFFFFF" },
  price: { fontSize: 20, fontWeight: "800", color: "#FFFFFF", marginTop: 22 },
  per: { fontSize: 15, fontWeight: "500", color: "rgba(255,255,255,0.75)" },
  equivalent: {
    fontSize: 11,
    letterSpacing: 0.8,
    color: "rgba(255,255,255,0.6)",
    marginTop: 6,
  },
});
