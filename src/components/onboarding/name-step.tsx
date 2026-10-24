import { FadeUpGroup } from "@/components/fade-up";
import { ThemedText } from "@/components/themed-text";
import type { ThemeColors } from "@/constants/palette";
import { useAppTheme } from "@/context/theme-context";
import { useTheme } from "@/hooks/use-theme";
import { useThemedStyles } from "@/hooks/use-themed-styles";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, TextInput, View } from "react-native";

function getInitials(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

export function NameStep({
  name,
  onChangeName,
  onSubmit,
}: {
  name: string;
  onChangeName: (value: string) => void;
  onSubmit: () => void;
}) {
  const styles = useThemedStyles(makeStyles);
  const theme = useTheme();
  const { scheme } = useAppTheme();
  const initials = getInitials(name) || "?";

  return (
    <View>
      <FadeUpGroup step={100}>
        <ThemedText style={styles.headline}>
          What should we call you?
        </ThemedText>

        <ThemedText style={styles.sub}>
          Just for a friendly greeting. Never synced or shared.
        </ThemedText>

        <View style={styles.inputCard}>
          <View style={styles.inputTop}>
            <ThemedText style={styles.label}>YOUR FIRST NAME</ThemedText>
            <View style={styles.initialsBadge}>
              <ThemedText style={styles.initialsText}>{initials}</ThemedText>
            </View>
          </View>

          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={onChangeName}
              placeholder="Your first name"
              placeholderTextColor={theme.textTertiary}
              keyboardAppearance={scheme}
              autoFocus
              autoCapitalize="words"
              autoCorrect={false}
              maxLength={30}
              returnKeyType="done"
              onSubmitEditing={onSubmit}
            />
            {name.length > 0 && (
              <Pressable
                style={styles.clear}
                onPress={() => onChangeName("")}
                hitSlop={8}
              >
                <Ionicons name="close" size={14} color={theme.textSecondary} />
              </Pressable>
            )}
          </View>
        </View>

        <View style={styles.previewLabelRow}>
          <Ionicons name="eye-outline" size={14} color={theme.accentText} />
          <ThemedText style={styles.previewLabel}>HOME PREVIEW</ThemedText>
        </View>

        <View style={styles.previewCard}>
          <View style={{ flex: 1 }}>
            <ThemedText style={styles.previewHi}>
              Hi, {name.trim() || "there"}
            </ThemedText>
            <ThemedText style={styles.previewSub}>
              Here's what's coming up
            </ThemedText>
          </View>
          <View style={styles.initialsBadge}>
            <ThemedText style={styles.initialsText}>{initials}</ThemedText>
          </View>
        </View>
      </FadeUpGroup>
    </View>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    headline: {
      fontSize: 30,
      fontWeight: "800",
      lineHeight: 36,
      letterSpacing: -0.5,
      color: c.text,
      marginTop: 20,
    },
    sub: { fontSize: 15, color: c.textSecondary, marginTop: 6 },
    inputCard: {
      marginTop: 24,
      backgroundColor: c.surface,
      borderRadius: 22,
      borderWidth: 1,
      borderColor: c.cardBorder,
      padding: 18,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: c.shadowOpacity,
      shadowRadius: 12,
      elevation: c.cardElevation,
    },
    inputTop: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    label: {
      fontSize: 11,
      fontWeight: "700",
      letterSpacing: 0.5,
      color: c.textTertiary,
    },
    initialsBadge: {
      width: 30,
      height: 30,
      borderRadius: 15,
      backgroundColor: c.accentSoft,
      justifyContent: "center",
      alignItems: "center",
    },
    initialsText: { fontSize: 11, fontWeight: "800", color: c.accentText },
    inputRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      marginTop: 8,
    },
    input: {
      flex: 1,
      fontSize: 26,
      fontWeight: "700",
      color: c.text,
      padding: 0,
    },
    clear: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: c.surfaceMuted,
      justifyContent: "center",
      alignItems: "center",
    },
    previewLabelRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      marginTop: 24,
    },
    previewLabel: {
      fontSize: 11,
      fontWeight: "700",
      letterSpacing: 0.5,
      color: c.textSecondary,
    },
    previewCard: {
      marginTop: 10,
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: c.surfaceWarm,
      borderRadius: 20,
      padding: 18,
    },
    previewHi: { fontSize: 20, fontWeight: "800", color: c.text },
    previewSub: { fontSize: 13, color: c.textSecondary, marginTop: 2 },
  });
