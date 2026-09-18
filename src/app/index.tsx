import { useTheme } from "@/hooks/use-theme";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback } from "react";
import { FlatList, Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BottomTabBar } from "@/components/bottom-tab-bar";
import { SubscriptionRow } from "@/components/subscription-row";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Spacing } from "@/constants/theme";
import { daysUntil, useSubscriptions } from "@/hooks/use-subscriptions";
import { formatCurrency } from "@/utils/format";
import { getUpcomingRenewalDate } from "@db/dateLogic";

export default function VaultScreen() {
  const router = useRouter();
  const { subscriptions, renewingSoon, monthlyTotal, yearlyTotal, refresh } =
    useSubscriptions();

  const theme = useTheme();

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <FlatList
          data={subscriptions}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <View>
              <View style={styles.header}>
                <ThemedText type="subtitle">Hi, </ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  Here's what's coming up
                </ThemedText>
              </View>

              <LinearGradient
                colors={["#4338CA", "#5B21B6", "#3730A3"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.summaryCard}
              >
                <View style={styles.activeSub}>
                  <ThemedText type="small" themeColor="textSecondary">
                    MONTHLY RECURRING
                  </ThemedText>
                  <ThemedText
                    type="smallBold"
                    style={styles.activeSubscription}
                  >
                    {" "}
                    active{" "}
                  </ThemedText>
                </View>
                <ThemedText type="title" style={styles.totalText}>
                  {formatCurrency(monthlyTotal)}{" "}
                  <ThemedText themeColor="textSecondary">/ month</ThemedText>
                </ThemedText>
                <View style={styles.divider} />
                <View style={styles.yearlyRow}>
                  <ThemedText type="small" themeColor="textSecondary">
                    Estimated yearly outlay
                  </ThemedText>
                  <ThemedText type="smallBold">
                    {formatCurrency(yearlyTotal)}
                  </ThemedText>
                </View>
              </LinearGradient>

              {renewingSoon.length > 0 && (
                <View style={styles.soonSection}>
                  <ThemedText type="smallBold" style={styles.sectionTitle}>
                    Renewing soon
                  </ThemedText>
                  <FlatList
                    data={renewingSoon}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => `soon-${item.id}`}
                    contentContainerStyle={styles.soonList}
                    renderItem={({ item }) => {
                      const days = daysUntil(getUpcomingRenewalDate(item));
                      return (
                        <ThemedView
                          type="backgroundElement"
                          style={styles.soonCard}
                        >
                          <ThemedText type="default" numberOfLines={1}>
                            {item.name}
                          </ThemedText>
                          <ThemedText type="small" themeColor="textSecondary">
                            {days <= 0 ? "Due today" : `in ${days}d`}
                          </ThemedText>
                          <ThemedText type="smallBold" style={styles.soonPrice}>
                            {formatCurrency(item.amount, item.currency)}
                          </ThemedText>
                        </ThemedView>
                      );
                    }}
                  />
                </View>
              )}

              <ThemedText type="smallBold" style={styles.sectionTitle}>
                All Subscriptions
              </ThemedText>
            </View>
          }
          renderItem={({ item }) => <SubscriptionRow subscription={item} />}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={
            <View style={styles.empty}>
              <ThemedText type="default" themeColor="textSecondary">
                No subscriptions yet. Tap + to add your first one.
              </ThemedText>
            </View>
          }
        />

        <Pressable
          style={styles.fab}
          onPress={() => router.push("/add-subscription")}
        >
          <ThemedText type="title" style={styles.fabPlus}>
            +
          </ThemedText>
        </Pressable>
      </SafeAreaView>
      <BottomTabBar active="vault" />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  listContent: { paddingHorizontal: Spacing.three, paddingBottom: Spacing.six },
  header: { paddingVertical: Spacing.three },
  summaryCard: {
    borderRadius: Spacing.four,
    padding: Spacing.four,
    gap: Spacing.two,
    marginBottom: Spacing.four,
  },
  totalText: { fontSize: 36, lineHeight: 40, fontWeight: 800 },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#8888",
    marginVertical: Spacing.two,
  },
  activeSubscription: {
    backgroundColor: "#ffffff4e",
    borderRadius: 20,
    padding: Spacing.one,
  },
  activeSub: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  yearlyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  soonSection: { marginBottom: Spacing.four },
  sectionTitle: { marginBottom: Spacing.two },
  soonList: { gap: Spacing.two, paddingRight: Spacing.three },
  soonCard: {
    width: 132,
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.one,
  },
  soonPrice: { marginTop: Spacing.one },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#8888",
  },
  empty: { paddingVertical: Spacing.five, alignItems: "center" },
  fab: {
    position: "absolute",
    right: Spacing.four,
    bottom: Spacing.four,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#4F46E5",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  fabPlus: { color: "#ffffff", fontSize: 28, lineHeight: 30 },
});
