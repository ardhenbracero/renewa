import { StyleSheet, View } from "react-native";

const ACCENT = "#4338CA";

export function OnboardingDots({
  total,
  active,
}: {
  total: number;
  active: number;
}) {
  return (
    <View style={styles.row}>
      {Array.from({ length: total }).map((_, i) => (
        <View key={i} style={[styles.dot, i === active && styles.dotActive]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#D1D5DB" },
  dotActive: { width: 28, backgroundColor: ACCENT },
});
