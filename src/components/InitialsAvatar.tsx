import { StyleSheet, Text, View } from "react-native";

const PALETTE = [
  "#EF4444",
  "#F97316",
  "#F59E0B",
  "#84CC16",
  "#10B981",
  "#06B6D4",
  "#3B82F6",
  "#8B5CF6",
  "#D946EF",
  "#EC4899",
];

function colorForName(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return PALETTE[Math.abs(hash) % PALETTE.length];
}

export function InitialsAvatar({
  name,
  size = 32,
}: {
  name: string;
  size?: number;
}) {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

  return (
    <View
      style={[
        styles.circle,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: colorForName(name),
        },
      ]}
    >
      <Text style={{ color: "white", fontSize: size * 0.4, fontWeight: "600" }}>
        {initials || "?"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: { justifyContent: "center", alignItems: "center" },
});
