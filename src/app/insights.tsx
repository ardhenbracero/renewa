import { useFocusEffect } from "expo-router";
import { useCallback, useMemo } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { TAB_BAR_SPACE } from "@/components/bottom-tab-bar";
import { FadeUpGroup } from "@/components/fade-up";
import { BillingCycles } from "@/components/insights/billing-cycles";
import { CategoryCard } from "@/components/insights/category-card";
import { OutlookCard } from "@/components/insights/outlook-card";
import { PriciestCard } from "@/components/insights/priciest-card";
import { ScreenHeader } from "@/components/screen-header";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import type { ThemeColors } from "@/constants/palette";
import { useThemedStyles } from "@/hooks/use-themed-styles";
import { useSubscriptions } from "@/hooks/use-subscriptions";
import {
    buildCategoryBreakdown,
    buildCycleSummary,
    buildOutlook,
} from "@/utils/insights";
import { toMonthlyAmount } from "@db/dateLogic";
import type { Subscription } from "@db/schema";

export default function InsightsScreen() {
  const styles = useThemedStyles(makeStyles);
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
            <ScreenHeader title="Insights" subtitle="Where your money goes" />

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
      </SafeAreaView>
    </ThemedView>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    container: { flex: 1 },
    safeArea: { flex: 1 },
    content: { paddingHorizontal: 20, paddingBottom: TAB_BAR_SPACE, gap: 16 },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: c.text,
      marginBottom: 12,
    },
    emptyCard: {
      backgroundColor: c.surface,
      borderWidth: 1,
      borderColor: c.cardBorder,
      borderRadius: 24,
      padding: 22,
      alignItems: "center",
    },
    emptyTitle: { fontSize: 16, fontWeight: "800", color: c.text },
    emptySub: {
      fontSize: 13,
      color: c.textSecondary,
      marginTop: 6,
      textAlign: "center",
    },
  });
