import { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

import type { ThemeColors } from "@/constants/palette";
import { useThemedStyles } from "@/hooks/use-themed-styles";

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    section: {
      paddingHorizontal: 18,
      paddingVertical: 16,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: c.divider,
    },
    sectionLast: { borderBottomWidth: 0 },
  });

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
