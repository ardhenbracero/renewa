import { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import type { ThemeColors } from "@/constants/palette";
import { ThemePreference, useAppTheme } from "@/context/theme-context";
import { useTheme } from "@/hooks/use-theme";
import { useThemedStyles } from "@/hooks/use-themed-styles";

type IconName = ComponentProps<typeof Ionicons>["name"];

const OPTIONS: { value: ThemePreference; label: string; icon: IconName }[] = [
  { value: "light", label: "Light", icon: "sunny-outline" },
  { value: "dark", label: "Dark", icon: "moon-outline" },
  { value: "system", label: "Auto", icon: "desktop-outline" },
];

export function AppearanceCard() {
  const theme = useTheme();
  const styles = useThemedStyles(makeStyles);
  const { preference, setPreference } = useAppTheme();

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.iconBadge}>
          <Ionicons
            name="color-palette-outline"
            size={18}
            color={theme.accentText}
          />
        </View>
        <View>
          <ThemedText style={styles.title}>Appearance</ThemedText>
          <ThemedText style={styles.sub}>Choose how Renewa looks</ThemedText>
        </View>
      </View>

      <View style={styles.track}>
        {OPTIONS.map((o) => {
          const active = preference === o.value;
          return (
            <Pressable
              key={o.value}
              style={[styles.segment, active && styles.segmentActive]}
              onPress={() => setPreference(o.value)}
            >
              <Ionicons
                name={o.icon}
                size={15}
                color={active ? theme.accentText : theme.textTertiary}
              />
              <ThemedText
                style={[styles.segmentText, active && styles.segmentTextActive]}
              >
                {o.label}
              </ThemedText>
            </Pressable>
          );
        })}
      </View>

      <ThemedText style={styles.hint}>
        Auto follows your phone's appearance setting.
      </ThemedText>
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
    track: {
      flexDirection: "row",
      backgroundColor: c.surfaceMuted,
      borderRadius: 16,
      padding: 4,
      gap: 4,
      marginTop: 16,
    },
    segment: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      paddingVertical: 11,
      borderRadius: 12,
    },
    segmentActive: {
      backgroundColor: c.surface,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: c.shadowOpacity,
      shadowRadius: 6,
      elevation: c.cardElevation,
    },
    segmentText: { fontSize: 14, fontWeight: "600", color: c.textTertiary },
    segmentTextActive: { color: c.accentText },
    hint: { fontSize: 12, color: c.textTertiary, marginTop: 12 },
  });
