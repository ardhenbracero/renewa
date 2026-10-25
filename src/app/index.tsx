import { TAB_BAR_SPACE } from "@/components/bottom-tab-bar";
import { FadeUp, FadeUpGroup } from "@/components/fade-up";
import { RenewingSoonSection } from "@/components/RenewingSoonSection";
import { ScreenHeader } from "@/components/screen-header";
import { SubscriptionRow } from "@/components/subscription-row";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import type { ThemeColors } from "@/constants/palette";
import { Spacing } from "@/constants/theme";
import { useProfile } from "@/context/profile-context";
import { useSubscriptions } from "@/hooks/use-subscriptions";
import { useTheme } from "@/hooks/use-theme";
import { useThemedStyles } from "@/hooks/use-themed-styles";
import { formatCurrency } from "@/utils/format";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function VaultScreen() {
  const styles = useThemedStyles(makeStyles);
  const theme = useTheme();
  const router = useRouter();
  const { subscriptions, renewingSoon, monthlyTotal, yearlyTotal, refresh } =
    useSubscriptions();
  const { name } = useProfile();

  const activeCount = subscriptions.filter((s) => s.status === "active").length;

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) return "Good morning";
    if (hour >= 12 && hour < 18) return "Good afternoon";
    return "Good evening";
  };

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
            <FadeUpGroup step={90}>
              <View>
                <View style={styles.header}>
                  <ScreenHeader
                    title={`${getGreeting()}, ${name || "there"}`}
                    subtitle="Here's what's coming up"
                    style={styles.greeting}
                  />
                </View>

                <LinearGradient
                  colors={["#4338CA", "#5B21B6", "#3730A3"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.summaryCard}
                >
                  {/* Decorative background icon */}
                  <Ionicons
                    name="reload-outline"
                    size={140}
                    color="#FFFFFF"
                    style={styles.bgIcon}
                    pointerEvents="none"
                  />
                  <View style={styles.activeSub}>
                    <ThemedText type="small" themeColor="onAccent">
                      MONTHLY RECURRING
                    </ThemedText>
                    <View style={styles.activePill}>
                      <View style={styles.activeDot} />
                      <ThemedText type="smallBold" themeColor="onAccent">
                        {activeCount} active
                      </ThemedText>
                    </View>
                  </View>
                  <ThemedText type="title" style={styles.totalText}>
                    {formatCurrency(monthlyTotal)}{" "}
                    <ThemedText themeColor="onAccent">/ month</ThemedText>
                  </ThemedText>
                  <View style={styles.divider} />
                  <View style={styles.yearlyRow}>
                    <ThemedText type="small" themeColor="onAccent">
                      Estimated yearly outlay
                    </ThemedText>
                    <ThemedText type="smallBold" themeColor="onAccent">
                      {formatCurrency(yearlyTotal)}
                    </ThemedText>
                  </View>
                </LinearGradient>

                <RenewingSoonSection renewingSoon={renewingSoon} />
                <ThemedText type="smallBold" style={styles.sectionTitle}>
                  All Subscriptions
                </ThemedText>
              </View>
            </FadeUpGroup>
          }
          renderItem={({ item, index }) => (
            <FadeUp delay={index < 6 ? 400 + index * 70 : 0}>
              <SubscriptionRow subscription={item} />
            </FadeUp>
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={
            <View style={styles.empty}>
              <ThemedText type="default" themeColor="textSecondary">
                No subscriptions yet. Tap + to add your first one.
              </ThemedText>
            </View>
          }
        />
      </SafeAreaView>
    </ThemedView>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    container: { flex: 1 },
    safeArea: { flex: 1 },
    bgIcon: {
      position: "absolute",
      right: -10,
      opacity: 0.12,
      transform: [{ rotate: "-15deg" }],
    },
    listContent: {
      paddingHorizontal: 20, // same side margin as Timeline/Insights/Settings
      paddingBottom: TAB_BAR_SPACE,
    },
    // ScreenHeader brings its own top padding; keep 16px below like other pages
    header: { paddingBottom: Spacing.three },
    greeting: { paddingRight: 36 }, // room for the settings gear on long names
    // Centered on the 36px title line, below ScreenHeader's 16px top padding
    settingsButton: { position: "absolute", right: 0, top: 23 },
    summaryCard: {
      borderRadius: Spacing.four,
      padding: Spacing.four,
      gap: Spacing.two,
      marginBottom: Spacing.four,
      overflow: "hidden",
    },
    totalText: {
      fontSize: 36,
      lineHeight: 40,
      fontWeight: "800",
      color: c.onAccent,
    },
    divider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: "#8888",
      marginVertical: Spacing.two,
    },
    activePill: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      backgroundColor: "#ffffff4e",
      borderRadius: 20,
      paddingVertical: Spacing.one,
      paddingHorizontal: 10,
    },
    activeDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: "#22C55E",
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
      backgroundColor: c.border,
    },
    empty: { paddingVertical: Spacing.five, alignItems: "center" },
  });
