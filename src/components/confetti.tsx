import { useEffect, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  type SharedValue,
} from "react-native-reanimated";

// Celebration colors (brand violets plus accents). Like chart colors, these are
// fixed and read well on both light and dark backgrounds.
const COLORS = ["#5B21B6", "#7C3AED", "#4338CA", "#F59E0B", "#10B981", "#F472B6"];
const COUNT = 40;
const DURATION = 1400; // ms
const GRAVITY = 1100; // px/s², pulls pieces back down

export type ConfettiOrigin = { x: number; y: number };

type Piece = {
  vx: number;
  vy: number;
  spin: number;
  color: string;
  width: number;
  height: number;
};

function makePieces(): Piece[] {
  return Array.from({ length: COUNT }, (_, i) => {
    // Shoot upward in a ~110° fan, at random speeds
    const angle = ((-90 + (Math.random() * 2 - 1) * 55) * Math.PI) / 180;
    const speed = 380 + Math.random() * 340;
    const width = 6 + Math.random() * 4;
    return {
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      spin: (Math.random() * 2 - 1) * 720,
      color: COLORS[i % COLORS.length],
      width,
      height: width * (0.4 + Math.random() * 0.6),
    };
  });
}

function ConfettiPiece({
  piece,
  origin,
  progress,
}: {
  piece: Piece;
  origin: ConfettiOrigin;
  progress: SharedValue<number>;
}) {
  const style = useAnimatedStyle(() => {
    const t = (progress.value * DURATION) / 1000; // seconds since the burst
    return {
      // Fully visible for most of the flight, then fade out
      opacity: progress.value < 0.7 ? 1 : 1 - (progress.value - 0.7) / 0.3,
      transform: [
        { translateX: piece.vx * t },
        { translateY: piece.vy * t + 0.5 * GRAVITY * t * t },
        { rotate: `${piece.spin * t}deg` },
      ],
    };
  });

  return (
    <Animated.View
      style={[
        styles.piece,
        {
          left: origin.x - piece.width / 2,
          top: origin.y - piece.height / 2,
          width: piece.width,
          height: piece.height,
          backgroundColor: piece.color,
        },
        style,
      ]}
    />
  );
}

// One burst from `origin` (window coordinates). Render it with a new `key` to
// fire again; `onDone` runs when the animation ends so the parent can unmount it.
export function Confetti({
  origin,
  onDone,
}: {
  origin: ConfettiOrigin;
  onDone: () => void;
}) {
  const pieces = useMemo(makePieces, []);
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(1, { duration: DURATION, easing: Easing.linear });
    const timer = setTimeout(onDone, DURATION);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {pieces.map((piece, i) => (
        <ConfettiPiece
          key={i}
          piece={piece}
          origin={origin}
          progress={progress}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  piece: { position: "absolute", borderRadius: 2 },
});
