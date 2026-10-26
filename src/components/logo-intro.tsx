import { LinearGradient } from "expo-linear-gradient";
import { useEffect } from "react";
import { Image, StyleSheet, useWindowDimensions } from "react-native";
import Animated, {
  Easing,
  useAnimatedProps,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import Svg, { Path, Polygon } from "react-native-svg";

// Launch animation: the Renewa mark draws itself on (like the Threads logo),
// the arrowhead pops in, it crossfades to the exact logo artwork, then zooms
// out to reveal the app underneath. Rendered once per launch from _layout.tsx.

// Centerline of the mark in the icon's 1024×1024 space, traced from
// icon-dark.png (stroke ≈ 90px). The final frame swaps to the real PNG, so
// small tracing differences never show in the finished logo.
const MARK_PATH =
  "M 434 826 C 345 705 262 590 266 450 C 270 300 360 198 475 198 C 570 198 630 255 627 330 C 625 400 600 450 575 490 C 545 532 470 548 430 507 C 395 472 405 407 456 391 C 520 373 590 392 633 441 L 722 521";
const PATH_LENGTH = 1810; // measured length of MARK_PATH, rounded up
const ARROW_POINTS = "781,438 812,604 645,590";
const ARROW_TIP = { x: 812, y: 604 }; // the arrowhead grows out from here
const STROKE = 90;

// Brand gradient, same as the app icon
const GRADIENT = ["#4338CA", "#5B21B6", "#3730A3"] as const;
const WHITE = "#FFFFFF";

// Timeline (ms)
const DRAW_START = 200;
const DRAW_MS = 1300;
const ARROW_START = 1350;
const SWAP_START = 1750; // traced line → exact artwork
const ZOOM_START = 2600;
const ZOOM_MS = 600;
export const LOGO_INTRO_MS = ZOOM_START + ZOOM_MS; // ~3.2s total

const AnimatedPath = Animated.createAnimatedComponent(Path);

export function LogoIntro({ onDone }: { onDone: () => void }) {
  const { width, height } = useWindowDimensions();
  const reduceMotion = useReducedMotion();
  const size = Math.min(width * 0.8, 340); // the 1024 canvas, drawn at this size

  const draw = useSharedValue(0); // 0 → 1 as the line draws on
  const arrow = useSharedValue(0); // arrowhead scale
  const swap = useSharedValue(0); // 0 = traced line, 1 = exact PNG
  const markScale = useSharedValue(1);
  const overlay = useSharedValue(1); // whole intro's opacity

  useEffect(() => {
    if (reduceMotion) {
      // No drawing or zooming: show the logo briefly, then fade
      draw.value = 1;
      arrow.value = 1;
      swap.value = 1;
      overlay.value = withDelay(700, withTiming(0, { duration: 300 }));
      const timer = setTimeout(onDone, 1000);
      return () => clearTimeout(timer);
    }

    draw.value = withDelay(
      DRAW_START,
      withTiming(1, { duration: DRAW_MS, easing: Easing.inOut(Easing.cubic) }),
    );
    arrow.value = withDelay(
      ARROW_START,
      withSequence(
        withTiming(1.08, { duration: 220, easing: Easing.out(Easing.back(2)) }),
        withTiming(1, { duration: 160 }),
      ),
    );
    swap.value = withDelay(SWAP_START, withTiming(1, { duration: 300 }));
    markScale.value = withSequence(
      // subtle settle once the mark is complete
      withDelay(SWAP_START, withTiming(1.03, { duration: 200 })),
      withTiming(1, { duration: 200 }),
      // zoom out toward the viewer to reveal the app
      withDelay(
        ZOOM_START - SWAP_START - 400,
        withTiming(7, { duration: ZOOM_MS, easing: Easing.in(Easing.cubic) }),
      ),
    );
    overlay.value = withDelay(
      ZOOM_START + 150,
      withTiming(0, { duration: ZOOM_MS - 150 }),
    );

    const timer = setTimeout(onDone, LOGO_INTRO_MS);
    return () => clearTimeout(timer);
    // Runs once on mount; onDone just unmounts the intro
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const lineProps = useAnimatedProps(() => ({
    strokeDashoffset: PATH_LENGTH * (1 - draw.value),
  }));
  const tracedStyle = useAnimatedStyle(() => ({ opacity: 1 - swap.value }));
  const exactStyle = useAnimatedStyle(() => ({ opacity: swap.value }));
  const arrowStyle = useAnimatedStyle(() => ({
    transform: [{ scale: arrow.value }],
  }));
  const markStyle = useAnimatedStyle(() => ({
    transform: [{ scale: markScale.value }],
  }));
  const overlayStyle = useAnimatedStyle(() => ({ opacity: overlay.value }));

  const canvas = { width: size, height: size };

  return (
    <Animated.View style={[StyleSheet.absoluteFill, overlayStyle]}>
      <LinearGradient
        colors={GRADIENT}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[StyleSheet.absoluteFill, styles.center, { width, height }]}
      >
        <Animated.View style={[canvas, markStyle]}>
          {/* Traced line + arrowhead, drawn on */}
          <Animated.View style={[StyleSheet.absoluteFill, tracedStyle]}>
            <Svg width={size} height={size} viewBox="0 0 1024 1024">
              <AnimatedPath
                d={MARK_PATH}
                stroke={WHITE}
                strokeWidth={STROKE}
                strokeLinecap="butt"
                strokeLinejoin="round"
                fill="none"
                strokeDasharray={`${PATH_LENGTH} ${PATH_LENGTH}`}
                animatedProps={lineProps}
              />
            </Svg>
            <Animated.View
              style={[
                StyleSheet.absoluteFill,
                {
                  transformOrigin: [
                    (ARROW_TIP.x / 1024) * size,
                    (ARROW_TIP.y / 1024) * size,
                    0,
                  ],
                },
                arrowStyle,
              ]}
            >
              <Svg width={size} height={size} viewBox="0 0 1024 1024">
                {/* thin round stroke softens the corners like the artwork */}
                <Polygon
                  points={ARROW_POINTS}
                  fill={WHITE}
                  stroke={WHITE}
                  strokeWidth={16}
                  strokeLinejoin="round"
                />
              </Svg>
            </Animated.View>
          </Animated.View>

          {/* The exact logo artwork, faded in at the end */}
          <Animated.View style={[StyleSheet.absoluteFill, exactStyle]}>
            <Image
              source={require("@/assets/images/icon-dark.png")}
              style={canvas}
              resizeMode="contain"
            />
          </Animated.View>
        </Animated.View>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: "center", justifyContent: "center" },
});
