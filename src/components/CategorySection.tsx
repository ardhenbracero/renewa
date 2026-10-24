import { ThemedText } from "@/components/themed-text";
import { CATEGORIES } from "@/constants/categories";
import type { ThemeColors } from "@/constants/palette";
import { useTheme } from "@/hooks/use-theme";
import { useThemedStyles } from "@/hooks/use-themed-styles";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, View } from "react-native";

export function CategorySection({
  value,
  onChange,
}: {
  value: string;
  onChange: (category: string) => void;
}) {
  const styles = useThemedStyles(makeStyles);
  const theme = useTheme();

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
                color={selected ? theme.onAccent : theme.textSecondary}
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

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    wrapper: { gap: 10 },
    labelText: {
      fontSize: 11,
      fontWeight: "700",
      letterSpacing: 0.5,
      color: c.textTertiary,
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
      backgroundColor: c.surfaceMuted,
    },
    chipSelected: {
      backgroundColor: c.accent,
    },
    chipText: {
      fontSize: 13,
      fontWeight: "600",
      color: c.textSecondary,
    },
    chipTextSelected: {
      color: c.onAccent,
    },
  });
