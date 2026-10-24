import { StyleSheet, View } from "react-native";
import type { ThemeColors } from "@/constants/palette";
import { useThemedStyles } from "@/hooks/use-themed-styles";

export function OnboardingDots({
  total,
  active,
}: {
  total: number;
  active: number;
}) {
  const styles = useThemedStyles(makeStyles);
  return (
    <View style={styles.row}>
      {Array.from({ length: total }).map((_, i) => (
        <View key={i} style={[styles.dot, i === active && styles.dotActive]} />
      ))}
    </View>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    row: { flexDirection: "row", alignItems: "center", gap: 6 },
    dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: c.textTertiary },
    dotActive: { width: 28, backgroundColor: c.accent },
  });
