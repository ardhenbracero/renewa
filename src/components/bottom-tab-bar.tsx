import { Ionicons } from "@expo/vector-icons";
import {
  GlassView,
  isGlassEffectAPIAvailable,
  isLiquidGlassAvailable,
} from "expo-glass-effect";
import { usePathname, useRouter } from "expo-router";
import { useEffect, useState, type ComponentProps, type ReactNode } from "react";
import {
  Pressable,
  StyleSheet,
  View,
  type LayoutChangeEvent,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import type { ThemeColors } from "@/constants/palette";
import { useAppTheme } from "@/context/theme-context";
import { useTheme } from "@/hooks/use-theme";
import { useThemedStyles } from "@/hooks/use-themed-styles";

type IconName = ComponentProps<typeof Ionicons>["name"];

const TABS: {
  href: "/" | "/timeline" | "/insights" | "/settings";
  label: string;
  icon: IconName;
  activeIcon: IconName;
}[] = [
  { href: "/", label: "Vault", icon: "home-outline", activeIcon: "home" },
  {
    href: "/timeline",
    label: "Timeline",
    icon: "calendar-outline",
    activeIcon: "calendar",
  },
  {
    href: "/insights",
    label: "Insights",
    icon: "stats-chart-outline",
    activeIcon: "stats-chart",
  },
  {
    href: "/settings",
    label: "Settings",
    icon: "settings-outline",
    activeIcon: "settings",
  },
];

const BAR_HEIGHT = 64;
const INDICATOR = 52;

// How long the active circle takes to slide to a new tab (ms).
// Lower = faster. Ease-out timing never overshoots, unlike a spring.
const SLIDE_DURATION = 220;

// Bottom padding tab screens need so their last item clears the floating bar
export const TAB_BAR_SPACE = 140;

// Liquid Glass needs iOS 26+; older iOS gets a solid themed pill instead
const glassAvailable = isLiquidGlassAvailable() && isGlassEffectAPIAvailable();

function GlassSurface({
  style,
  children,
}: {
  style: StyleProp<ViewStyle>;
  children: ReactNode;
}) {
  const styles = useThemedStyles(makeStyles);
  const { scheme } = useAppTheme();

  if (glassAvailable) {
    return (
      <GlassView
        style={style}
        glassEffectStyle="regular"
        colorScheme={scheme}
        isInteractive
      >
        {children}
      </GlassView>
    );
  }
  return <View style={[style, styles.fallback]}>{children}</View>;
}

// Rendered once in _layout.tsx (not per screen) so the indicator can slide
// between tabs. Hidden on any route that isn't one of the four tabs.
export function BottomTabBar() {
  const styles = useThemedStyles(makeStyles);
  const theme = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  const activeIndex = TABS.findIndex((t) => t.href === pathname);
  const [slotWidth, setSlotWidth] = useState(0);
  const x = useSharedValue(0);

  const offsetFor = (index: number, width: number) =>
    index * width + (width - INDICATOR) / 2;

  useEffect(() => {
    if (activeIndex < 0 || slotWidth === 0) return;
    x.value = withTiming(offsetFor(activeIndex, slotWidth), {
      duration: SLIDE_DURATION,
      easing: Easing.out(Easing.cubic),
    });
  }, [activeIndex, slotWidth, x]);

  function onRowLayout(e: LayoutChangeEvent) {
    const width = e.nativeEvent.layout.width / TABS.length;
    // First layout: place the indicator without animating
    if (slotWidth === 0 && activeIndex >= 0) {
      x.value = offsetFor(activeIndex, width);
    }
    setSlotWidth(width);
  }

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value }],
  }));

  if (activeIndex < 0) return null;

  return (
    <View
      pointerEvents="box-none"
      style={[styles.wrapper, { bottom: Math.max(insets.bottom - 8, 12) }]}
    >
      <GlassSurface style={styles.bar}>
        <View style={styles.row} onLayout={onRowLayout}>
          {slotWidth > 0 && (
            <Animated.View style={[styles.indicator, indicatorStyle]} />
          )}
          {TABS.map((tab, i) => {
            const active = i === activeIndex;
            return (
              <Pressable
                key={tab.href}
                style={styles.tab}
                onPress={() => !active && router.replace(tab.href)}
                accessibilityRole="tab"
                accessibilityLabel={tab.label}
                accessibilityState={{ selected: active }}
                hitSlop={4}
              >
                <Ionicons
                  name={active ? tab.activeIcon : tab.icon}
                  size={24}
                  color={active ? theme.onAccent : theme.textSecondary}
                />
              </Pressable>
            );
          })}
        </View>
      </GlassSurface>

      <Pressable
        onPress={() => router.push("/add-subscription")}
        accessibilityRole="button"
        accessibilityLabel="Add subscription"
      >
        <GlassSurface style={styles.addButton}>
          <Ionicons name="add" size={30} color={theme.text} />
        </GlassSurface>
      </Pressable>
    </View>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    wrapper: {
      position: "absolute",
      left: 16,
      right: 16,
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    bar: {
      flex: 1,
      height: BAR_HEIGHT,
      borderRadius: BAR_HEIGHT / 2,
      paddingHorizontal: 6,
    },
    row: { flex: 1, flexDirection: "row", alignItems: "center" },
    tab: {
      flex: 1,
      height: BAR_HEIGHT,
      alignItems: "center",
      justifyContent: "center",
    },
    indicator: {
      position: "absolute",
      left: 0,
      top: (BAR_HEIGHT - INDICATOR) / 2,
      width: INDICATOR,
      height: INDICATOR,
      borderRadius: INDICATOR / 2,
      backgroundColor: c.accent,
      shadowColor: c.accent,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.45,
      shadowRadius: 10,
    },
    addButton: {
      width: BAR_HEIGHT,
      height: BAR_HEIGHT,
      borderRadius: BAR_HEIGHT / 2,
      alignItems: "center",
      justifyContent: "center",
    },
    // Used when Liquid Glass isn't available (iOS < 26)
    fallback: {
      backgroundColor: c.surface,
      borderWidth: 1,
      borderColor: c.border,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.12,
      shadowRadius: 16,
      elevation: 6,
    },
  });
