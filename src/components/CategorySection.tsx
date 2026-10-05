import { ThemedText } from "@/components/themed-text";
import { CATEGORIES } from "@/constants/categories";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, View } from "react-native";

const ACCENT = "#5B21B6";

export function CategorySection({
  value,
  onChange,
}: {
  value: string;
  onChange: (category: string) => void;
}) {
  return (
    <View style={styles.wrapper}>
      <ThemedText style={styles.labelText}>CATEGORY</ThemedText>

      <View style={styles.grid}>
        {CATEGORIES.map((cat) => {
          const selected = value === cat.name;
          return (
            <Pressable
              key={cat.name}
              style={[styles.chip, selected && styles.chipSelected]}
              onPress={() => onChange(cat.name)}
            >
              <Ionicons
                name={cat.icon as any}
                size={14}
                color={selected ? "#FFFFFF" : "#6B7280"}
              />
              <ThemedText
                style={[styles.chipText, selected && styles.chipTextSelected]}
              >
                {cat.name}
              </ThemedText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: 10 },
  labelText: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
    color: "#9CA3AF",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: "#F3F4F6",
  },
  chipSelected: {
    backgroundColor: ACCENT,
  },
  chipText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6B7280",
  },
  chipTextSelected: {
    color: "#FFFFFF",
  },
});
