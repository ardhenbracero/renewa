import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { ThemedText } from "@/components/themed-text";
import type { ThemeColors } from "@/constants/palette";
import { useThemedStyles } from "@/hooks/use-themed-styles";

// Shared page title + subtitle for the top-level screens (Timeline, Insights,
// Settings) so their size, weight and spacing stay identical.
export function ScreenHeader({
  title,
  subtitle,
  style,
}: {
  title: string;
  subtitle?: string;
  style?: StyleProp<ViewStyle>;
}) {
  const styles = useThemedStyles(makeStyles);

  return (
    <View style={[styles.header, style]}>
      <ThemedText style={styles.title}>{title}</ThemedText>
      {subtitle && <ThemedText style={styles.subtitle}>{subtitle}</ThemedText>}
    </View>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    header: { paddingTop: 16 },
    // Explicit lineHeights: ThemedText's default (24) is too short for 30px
    title: {
      fontSize: 30,
      lineHeight: 36,
      fontWeight: "800",
      color: c.text,
    },
    subtitle: {
      fontSize: 13,
      lineHeight: 18,
      color: c.textTertiary,
      marginTop: 2,
    },
  });
