import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import type { ThemeColors } from "@/constants/palette";
import {
  FREE_SUBSCRIPTION_LIMIT,
  PRO_FEATURES,
  PRO_PRICE_LABEL,
} from "@/constants/pro";
import { usePro } from "@/context/pro-context";
import { useTheme } from "@/hooks/use-theme";
import { useThemedStyles } from "@/hooks/use-themed-styles";

// Opened from Settings, the + button at the free limit (?reason=limit), and
// Add member (?reason=family)
const REASONS: Record<string, string> = {
  limit: `You've reached ${FREE_SUBSCRIPTION_LIMIT} subscriptions on the free plan.`,
  family: "Family Sharing is a Pro feature.",
};

export default function ProScreen() {
  const styles = useThemedStyles(makeStyles);
  const theme = useTheme();
  const router = useRouter();
  const { reason } = useLocalSearchParams<{ reason?: string }>();
  const { isPro, buy, restore } = usePro();
  const [busy, setBusy] = useState(false);

  async function run(action: () => Promise<boolean>) {
    if (busy) return;
    setBusy(true);
    try {
      if (await action()) router.back();
    } finally {
      setBusy(false);
    }
  }

  return (
    // ScrollView as the root, like the add form sheet
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Pressable
        style={styles.closeButton}
        onPress={() => router.back()}
        hitSlop={10}
        accessibilityLabel="Close"
      >
        <Ionicons name="close" size={18} color={theme.text} />
      </Pressable>

      <LinearGradient
        colors={["#4338CA", "#5B21B6", "#3730A3"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}
      >
        <Image
          source={require("@/assets/images/icon-dark.png")}
          style={styles.heroMark}
          resizeMode="contain"
        />
        <View style={styles.eyebrowPill}>
          <ThemedText style={styles.eyebrow}>RENEWA PRO</ThemedText>
        </View>
        <ThemedText style={styles.heroTitle}>
          {isPro ? "You're Pro. Thank you!" : "Track everything. Share costs."}
        </ThemedText>
        <ThemedText style={styles.heroSub}>
          {isPro
            ? "Every Pro feature is unlocked on this phone."
            : "One payment, yours forever."}
        </ThemedText>
      </LinearGradient>

      {!isPro && reason && REASONS[reason] && (
        <View style={styles.reason}>
          <Ionicons name="lock-closed" size={14} color={theme.amberText} />
          <ThemedText style={styles.reasonText}>{REASONS[reason]}</ThemedText>
        </View>
      )}

      <View style={styles.features}>
        {PRO_FEATURES.map((f) => (
          <View key={f.title} style={styles.featureRow}>
            <View style={styles.featureIcon}>
              <Ionicons name={f.icon} size={18} color={theme.accentText} />
            </View>
            <View style={{ flex: 1 }}>
              <ThemedText style={styles.featureTitle}>{f.title}</ThemedText>
              <ThemedText style={styles.featureBody}>{f.body}</ThemedText>
            </View>
            {isPro && (
              <Ionicons name="checkmark-circle" size={20} color={theme.greenText} />
            )}
          </View>
        ))}
      </View>

      {!isPro && (
        <>
          <View style={styles.priceRow}>
            <ThemedText style={styles.price}>{PRO_PRICE_LABEL}</ThemedText>
            <ThemedText style={styles.priceNote}>one-time · not a subscription</ThemedText>
          </View>

          <Pressable
            style={[styles.buyButton, busy && styles.buttonBusy]}
            onPress={() => run(buy)}
            disabled={busy}
          >
            <Ionicons name="star" size={16} color={theme.onAccent} />
            <ThemedText style={styles.buyText}>
              Unlock Pro for {PRO_PRICE_LABEL}
            </ThemedText>
          </Pressable>
        </>
      )}

      {/* Apple requires a way to restore a past purchase */}
      <Pressable
        style={styles.restore}
        onPress={() => run(restore)}
        disabled={busy}
        hitSlop={8}
      >
        <ThemedText style={styles.restoreText}>Restore Purchases</ThemedText>
      </Pressable>

      <ThemedText style={styles.finePrint}>
        Paid once through your Apple ID. No account or sign-in, and your data
        stays on this phone.
      </ThemedText>
    </ScrollView>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: c.background },
    content: { padding: 20, paddingBottom: 48 },
    closeButton: {
      alignSelf: "flex-end",
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: c.surfaceMuted,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 12,
    },
    hero: {
      borderRadius: 28,
      padding: 24,
      alignItems: "center",
      overflow: "hidden",
    },
    heroMark: { width: 96, height: 96 },
    eyebrowPill: {
      marginTop: 8,
      backgroundColor: "rgba(255,255,255,0.16)",
      borderRadius: 20,
      paddingHorizontal: 10,
      paddingVertical: 4,
    },
    eyebrow: {
      fontSize: 11,
      fontWeight: "800",
      letterSpacing: 1,
      color: "#FFFFFF",
    },
    heroTitle: {
      marginTop: 12,
      fontSize: 24,
      lineHeight: 30,
      fontWeight: "800",
      color: "#FFFFFF",
      textAlign: "center",
    },
    heroSub: {
      marginTop: 4,
      fontSize: 14,
      color: "rgba(255,255,255,0.8)",
      textAlign: "center",
    },
    reason: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginTop: 16,
      padding: 12,
      borderRadius: 14,
      borderWidth: 1,
      backgroundColor: c.amberSoft,
      borderColor: c.amberBorder,
    },
    reasonText: { flex: 1, fontSize: 13, fontWeight: "600", color: c.amberText },
    features: {
      marginTop: 16,
      backgroundColor: c.surface,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: c.cardBorder,
      padding: 8,
    },
    featureRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      padding: 12,
    },
    featureIcon: {
      width: 38,
      height: 38,
      borderRadius: 19,
      backgroundColor: c.accentSoft,
      alignItems: "center",
      justifyContent: "center",
    },
    featureTitle: { fontSize: 15, fontWeight: "700", color: c.text },
    featureBody: { fontSize: 13, color: c.textSecondary, marginTop: 1 },
    priceRow: { alignItems: "center", marginTop: 24 },
    price: { fontSize: 36, lineHeight: 42, fontWeight: "800", color: c.text },
    priceNote: { fontSize: 13, color: c.textTertiary },
    buyButton: {
      marginTop: 16,
      height: 56,
      borderRadius: 28,
      backgroundColor: c.accent,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
    },
    buttonBusy: { opacity: 0.6 },
    buyText: { color: c.onAccent, fontSize: 16, fontWeight: "700" },
    restore: { alignSelf: "center", marginTop: 16 },
    restoreText: { fontSize: 14, fontWeight: "600", color: c.accentText },
    finePrint: {
      marginTop: 16,
      fontSize: 12,
      lineHeight: 17,
      color: c.textTertiary,
      textAlign: "center",
    },
  });
