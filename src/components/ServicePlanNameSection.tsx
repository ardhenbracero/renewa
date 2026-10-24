import { BrandIcon, getBrandHex, hasBrandIcon } from "@/components/brand-icon";
import { InitialsAvatar } from "@/components/InitialsAvatar";
import { ThemedText } from "@/components/themed-text";
import type { ThemeColors } from "@/constants/palette";
import { useAppTheme } from "@/context/theme-context";
import { useTheme } from "@/hooks/use-theme";
import { useThemedStyles } from "@/hooks/use-themed-styles";
import { StyleSheet, TextInput, View } from "react-native";

export function ServicePlanNameSection({
  name,
  onChangeName,
  iconSlug,
}: {
  name: string;
  onChangeName: (value: string) => void;
  iconSlug: string | null;
}) {
  const styles = useThemedStyles(makeStyles);
  const theme = useTheme();
  const { scheme } = useAppTheme();
  const showBrandIcon = iconSlug && hasBrandIcon(iconSlug);
  const badgeColor = iconSlug ? getBrandHex(iconSlug) : null;

  return (
    <View style={styles.row}>
      <View style={styles.label}>
        <ThemedText style={styles.labelText}>SERVICE / PLAN NAME</ThemedText>
      </View>

      <View style={styles.inputRow}>
        <View
          style={[styles.badge, { backgroundColor: badgeColor ?? theme.border }]}
        >
          {showBrandIcon ? (
            <BrandIcon slug={iconSlug!} size={18} color="white" />
          ) : (
            <InitialsAvatar name={name || "?"} size={32} />
          )}
        </View>

        <TextInput
          style={styles.input}
          placeholder="Netflix"
          placeholderTextColor={theme.textTertiary}
          keyboardAppearance={scheme}
          value={name}
          onChangeText={onChangeName}
        />
      </View>
    </View>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    row: { gap: 10 },
    label: {},
    labelText: {
      fontSize: 11,
      fontWeight: "700",
      letterSpacing: 0.5,
      color: c.textTertiary,
    },
    inputRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      borderWidth: 2,
      borderColor: c.border,
      backgroundColor: c.surfaceMuted,
      paddingVertical: 5,
      paddingHorizontal: 15,
      borderRadius: 12,
    },
    badge: {
      width: 36,
      height: 36,
      borderRadius: 18,
      justifyContent: "center",
      alignItems: "center",
    },
    input: {
      flex: 1,
      fontSize: 16,
      fontWeight: "600",
      color: c.text,
      padding: 0,
    },
  });
