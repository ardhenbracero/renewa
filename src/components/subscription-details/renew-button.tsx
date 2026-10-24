import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import type { ThemeColors } from "@/constants/palette";
import { useTheme } from "@/hooks/use-theme";
import { useThemedStyles } from "@/hooks/use-themed-styles";

// Solid green fill for the "Renewed" state. No palette token fits: greenText
// is a light mint in dark mode and would be unreadable under white text.
const SUCCESS = "#059669";

export function RenewButton({
  nextDateLabel,
  renewed,
  onPress,
}: {
  nextDateLabel: string;
  renewed: boolean;
  onPress: () => void;
}) {
  const styles = useThemedStyles(makeStyles);
  const theme = useTheme();

  return (
    <View style={styles.wrapper}>
      <Pressable
        style={[styles.button, renewed && styles.buttonSuccess]}
        onPress={onPress}
        disabled={renewed}
      >
        <Ionicons
          name={renewed ? "checkmark-circle" : "refresh"}
          size={20}
          color={theme.onAccent}
        />
        <ThemedText style={styles.label}>
          {renewed ? "Renewed" : "Renew"}
        </ThemedText>
      </Pressable>

      <ThemedText style={styles.helper}>
        {renewed ? (
          "Next renewal updated"
        ) : (
          <>
            Moves next renewal to{" "}
            <ThemedText style={styles.helperDate}>{nextDateLabel}</ThemedText>
          </>
        )}
      </ThemedText>
    </View>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    wrapper: {
      marginTop: 20,
      marginHorizontal: 20,
      alignItems: "center",
      gap: 10,
    },
    button: {
      alignSelf: "stretch",
      height: 56,
      borderRadius: 28,
      backgroundColor: c.accent,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      shadowColor: c.accent,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 4,
    },
    buttonSuccess: { backgroundColor: SUCCESS, shadowColor: SUCCESS },
    label: { color: c.onAccent, fontSize: 16, fontWeight: "700" },
    helper: { fontSize: 13, color: c.textTertiary },
    helperDate: { fontSize: 13, fontWeight: "700", color: c.text },
  });
