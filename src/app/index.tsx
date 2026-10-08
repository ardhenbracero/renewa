import { BottomTabBar } from "@/components/bottom-tab-bar";
import { RenewingSoonSection } from "@/components/RenewingSoonSection";
import { SubscriptionRow } from "@/components/subscription-row";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors, Spacing } from "@/constants/theme";
import { useProfile } from "@/context/profile-context";
import { useSubscriptions } from "@/hooks/use-subscriptions";
import { useTheme } from "@/hooks/use-theme";
import { formatCurrency } from "@/utils/format";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback } from "react";
import { FlatList, Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function VaultScreen() {
  const router = useRouter();
  const { subscriptions, renewingSoon, monthlyTotal, yearlyTotal, refresh } =
    useSubscriptions();
  const { name } = useProfile();

  const theme = useTheme();
  const activeCount = subscriptions.filter((s) => s.status === "active").length;

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
                <ThemedText type="subtitle">Hi, {name || "there"}</ThemedText>
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
                  <View style={styles.activeSubRow}>
                    <ThemedText
                      type="smallBold"
                      style={styles.activeSubscription}
                    >
                      <View style={styles.activeDot} /> {activeCount} active
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
  bgIcon: {
    position: "absolute",
    right: -10,
    opacity: 0.12,
    transform: [{ rotate: "-15deg" }],
  },
  listContent: { paddingHorizontal: Spacing.three, paddingBottom: Spacing.six },
  header: { paddingVertical: Spacing.three },
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
    fontWeight: 800,
    color: Colors.light.onAccent,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#8888",
    marginVertical: Spacing.two,
  },
  activeSubRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#22C55E",
  },
  activeSubscription: {
    backgroundColor: "#ffffff4e",
    borderRadius: 20,
    padding: Spacing.one,
    paddingHorizontal: 10,
    color: Colors.light.onAccent,
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
