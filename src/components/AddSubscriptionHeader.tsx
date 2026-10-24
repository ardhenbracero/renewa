import { ThemedText } from "@/components/themed-text";
import type { ThemeColors } from "@/constants/palette";
import { useTheme } from "@/hooks/use-theme";
import { useThemedStyles } from "@/hooks/use-themed-styles";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, View } from "react-native";

export function AddSubscriptionHeader({
  onClose,
  isEditing = false,
}: {
  onClose: () => void;
  isEditing?: boolean;
}) {
  const styles = useThemedStyles(makeStyles);
  const theme = useTheme();

  return (
    <View style={styles.row}>
      <View style={{ flex: 1 }}>
        <View style={styles.eyebrowPill}>
          <ThemedText style={styles.eyebrow}>
            {isEditing ? "EDIT RECURRING EXPENSE" : "NEW RECURRING EXPENSE"}
          </ThemedText>
        </View>
        <ThemedText style={styles.title}>
          {isEditing ? "Edit Subscription" : "Add Subscription"}
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          {isEditing
            ? "Update the price, date or details below"
            : "Keep renewals organized & budget safe offline"}
        </ThemedText>
      </View>

      <Pressable style={styles.closeButton} onPress={onClose}>
        <Ionicons name="close" size={18} color={theme.text} />
      </Pressable>
    </View>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    row: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      paddingTop: 16,
    },
    eyebrowPill: {
      backgroundColor: c.accentSoft,
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 30,
      alignSelf: "flex-start",
    },
    eyebrow: {
      fontSize: 12,
      fontWeight: "700",
      letterSpacing: 0.6,
      color: c.accentText,
      textTransform: "uppercase",
    },
    title: {
      fontSize: 28,
      fontWeight: "800",
      marginTop: 4,
      color: c.text,
      paddingTop: 15,
    },
    subtitle: {
      fontSize: 13,
      color: c.textSecondary,
    },
    closeButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: c.surfaceMuted,
      justifyContent: "center",
      alignItems: "center",
    },
  });
