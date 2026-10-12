import { Children, ReactNode, useEffect } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withTiming,
} from "react-native-reanimated";

export function FadeUpGroup({
  step = 90, // ms between each child
  initialDelay = 0,
  children,
}: {
  step?: number;
  initialDelay?: number;
  children: ReactNode;
}) {
  return (
    <>
      {Children.toArray(children).map((child, i) => (
        <FadeUp key={(child as any)?.key ?? i} delay={initialDelay + i * step}>
          {child}
        </FadeUp>
      ))}
    </>
  );
}

export function FadeUp({
  delay = 0,
  distance = 16,
  duration = 500,
  style,
  children,
}: {
  delay?: number; // ms to wait before starting
  distance?: number; // how far below it starts, in px
  duration?: number;
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
}) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      delay,
      withTiming(1, { duration, easing: Easing.out(Easing.cubic) }),
    );
  }, [progress, delay, duration]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ translateY: (1 - progress.value) * distance }],
  }));

  return (
    <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>
  );
}
