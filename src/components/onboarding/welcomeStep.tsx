import { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { OnboardingHero } from "./onboarding-hero";

const ACCENT = "#4338CA";

function FeatureCard({
  icon,
  title,
  subtitle,
}: {
  icon: ComponentProps<typeof Ionicons>["name"];
  title: string;
  subtitle: string;
}) {
  return (
    <View style={styles.feature}>
      <View style={styles.featureIcon}>
        <Ionicons name={icon} size={16} color={ACCENT} />
      </View>
      <View style={{ flex: 1 }}>
        <ThemedText style={styles.featureTitle}>{title}</ThemedText>
        <ThemedText style={styles.featureSub}>{subtitle}</ThemedText>
      </View>
    </View>
  );
}

export function WelcomeStep() {
  return (
    <ScrollView
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <OnboardingHero />

      <View style={styles.eyebrowRow}>
        <View style={styles.eyebrowBar} />
        <ThemedText style={styles.eyebrow}>WELCOME TO RENEWA</ThemedText>
      </View>

      <ThemedText style={styles.headline}>
        Never get surprised by a renewal again.
      </ThemedText>
      <ThemedText style={styles.body}>
        Keep every subscription in one place, see what's due next, and know your
        monthly total at a glance. Everything stays on your phone without
        connecting to your any bank account.
      </ThemedText>

      <View style={styles.featureRow}>
        <FeatureCard
          icon="notifications-outline"
          title="Timely Pings"
          subtitle="Alerts before billing"
        />
        <FeatureCard
          icon="stats-chart-outline"
          title="Burn Forecast"
          subtitle="Yearly & monthly tally"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 16 },
  eyebrowRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 22,
  },
  eyebrowBar: {
    width: 6,
    height: 14,
    borderRadius: 3,
    backgroundColor: ACCENT,
  },
  eyebrow: { fontSize: 11, fontWeight: "800", letterSpacing: 1, color: ACCENT },
  headline: {
    fontSize: 30,
    fontWeight: "800",
    lineHeight: 36,
    letterSpacing: -0.5,
    color: "#111827",
    marginTop: 10,
  },
  body: { fontSize: 15, lineHeight: 22, color: "#4B5563", marginTop: 10 },
  featureRow: { flexDirection: "row", gap: 10, marginTop: 10 },
  feature: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#F3F1EC",
    borderRadius: 14,
    padding: 12,
  },
  featureIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
  },
  featureTitle: { fontSize: 13, fontWeight: "700", color: "#111827" },
  featureSub: { fontSize: 11, lineHeight: 15, color: "#6B7280", marginTop: 1 },
});
