import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { formatCurrency } from "@/utils/format";
import type { Subscription } from "@db/schema";

export function SelectedDayCard({
  date,
  occurrences,
  isToday,
}: {
  date: Date;
  occurrences: { date: Date; subscription: Subscription }[];
  isToday: boolean;
}) {
  const count = occurrences.length;
  const total = occurrences.reduce((sum, o) => sum + o.subscription.amount, 0);
  const anyAutoPay = occurrences.some((o) => o.subscription.autoPay);

  const dateLabel = date
    .toLocaleDateString("en-US", { month: "long", day: "numeric" })
    .toUpperCase();

  const title =
    count === 0
      ? "No renewals for today"
      : `${count} Renewal${count > 1 ? "s" : ""} ${isToday ? "Due Today" : "Scheduled"}`;

  return (
    <LinearGradient
      colors={["#4338CA", "#5B21B6", "#3730A3"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}
    >
      <View style={styles.iconBadge}>
        <Ionicons name="calendar-outline" size={20} color="#FFFFFF" />
      </View>

      <View style={{ flex: 1 }}>
        <ThemedText style={styles.label}>SELECTED · {dateLabel}</ThemedText>
        <ThemedText style={styles.title}>{title}</ThemedText>
      </View>

      {count > 0 && (
        <View style={styles.right}>
          <ThemedText style={styles.amount}>{formatCurrency(total)}</ThemedText>
          <ThemedText style={styles.autoPay}>
            {anyAutoPay ? "auto-pay active" : "manual payment"}
          </ThemedText>
        </View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 16,
    borderRadius: 22,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconBadge: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.6,
    color: "rgba(255,255,255,0.6)",
  },
  title: { fontSize: 16, fontWeight: "800", color: "#FFFFFF", marginTop: 3 },
  right: { alignItems: "flex-end" },
  amount: { fontSize: 18, fontWeight: "800", color: "#FFFFFF" },
  autoPay: { fontSize: 10, color: "rgba(255,255,255,0.6)", marginTop: 2 },
});
