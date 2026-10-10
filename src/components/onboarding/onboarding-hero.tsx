import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, View } from "react-native";

import { BrandIcon, getBrandHex } from "@/components/brand-icon";
import { ThemedText } from "@/components/themed-text";
import { useEffect } from "react";
import Animated, {
    cancelAnimation,
    Easing,
    Extrapolation,
    interpolate,
    SharedValue,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
} from "react-native-reanimated";

function Pop({
  progress,
  start,
  hideAt,
  rotate = "0deg",
  style,
  children,
}: {
  progress: SharedValue<number>;
  start: number; // fade in begins here
  hideAt: number; // fade out begins here
  rotate?: string; // resting tilt
  style?: any;
  children: React.ReactNode;
}) {
  const animatedStyle = useAnimatedStyle(() => {
    const p = progress.value;
    const opacity = interpolate(
      p,
      [start, start + 0.05, hideAt, hideAt + 0.06],
      [0, 1, 1, 0],
      Extrapolation.CLAMP,
    );
    const scale = interpolate(
      p,
      [start, start + 0.06, hideAt, hideAt + 0.06],
      [0.6, 1, 1, 0.92],
      Extrapolation.CLAMP,
    );
    const translateY = interpolate(
      p,
      [start, start + 0.06],
      [18, 0],
      Extrapolation.CLAMP,
    );
    return { opacity, transform: [{ translateY }, { scale }, { rotate }] };
  });

  return (
    <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>
  );
}

const LOOP_MS = 4000;

const HIDE_AT = 0.4; // small cards start fading out here, done by 0.46

// Netflix starts only after the small cards have settled
const NETFLIX_START = 0.48;
const NETFLIX_END = 0.88;

function easeInOut(t: number) {
  "worklet";
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

type SpinProps = {
  progress: SharedValue<number>;
  start: number; // where in the 0..1 loop this card begins moving
  end: number; // where it finishes
  kind: "full" | "return"; // full = one continuous turn, return = go to peak then back
  peak?: number; // degrees (360 for full, or the max angle for return)
  axis?: "z" | "y"; // z = spin flat, y = flip like a card
  baseDeg?: number; // the card's resting tilt
  style?: any;
  children: React.ReactNode;
};

function Spin({
  progress,
  start,
  end,
  kind,
  peak = 360,
  axis = "z",
  baseDeg = 0,
  style,
  children,
}: SpinProps) {
  const animatedStyle = useAnimatedStyle(() => {
    const raw = (progress.value - start) / (end - start);
    const t = Math.min(Math.max(raw, 0), 1);

    let angle = 0;
    if (kind === "full") {
      angle = peak * easeInOut(t);
    } else {
      const u = t < 0.5 ? t * 2 : (1 - t) * 2; // up, then back down
      angle = peak * easeInOut(u);
    }

    if (axis === "y") {
      return {
        transform: [
          { perspective: 700 },
          { rotate: `${baseDeg}deg` },
          { rotateY: `${angle}deg` },
        ],
      };
    }
    return { transform: [{ rotate: `${baseDeg + angle}deg` }] };
  });

  return (
    <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>
  );
}

const ACCENT = "#4338CA";

function Badge({ slug, size = 36 }: { slug: string; size?: number }) {
  return (
    <View
      style={[
        styles.badge,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: getBrandHex(slug) ?? "#111827",
        },
      ]}
    >
      <BrandIcon slug={slug} size={size * 0.52} color="white" />
    </View>
  );
}

export function OnboardingHero() {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration: LOOP_MS, easing: Easing.linear }),
      -1, // loop forever
      false, // jump back to 0 instead of reversing
    );
    return () => cancelAnimation(progress);
  }, [progress]);
  return (
    <LinearGradient
      colors={["#5B21B6", "#4338CA", "#3730A3"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.hero}
    >
      <View style={styles.topRow}>
        <View style={styles.glassPill}>
          <View style={styles.greenDot} />
          <ThemedText style={styles.glassText}>LOCAL VAULT ACTIVE</ThemedText>
        </View>
        <View style={styles.glassPill}>
          <Ionicons name="shield-checkmark" size={12} color="#FFFFFF" />
          <ThemedText style={styles.glassText}>100% Private</ThemedText>
        </View>
      </View>

      {/* iCloud */}
      <Pop
        progress={progress}
        start={0.04}
        hideAt={HIDE_AT}
        rotate="6deg"
        style={[styles.floatCard, styles.icloud]}
      >
        <Badge slug="icloud" size={30} />
        <View>
          <ThemedText style={styles.cardName}>iCloud+</ThemedText>
          <ThemedText style={styles.cardSub}>$0.99</ThemedText>
        </View>
      </Pop>

      {/* YouTube */}
      <Pop
        progress={progress}
        start={0.1}
        hideAt={HIDE_AT}
        rotate="-8deg"
        style={[styles.floatCard, styles.youtube]}
      >
        <BrandIcon slug="youtube" size={30} />
      </Pop>

      {/* Spotify 20 */}
      <Pop
        progress={progress}
        start={0.16}
        hideAt={HIDE_AT}
        rotate="-4deg"
        style={[styles.floatCard, styles.spotify]}
      >
        <Badge slug="spotify" size={30} />
        <View>
          <ThemedText style={styles.cardName}>Spotify</ThemedText>
          <ThemedText style={styles.cardSub}>$10.99/mo</ThemedText>
        </View>
      </Pop>

      {/* ChatGPT 30 */}
      <Pop
        progress={progress}
        start={0.22}
        hideAt={HIDE_AT}
        rotate="3deg"
        style={[styles.floatCard, styles.chatgpt]}
      >
        <Badge slug="openai" size={26} />
        <ThemedText style={styles.cardName}>$20.00</ThemedText>
      </Pop>

      {/* Netflix (top layer) 40 */}
      <Spin
        progress={progress}
        start={NETFLIX_START}
        end={NETFLIX_END}
        kind="return"
        peak={15}
        style={[styles.floatCard, styles.netflix]}
      >
        <View style={styles.netflixTop}>
          <Badge slug="netflix" size={44} />
          <View style={{ flex: 1 }}>
            <View style={styles.netflixTitleRow}>
              <ThemedText style={styles.netflixName}>Netflix</ThemedText>
              <View style={styles.duePill}>
                <View style={styles.amberDot} />
                <ThemedText style={styles.dueText}>Due in 3d</ThemedText>
              </View>
            </View>
            <ThemedText style={styles.netflixPrice}>
              $15.49 <ThemedText style={styles.netflixPer}>/ month</ThemedText>
            </ThemedText>
          </View>
        </View>
        <View style={styles.netflixBottom}>
          <ThemedText style={styles.cardSub}>Entertainment</ThemedText>
          <View style={styles.autoPayTag}>
            <ThemedText style={styles.autoPayText}>AUTO-PAY</ThemedText>
          </View>
        </View>
      </Spin>

      {/* Bottom summary */}
      <View style={styles.totalBlock}>
        <ThemedText style={styles.totalLabel}>SIMULATED TOTAL</ThemedText>
        <ThemedText style={styles.totalValue}>
          ₱487 <ThemedText style={styles.totalPer}>/ month</ThemedText>
        </ThemedText>
      </View>
      <View style={styles.rightBlock}>
        <ThemedText style={styles.rightTop}>5 active services</ThemedText>
        <ThemedText style={styles.rightBottom}>~₱1,049 / year</ThemedText>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  hero: { height: 340, borderRadius: 32, overflow: "hidden" },
  badge: { justifyContent: "center", alignItems: "center" },

  topRow: {
    position: "absolute",
    top: 16,
    left: 16,
    right: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  glassPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255,255,255,0.16)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
  },
  glassText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  greenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#34D399",
  },

  floatCard: {
    position: "absolute",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  cardName: { fontSize: 13, fontWeight: "700", color: "#111827" },
  cardSub: { fontSize: 11, color: "#6B7280" },

  youtube: {
    left: 16,
    top: 66,
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    transform: [{ rotate: "-8deg" }],
  },
  icloud: {
    right: 12,
    top: 58,
    width: 128,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 10,
    zIndex: 1,
    transform: [{ rotate: "6deg" }],
  },
  spotify: {
    left: 28,
    top: 192,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 10,
    paddingRight: 16,
    transform: [{ rotate: "-4deg" }],
  },
  chatgpt: {
    right: 28,
    bottom: 80,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 24,
    transform: [{ rotate: "3deg" }],
  },
  netflix: {
    left: 34,
    right: 26,
    top: 100,
    padding: 8,
    gap: 10,
    zIndex: 10,
    elevation: 8,
  },
  netflixTop: { flexDirection: "row", alignItems: "center", gap: 12 },
  netflixTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  netflixName: { fontSize: 20, fontWeight: "800", color: "#111827" },
  duePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  amberDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#F59E0B",
  },
  dueText: { fontSize: 10, fontWeight: "700", color: "#B45309" },
  netflixPrice: { fontSize: 18, fontWeight: "800", color: ACCENT },
  netflixPer: { fontSize: 12, fontWeight: "500", color: "#6B7280" },
  netflixBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  autoPayTag: {
    backgroundColor: "#EEF2FF",
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  autoPayText: {
    fontSize: 9,
    fontWeight: "800",
    color: ACCENT,
    letterSpacing: 0.5,
  },

  totalBlock: { position: "absolute", left: 20, bottom: 10 },
  totalLabel: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.8,
    color: "rgba(255,255,255,0.7)",
  },
  totalValue: {
    fontSize: 24,
    fontWeight: "800",
    color: "#FFFFFF",
    paddingBottom: 8,
  },
  totalPer: { fontSize: 14, fontWeight: "500", color: "rgba(255,255,255,0.7)" },
  rightBlock: {
    position: "absolute",
    right: 20,
    bottom: 18,
    alignItems: "flex-end",
  },
  rightTop: { fontSize: 12, color: "rgba(255,255,255,0.8)" },
  rightBottom: { fontSize: 12, fontWeight: "700", color: "#FCD34D" },
});
