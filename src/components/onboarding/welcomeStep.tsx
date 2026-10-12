import { Ionicons } from "@expo/vector-icons";
import { ReactNode, useEffect } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { ThemedText } from "@/components/themed-text";
import { OnboardingHero } from "./onboarding-hero";

const ACCENT = "#4338CA";

function AnimatedBell() {
  const angle = useSharedValue(0);

  useEffect(() => {
    angle.value = withRepeat(
      withSequence(
        withTiming(18, { duration: 90 }),
        withTiming(-18, { duration: 180 }),
        withTiming(14, { duration: 160 }),
        withTiming(-14, { duration: 160 }),
        withTiming(8, { duration: 120 }),
        withTiming(-8, { duration: 120 }),
        withTiming(0, { duration: 100 }),
        withTiming(0, { duration: 1800 }), // rest before the next ring
      ),
      -1,
      false,
    );
  }, [angle]);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateY: -8 },
      { rotate: `${angle.value}deg` },
      { translateY: 8 },
    ],
  }));

  return (
    <Animated.View style={style}>
      <Ionicons name="notifications-outline" size={16} color={ACCENT} />
    </Animated.View>
  );
}

function Bar({ target, delay }: { target: number; delay: number }) {
  const height = useSharedValue(3);

  useEffect(() => {
    height.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(target, { duration: 600 }),
          withTiming(target, { duration: 1500 }), // hold
          withTiming(3, { duration: 400 }),
          withTiming(3, { duration: 500 }), // rest
        ),
        -1,
        false,
      ),
    );
  }, [height, target, delay]);

  const style = useAnimatedStyle(() => ({ height: height.value }));

  return <Animated.View style={[styles.bar, style]} />;
}

function AnimatedBars() {
  return (
    <View style={styles.bars}>
      <Bar target={7} delay={0} />
      <Bar target={11} delay={150} />
      <Bar target={16} delay={300} />
    </View>
  );
}
function FeatureCard({
  icon,
  title,
  subtitle,
}: {
  icon: ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <View style={styles.feature}>
      <View style={styles.featureIcon}>{icon}</View>
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
        Keep every subscription in one place. Track renewals and monthly costs,
        all on your phone. No bank connections needed.
      </ThemedText>

      <View style={styles.featureRow}>
        <FeatureCard
          icon={<AnimatedBell />}
          title="Timely Pings"
          subtitle="Alerts before billing"
        />
        <FeatureCard
          icon={<AnimatedBars />}
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

  bars: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 2.5,
    height: 16,
  },
  bar: {
    width: 3.5,
    borderRadius: 2,
    backgroundColor: ACCENT,
  },
});
