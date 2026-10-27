import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import type { ThemeColors } from "@/constants/palette";
import {
  FREE_SUBSCRIPTION_LIMIT,
  PRO_ENABLED,
  PRO_PRICE_LABEL,
} from "@/constants/pro";
import { usePro } from "@/context/pro-context";
import { useTheme } from "@/hooks/use-theme";
import { useThemedStyles } from "@/hooks/use-themed-styles";

// "Your current plan" card in Settings: free usage and the way into Pro
export function PlanCard({ activeCount }: { activeCount: number }) {
  const styles = useThemedStyles(makeStyles);
  const theme = useTheme();
  const router = useRouter();
  const { isPro, resetForTesting } = usePro();

  if (!PRO_ENABLED) return null;

  const used = Math.min(activeCount, FREE_SUBSCRIPTION_LIMIT);
  const left = FREE_SUBSCRIPTION_LIMIT - activeCount;
  const atLimit = left <= 0;

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.pill}>
          <ThemedText style={styles.pillText}>YOUR CURRENT PLAN</ThemedText>
        </View>
        <View style={styles.status}>
          <View style={styles.statusDot} />
          <ThemedText style={styles.statusText}>Active</ThemedText>
        </View>
      </View>

      <View style={styles.titleRow}>
        <ThemedText style={styles.title}>{isPro ? "Renewa Pro" : "Free plan"}</ThemedText>
        <ThemedText style={styles.price}>{isPro ? "Lifetime" : "₱0"}</ThemedText>
      </View>
      <ThemedText style={styles.sub}>
        {isPro
          ? "Unlimited subscriptions and Family Sharing are unlocked."
          : `Track up to ${FREE_SUBSCRIPTION_LIMIT} subscriptions for free.`}
      </ThemedText>

      {!isPro && (
        <>
          <View style={styles.usage}>
            <View style={styles.usageRow}>
              <ThemedText style={styles.usageLabel}>Subscriptions</ThemedText>
              <ThemedText style={styles.usageCount}>
                {activeCount} of {FREE_SUBSCRIPTION_LIMIT} used
              </ThemedText>
            </View>
            <View style={styles.track}>
              <View
                style={[
                  styles.fill,
                  atLimit && styles.fillFull,
                  { width: `${(used / FREE_SUBSCRIPTION_LIMIT) * 100}%` },
                ]}
              />
            </View>
            <View style={styles.hintRow}>
              <Ionicons
                name={atLimit ? "alert-circle" : "information-circle-outline"}
                size={14}
                color={atLimit ? theme.amberText : theme.textTertiary}
              />
              <ThemedText style={[styles.hint, atLimit && styles.hintWarn]}>
                {atLimit
                  ? "Free limit reached. Unlock Pro to add more."
                  : `${left} ${left === 1 ? "slot" : "slots"} left on the free plan`}
              </ThemedText>
            </View>
          </View>

          <ThemedText style={styles.proLine}>
            <ThemedText style={styles.proLineStrong}>Renewa Pro: </ThemedText>
            unlimited subscriptions and Family Sharing, {PRO_PRICE_LABEL} once.
          </ThemedText>

          <Pressable onPress={() => router.push("/pro")}>
            <LinearGradient
              colors={["#4338CA", "#5B21B6", "#3730A3"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.cta}
            >
              <Ionicons name="star" size={15} color="#FFFFFF" />
              <ThemedText style={styles.ctaText}>Explore Renewa Pro</ThemedText>
            </LinearGradient>
          </Pressable>
        </>
      )}

      {isPro && __DEV__ && (
        <Pressable onPress={resetForTesting} hitSlop={8} style={styles.devReset}>
          <ThemedText style={styles.devResetText}>
            Back to free (test mode only)
          </ThemedText>
        </Pressable>
      )}
    </View>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    card: {
      backgroundColor: c.surface,
      borderRadius: 24,
      padding: 18,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: c.cardBorder,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: c.shadowOpacity,
      shadowRadius: 12,
      elevation: c.cardElevation,
    },
    topRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    pill: {
      backgroundColor: c.accentSoft,
      borderRadius: 20,
      paddingHorizontal: 10,
      paddingVertical: 4,
    },
    pillText: {
      fontSize: 10,
      fontWeight: "800",
      letterSpacing: 0.6,
      color: c.accentText,
    },
    status: { flexDirection: "row", alignItems: "center", gap: 5 },
    statusDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: c.greenText },
    statusText: { fontSize: 12, fontWeight: "600", color: c.greenText },
    titleRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "baseline",
      marginTop: 12,
    },
    title: { fontSize: 22, lineHeight: 28, fontWeight: "800", color: c.text },
    price: { fontSize: 18, fontWeight: "800", color: c.text },
    sub: { fontSize: 13, color: c.textSecondary, marginTop: 2 },
    usage: {
      marginTop: 14,
      padding: 14,
      borderRadius: 16,
      backgroundColor: c.surfaceMuted,
      gap: 8,
    },
    usageRow: { flexDirection: "row", justifyContent: "space-between" },
    usageLabel: { fontSize: 13, color: c.textSecondary },
    usageCount: { fontSize: 13, fontWeight: "700", color: c.accentText },
    track: {
      height: 6,
      borderRadius: 3,
      backgroundColor: c.border,
      overflow: "hidden",
    },
    fill: { height: 6, borderRadius: 3, backgroundColor: c.accent },
    fillFull: { backgroundColor: c.amberText },
    hintRow: { flexDirection: "row", alignItems: "center", gap: 6 },
    hint: { fontSize: 12, color: c.textTertiary },
    hintWarn: { color: c.amberText, fontWeight: "600" },
    proLine: { marginTop: 14, fontSize: 13, color: c.textSecondary },
    proLineStrong: { fontSize: 13, fontWeight: "700", color: c.text },
    cta: {
      marginTop: 12,
      height: 50,
      borderRadius: 25,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
    },
    ctaText: { color: "#FFFFFF", fontSize: 15, fontWeight: "700" },
    devReset: { alignSelf: "center", marginTop: 12 },
    devResetText: {
      fontSize: 12,
      color: c.textTertiary,
      textDecorationLine: "underline",
    },
  });
