import { ServiceIcon } from "@/components/service-icon";
import { ThemedText } from "@/components/themed-text";
import { daysUntil } from "@/hooks/use-subscriptions";
import { formatCurrency } from "@/utils/format";
import { getUpcomingRenewalDate } from "@db/dateLogic";
import { router } from "expo-router";
import { FlatList, Pressable, StyleSheet, View } from "react-native";

// TEMPORARY — hardcoded test data, remove once confirmed working

export function RenewingSoonSection({ renewingSoon }: { renewingSoon: any[] }) {
  if (renewingSoon.length === 0) return null;

  return (
    <View style={styles.wrapper}>
      <View style={styles.headerRow}>
        <ThemedText style={styles.sectionTitle}>Renewing soon</ThemedText>
        <View style={styles.countPill}>
          <ThemedText style={styles.countPillText}>
            {renewingSoon.length} this week
          </ThemedText>
        </View>
      </View>

      <FlatList
        data={renewingSoon}
        keyExtractor={(item) => String(item.id)}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
        renderItem={({ item }) => {
          const days = daysUntil(getUpcomingRenewalDate(item));
          const isUrgent = days <= 0;
          const dueLabel =
            days <= 0 ? "Today" : days === 1 ? "1 day" : `${days} days`;

          return (
            <Pressable
              style={styles.card}
              onPress={() => router.push(`/add-subscription?id=${item.id}`)}
            >
              <View style={styles.titleRow}>
                <ServiceIcon
                  name={item.name}
                  iconSlug={item.iconSlug}
                  size={36}
                />

                <View
                  style={[styles.duePill, isUrgent && styles.duePillUrgent]}
                >
                  <ThemedText
                    style={[
                      styles.duePillText,
                      isUrgent && styles.duePillTextUrgent,
                    ]}
                  >
                    {dueLabel}
                  </ThemedText>
                </View>
              </View>

              <ThemedText style={styles.name} numberOfLines={1}>
                {item.name}
              </ThemedText>
              <ThemedText style={styles.nameCategory}>
                {item.category}
              </ThemedText>
              <View style={styles.hr} />
              <View style={styles.titleRow}>
                <ThemedText style={styles.cost}> cost </ThemedText>
                <ThemedText style={styles.amount}>
                  {formatCurrency(item.amount, item.currency)}
                </ThemedText>
              </View>
            </Pressable>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: 24 },
  headerRow: {
    flexDirection: "row",
    gap: 15,
    alignItems: "baseline",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
  },
  row: {
    gap: 12,
  },
  card: {
    width: 140,
    height: 140,
    borderWidth: 1,
    borderColor: "#00000019",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 10,
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 15,
  },
  countPill: {
    backgroundColor: "#FFFCEA",
    borderWidth: 2,
    borderColor: "#FFF3CB",
    borderRadius: 30,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  countPillText: {
    color: "#111827",
    fontSize: 12,
    fontWeight: "600",
  },
  name: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111827",
  },
  amount: {
    fontSize: 12,
    color: "#111827",
  },
  cost: {
    fontSize: 12,
    color: "#6B7280",
  },
  nameCategory: {
    fontSize: 12,
    lineHeight: 15,
    color: "#6B7280",
  },
  duePill: {
    alignSelf: "flex-start",
    backgroundColor: "#FFFCEA",
    borderWidth: 2,
    borderColor: "#FFF3CB",
    borderRadius: 30,
    paddingHorizontal: 8,
    paddingVertical: 1,
  },
  duePillUrgent: {
    backgroundColor: "#FEE2E2",
    borderColor: "#FECACA",
  },
  duePillText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#B45309",
  },
  duePillTextUrgent: {
    color: "#DC2626",
  },
  titleRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  hr: {
    borderBottomColor: "#cccccc96",
    borderBottomWidth: 1,
  },
  sectionCount: {
    color: "#111827",
    backgroundColor: "#FFFCEA",
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#FFF3CB",
    padding: 7,
    fontSize: 12,
    fontWeight: "500",
  },
});
