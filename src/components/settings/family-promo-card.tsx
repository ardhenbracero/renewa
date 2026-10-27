import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";

import { InitialsAvatar } from "@/components/InitialsAvatar";
import { ThemedText } from "@/components/themed-text";
import type { ThemeColors } from "@/constants/palette";
import { PRO_ENABLED } from "@/constants/pro";
import { usePro } from "@/context/pro-context";
import { useTheme } from "@/hooks/use-theme";
import { useThemedStyles } from "@/hooks/use-themed-styles";

// Sample people for the illustration only
const EXAMPLE_MEMBERS = ["You", "Mia", "Ken"];

// Pro feature teaser in Settings; hidden once Pro is unlocked
export function FamilyPromoCard() {
  const styles = useThemedStyles(makeStyles);
  const theme = useTheme();
  const router = useRouter();
  const { isPro } = usePro();

  if (!PRO_ENABLED || isPro) return null;

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.pill}>
          <ThemedText style={styles.pillText}>PRO FEATURE</ThemedText>
        </View>
        <View style={styles.iconBadge}>
          <Ionicons name="people-outline" size={18} color={theme.accentText} />
        </View>
      </View>

      <ThemedText style={styles.title}>Share subscriptions. Split costs.</ThemedText>
      <ThemedText style={styles.body}>
        Split a Netflix, Spotify or iCloud family plan and keep track of who
        has paid you their share.
      </ThemedText>

      <View style={styles.example}>
        <View style={styles.avatars}>
          {EXAMPLE_MEMBERS.map((name, i) => (
            <View key={name} style={[styles.avatarRing, i > 0 && styles.overlap]}>
              <InitialsAvatar name={name} size={28} />
            </View>
          ))}
        </View>
        <ThemedText style={styles.exampleText}>e.g. 3 people splitting</ThemedText>
      </View>

      <Pressable
        style={styles.button}
        onPress={() => router.push("/pro?reason=family")}
      >
        <ThemedText style={styles.buttonText}>Unlock Family Sharing</ThemedText>
      </Pressable>
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
    topRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    pill: {
      backgroundColor: c.accentSoft,
      borderRadius: 20,
      paddingHorizontal: 10,
      paddingVertical: 4,
    },
    pillText: {
      fontSize: 10,
      fontWeight: "800",
      letterSpacing: 0.6,
      color: c.accentText,
    },
    iconBadge: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: c.accentSoft,
      alignItems: "center",
      justifyContent: "center",
    },
    title: {
      marginTop: 12,
      fontSize: 18,
      lineHeight: 24,
      fontWeight: "800",
      color: c.text,
    },
    body: { marginTop: 4, fontSize: 13, lineHeight: 19, color: c.textSecondary },
    example: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      marginTop: 14,
      padding: 10,
      borderRadius: 14,
      backgroundColor: c.surfaceMuted,
    },
    avatars: { flexDirection: "row" },
    avatarRing: {
      borderRadius: 16,
      borderWidth: 2,
      borderColor: c.surfaceMuted,
    },
    overlap: { marginLeft: -8 },
    exampleText: { fontSize: 13, color: c.textSecondary },
    button: {
      marginTop: 14,
      height: 46,
      borderRadius: 23,
      borderWidth: 1.5,
      borderColor: c.accent,
      alignItems: "center",
      justifyContent: "center",
    },
    buttonText: { fontSize: 14, fontWeight: "700", color: c.accentText },
  });
