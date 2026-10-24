import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Linking, Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ToggleRow } from "@/components/ToggleRow";
import type { ThemeColors } from "@/constants/palette";
import { useTheme } from "@/hooks/use-theme";
import { useThemedStyles } from "@/hooks/use-themed-styles";
import {
  getReminderPermission,
  getRemindersEnabled,
  setRemindersEnabled,
  type ReminderPermission,
} from "@/utils/notifications";

export function NotificationsCard() {
  const styles = useThemedStyles(makeStyles);
  const theme = useTheme();
  const [enabled, setEnabled] = useState(true);
  const [permission, setPermission] =
    useState<ReminderPermission>("undetermined");

  const load = useCallback(() => {
    getRemindersEnabled().then(setEnabled);
    getReminderPermission().then(setPermission);
  }, []);

  // Re-check on focus: the user may have changed it in iOS Settings
  useFocusEffect(load);

  async function toggle(value: boolean) {
    setEnabled(value);
    await setRemindersEnabled(value); // may show the iOS permission prompt
    setPermission(await getReminderPermission());
  }

  const blocked = enabled && permission === "denied";

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.iconBadge}>
          <Ionicons
            name="notifications-outline"
            size={18}
            color={theme.accentText}
          />
        </View>
        <View>
          <ThemedText style={styles.title}>Notifications</ThemedText>
          <ThemedText style={styles.sub}>Get a heads-up before you pay</ThemedText>
        </View>
      </View>

      <View style={styles.toggleWrap}>
        <ToggleRow
          icon="alarm-outline"
          label="Renewal reminders"
          subtitle="9:00 AM, the day before each renewal"
          value={enabled}
          onValueChange={toggle}
        />
      </View>

      {blocked ? (
        <View style={styles.warning}>
          <ThemedText style={styles.warningText}>
            Notifications are turned off for Renewa in iOS Settings.
          </ThemedText>
          <Pressable onPress={() => Linking.openSettings()} hitSlop={8}>
            <ThemedText style={styles.warningLink}>Open Settings</ThemedText>
          </Pressable>
        </View>
      ) : (
        <ThemedText style={styles.hint}>
          Reminders are scheduled on your phone. Nothing is sent anywhere.
        </ThemedText>
      )}
    </View>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    card: {
      backgroundColor: c.surface,
      borderRadius: 24,
      padding: 18,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: c.cardBorder,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: c.shadowOpacity,
      shadowRadius: 12,
      elevation: c.cardElevation,
    },
    headerRow: { flexDirection: "row", alignItems: "center", gap: 12 },
    iconBadge: {
      width: 38,
      height: 38,
      borderRadius: 19,
      backgroundColor: c.accentSoft,
      alignItems: "center",
      justifyContent: "center",
    },
    title: { fontSize: 16, fontWeight: "800", color: c.text },
    sub: { fontSize: 12, color: c.textTertiary, marginTop: 1 },
    toggleWrap: {
      marginTop: 16,
      backgroundColor: c.surfaceMuted,
      borderRadius: 16,
      paddingHorizontal: 12,
      paddingVertical: 10,
    },
    hint: { fontSize: 12, color: c.textTertiary, marginTop: 12 },
    warning: {
      marginTop: 12,
      backgroundColor: c.amberSoft,
      borderColor: c.amberBorder,
      borderWidth: 1,
      borderRadius: 12,
      padding: 12,
      gap: 6,
    },
    warningText: { fontSize: 12, color: c.amberText },
    warningLink: { fontSize: 13, fontWeight: "700", color: c.amberText },
  });
