import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useMemo } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BottomTabBar } from "@/components/bottom-tab-bar";
import { FadeUpGroup } from "@/components/fade-up";
import { BillingCycles } from "@/components/insights/billing-cycles";
import { CategoryCard } from "@/components/insights/category-card";
import { OutlookCard } from "@/components/insights/outlook-card";
import { PriciestCard } from "@/components/insights/priciest-card";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useSubscriptions } from "@/hooks/use-subscriptions";
import {
    buildCategoryBreakdown,
    buildCycleSummary,
    buildOutlook,
} from "@/utils/insights";
import { toMonthlyAmount } from "@db/dateLogic";
import type { Subscription } from "@db/schema";

export default function InsightsScreen() {
  const router = useRouter();
  const { subscriptions, refresh } = useSubscriptions();

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  const breakdown = useMemo(
    () => buildCategoryBreakdown(subscriptions),
    [subscriptions],
  );
  const cycles = useMemo(
    () => buildCycleSummary(subscriptions),
    [subscriptions],
  );
  const outlook = useMemo(() => buildOutlook(subscriptions), [subscriptions]);

  const priciest = subscriptions.reduce<Subscription | null>(
    (best, s) =>
      !best || toMonthlyAmount(s) > toMonthlyAmount(best) ? s : best,
    null,
  );
  const priciestMonthly = priciest ? toMonthlyAmount(priciest) : 0;
  const priciestShare =
    breakdown.total > 0 ? priciestMonthly / breakdown.total : 0;

  const isEmpty = subscriptions.length === 0;

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <FadeUpGroup step={90}>
            <View style={styles.header}>
              <ThemedText style={styles.title}>Insights</ThemedText>
              <ThemedText style={styles.subtitle}>
                Where your money goes
              </ThemedText>
            </View>

            {isEmpty ? (
              <View style={styles.emptyCard}>
                <ThemedText style={styles.emptyTitle}>
                  Nothing to analyze yet
                </ThemedText>
                <ThemedText style={styles.emptySub}>
                  Add a subscription and your spending breakdown will show up
                  here.
                </ThemedText>
              </View>
            ) : (
              <CategoryCard
                slices={breakdown.slices}
                total={breakdown.total}
                categoryCount={breakdown.categoryCount}
              />
            )}

            {priciest && (
              <PriciestCard
                sub={priciest}
                monthly={priciestMonthly}
                share={priciestShare}
              />
            )}

            {!isEmpty && <OutlookCard months={outlook} />}

            {!isEmpty && (
              <View>
                <ThemedText style={styles.sectionTitle}>
                  Billing Cycles
                </ThemedText>
                <BillingCycles summary={cycles} />
              </View>
            )}
          </FadeUpGroup>
        </ScrollView>

        <Pressable
          style={styles.fab}
          onPress={() => router.push("/add-subscription")}
        >
          <Ionicons name="add" size={30} color="#FFFFFF" />
        </Pressable>
      </SafeAreaView>
      <BottomTabBar active="insights" />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  content: { paddingHorizontal: 20, paddingBottom: 120, gap: 16 },
  header: { paddingTop: 8 },
  title: { fontSize: 30, fontWeight: "800", color: "#111827" },
  subtitle: { fontSize: 13, color: "#9CA3AF", marginTop: 2 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
  },
  emptyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 22,
    alignItems: "center",
  },
  emptyTitle: { fontSize: 16, fontWeight: "800", color: "#111827" },
  emptySub: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 6,
    textAlign: "center",
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#5B21B6",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#5B21B6",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
});
