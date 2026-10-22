import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import type { ThemeColors } from "@/constants/palette";
import { useTheme } from "@/hooks/use-theme";
import { useThemedStyles } from "@/hooks/use-themed-styles";
import { getInitials } from "@/utils/initials";

export function ProfileCard({
  name,
  subscriptionCount,
  onEditPress,
}: {
  name: string;
  subscriptionCount: number;
  onEditPress: () => void;
}) {
  const theme = useTheme();
  const styles = useThemedStyles(makeStyles);
  const initials = getInitials(name) || "?";
  const countLabel = `${subscriptionCount} ${
    subscriptionCount === 1 ? "subscription" : "subscriptions"
  } tracked`;

  return (
    <View style={styles.card}>
      <View style={styles.top}>
        <View style={styles.avatarRing}>
          <View style={styles.avatar}>
            <ThemedText style={styles.avatarText}>{initials}</ThemedText>
          </View>
        </View>

        <View style={{ flex: 1 }}>
          <View style={styles.nameRow}>
            <ThemedText
              style={[styles.name, !name && styles.namePlaceholder]}
              numberOfLines={1}
            >
              {name || "Add your name"}
            </ThemedText>
            <View style={styles.badge}>
              <ThemedText style={styles.badgeText}>Local only</ThemedText>
            </View>
          </View>
          <ThemedText style={styles.sub}>{countLabel}</ThemedText>
          <ThemedText style={styles.accentLine}>
            Data stays on this phone
          </ThemedText>
        </View>
      </View>

      <Pressable style={styles.row} onPress={onEditPress}>
        <View style={styles.rowIcon}>
          <Ionicons name="person-outline" size={18} color={theme.accentText} />
        </View>
        <ThemedText style={styles.rowLabel}>Personal Details</ThemedText>
        <Ionicons name="chevron-forward" size={18} color={theme.textTertiary} />
      </Pressable>
    </View>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    card: {
      backgroundColor: c.surface,
      borderRadius: 24,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: c.cardBorder,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: c.shadowOpacity,
      shadowRadius: 12,
      elevation: c.cardElevation,
      overflow: "hidden",
    },
    top: { flexDirection: "row", alignItems: "center", gap: 14, padding: 18 },
    avatarRing: {
      width: 64,
      height: 64,
      borderRadius: 32,
      borderWidth: 2,
      borderColor: c.accentSoft,
      alignItems: "center",
      justifyContent: "center",
    },
    avatar: {
      width: 52,
      height: 52,
      borderRadius: 26,
      backgroundColor: c.accent,
      alignItems: "center",
      justifyContent: "center",
    },
    avatarText: { fontSize: 18, fontWeight: "800", color: c.onAccent },
    nameRow: { flexDirection: "row", alignItems: "center", gap: 8 },
    name: { flexShrink: 1, fontSize: 18, fontWeight: "800", color: c.text },
    namePlaceholder: { color: c.textTertiary },
    badge: {
      backgroundColor: c.greenSoft,
      borderWidth: 1,
      borderColor: c.greenBorder,
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 8,
    },
    badgeText: { fontSize: 10, fontWeight: "700", color: c.greenText },
    sub: { fontSize: 13, color: c.textSecondary, marginTop: 3 },
    accentLine: { fontSize: 12, color: c.accentText, marginTop: 2 },

    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      padding: 16,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: c.divider,
    },
    rowIcon: {
      width: 34,
      height: 34,
      borderRadius: 17,
      backgroundColor: c.accentSoft,
      alignItems: "center",
      justifyContent: "center",
    },
    rowLabel: { flex: 1, fontSize: 15, fontWeight: "600", color: c.text },
  });
