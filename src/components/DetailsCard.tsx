import { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

import type { ThemeColors } from "@/constants/palette";
import { useThemedStyles } from "@/hooks/use-themed-styles";

export function DetailsSection({
  children,
  last,
}: {
  children: ReactNode;
  last?: boolean;
}) {
  const styles = useThemedStyles(makeStyles);
  return (
    <View style={[styles.section, last && styles.sectionLast]}>{children}</View>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    card: {
      marginTop: 20,
      marginHorizontal: 20,
      backgroundColor: c.surface,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: c.cardBorder,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: c.shadowOpacity,
      shadowRadius: 12,
      elevation: c.cardElevation,
    },
    section: {
      paddingHorizontal: 18,
      paddingVertical: 16,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: c.divider,
    },
    sectionLast: {
      borderBottomWidth: 0,
    },
  });

export function DetailsCard({ children }: { children: ReactNode }) {
  const styles = useThemedStyles(makeStyles);
  return <View style={styles.card}>{children}</View>;
}
