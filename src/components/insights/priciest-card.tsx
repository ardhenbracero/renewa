import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";

import { ServiceIcon } from "@/components/service-icon";
import { ThemedText } from "@/components/themed-text";
import { formatCurrency } from "@/utils/format";
import type { Subscription } from "@db/schema";

export function PriciestCard({
  sub,
  monthly,
  share,
}: {
  sub: Subscription;
  monthly: number;
  share: number; // 0..1
}) {
  return (
    <Pressable
      onPress={() => router.push(`/subscription-details?id=${sub.id}`)}
    >
      <LinearGradient
        colors={["#4338CA", "#5B21B6", "#3730A3"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <View style={styles.topRow}>
          <View style={styles.labelRow}>
            <View style={styles.labelDot} />
            <ThemedText style={styles.label}>PRICIEST SUBSCRIPTION</ThemedText>
          </View>
          <View style={styles.sharePill}>
            <ThemedText style={styles.shareText}>
              {Math.round(share * 100)}% of spend
            </ThemedText>
          </View>
        </View>

        <View style={styles.bottomRow}>
          <ServiceIcon name={sub.name} iconSlug={sub.iconSlug} size={46} />

          <View style={{ flex: 1 }}>
            <ThemedText style={styles.name} numberOfLines={1}>
              {sub.name}
            </ThemedText>
            <ThemedText style={styles.category} numberOfLines={1}>
              {sub.category}
            </ThemedText>
          </View>

          <View style={{ alignItems: "flex-end" }}>
            <ThemedText style={styles.amount}>
              {formatCurrency(monthly)}
            </ThemedText>
            <ThemedText style={styles.per}>/month</ThemedText>
          </View>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 22, padding: 16, gap: 16 },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  labelRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  labelDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: "#6366F1",
  },
  label: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.8,
    color: "rgba(255,255,255,0.65)",
  },
  sharePill: {
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  shareText: {
    fontSize: 11,
    fontWeight: "600",
    color: "rgba(255,255,255,0.75)",
  },
  bottomRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  name: { fontSize: 16, fontWeight: "800", color: "#FFFFFF" },
  category: { fontSize: 12, color: "rgba(255,255,255,0.55)", marginTop: 2 },
  amount: { fontSize: 20, fontWeight: "800", color: "#FFFFFF" },
  per: { fontSize: 11, color: "rgba(255,255,255,0.55)", marginTop: 1 },
});
