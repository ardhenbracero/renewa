import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import type { ThemeColors } from "@/constants/palette";
import { ThemePreference, useAppTheme } from "@/context/theme-context";
import { useTheme } from "@/hooks/use-theme";
import { useThemedStyles } from "@/hooks/use-themed-styles";

const OPTIONS: { value: ThemePreference; label: string }[] = [
  { value: "system", label: "System" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
];

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    header: {
      height: 48,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
    },
    headerBtn: { width: 40, height: 40, justifyContent: "center" },
    headerTitle: { fontSize: 17, fontWeight: "700", color: c.text },
    section: { marginTop: 20, marginHorizontal: 20 },
    label: {
      fontSize: 11,
      fontWeight: "700",
      letterSpacing: 0.5,
      color: c.textTertiary,
    },
    track: {
      flexDirection: "row",
      backgroundColor: c.surfaceMuted,
      borderRadius: 14,
      padding: 4,
      gap: 4,
      marginTop: 10,
    },
    segment: {
      flex: 1,
      paddingVertical: 10,
      borderRadius: 11,
      alignItems: "center",
    },
    segmentActive: { backgroundColor: c.accent },
    segmentText: { fontSize: 14, fontWeight: "600", color: c.textSecondary },
    segmentTextActive: { color: c.onAccent },
    hint: { fontSize: 12, color: c.textTertiary, marginTop: 10 },
  });

export default function SettingsScreen() {
  const router = useRouter();
  const theme = useTheme();
  const styles = useThemedStyles(makeStyles);
  const { preference, setPreference } = useAppTheme();

  return (
    <ThemedView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <View style={styles.header}>
          <Pressable
            style={styles.headerBtn}
            onPress={() => router.back()}
            hitSlop={8}
          >
            <Ionicons name="chevron-back" size={24} color={theme.text} />
          </Pressable>
          <ThemedText style={styles.headerTitle}>Settings</ThemedText>
          <View style={styles.headerBtn} />
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.label}>APPEARANCE</ThemedText>
          <View style={styles.track}>
            {OPTIONS.map((o) => {
              const active = preference === o.value;
              return (
                <Pressable
                  key={o.value}
                  style={[styles.segment, active && styles.segmentActive]}
                  onPress={() => setPreference(o.value)}
                >
                  <ThemedText
                    style={[
                      styles.segmentText,
                      active && styles.segmentTextActive,
                    ]}
                  >
                    {o.label}
                  </ThemedText>
                </Pressable>
              );
            })}
          </View>
          <ThemedText style={styles.hint}>
            System follows your phone's appearance setting.
          </ThemedText>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}
