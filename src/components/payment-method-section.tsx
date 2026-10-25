import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import type { ThemeColors } from "@/constants/palette";
import { PAYMENT_METHODS } from "@/constants/payment-methods";
import { useTheme } from "@/hooks/use-theme";
import { useThemedStyles } from "@/hooks/use-themed-styles";
import type { PaymentMethod } from "@db/schema";

export function PaymentMethodSection({
  value,
  onChange,
}: {
  value: PaymentMethod | null;
  onChange: (method: PaymentMethod) => void;
}) {
  const styles = useThemedStyles(makeStyles);
  const theme = useTheme();

  return (
    <View style={styles.wrapper}>
      <View style={styles.headerRow}>
        <View style={styles.badge}>
          <Ionicons name="card-outline" size={14} color={theme.accentText} />
        </View>
        <ThemedText style={styles.labelText}>PAID FROM</ThemedText>
        <ThemedText style={styles.caption}>Payment source</ThemedText>
      </View>

      <View style={styles.track}>
        {PAYMENT_METHODS.map((m) => {
          const selected = value === m.value;
          return (
            <Pressable
              key={m.value}
              style={[styles.segment, selected && styles.segmentSelected]}
              onPress={() => onChange(m.value)}
              accessibilityRole="button"
              accessibilityState={{ selected }}
            >
              <Ionicons
                name={m.icon}
                size={16}
                color={selected ? theme.onAccent : theme.textSecondary}
              />
              <ThemedText
                style={[
                  styles.segmentText,
                  selected && styles.segmentTextSelected,
                ]}
              >
                {m.label}
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
    wrapper: { gap: 12 },
    headerRow: { flexDirection: "row", alignItems: "center", gap: 8 },
    badge: {
      width: 24,
      height: 24,
      borderRadius: 7,
      backgroundColor: c.accentSoft,
      alignItems: "center",
      justifyContent: "center",
    },
    labelText: {
      flex: 1,
      fontSize: 11,
      fontWeight: "700",
      letterSpacing: 0.5,
      color: c.textTertiary,
    },
    caption: { fontSize: 12, color: c.textTertiary },
    track: {
      flexDirection: "row",
      backgroundColor: c.surfaceWarm,
      borderRadius: 16,
      padding: 4,
      gap: 4,
    },
    segment: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      paddingVertical: 10,
      borderRadius: 12,
    },
    segmentSelected: {
      backgroundColor: c.accent,
      shadowColor: c.accent,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 6,
      elevation: 3,
    },
    segmentText: { fontSize: 14, fontWeight: "600", color: c.textSecondary },
    segmentTextSelected: { color: c.onAccent },
  });
