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
      marginHorizontal: 20,
      backgroundColor: "#fff",
      borderRadius: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.06,
      shadowRadius: 12,
      elevation: 2,
    },
    section: {
      paddingHorizontal: 18,
      paddingVertical: 16,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: "#F3F4F6",
    },
    sectionLast: {
      borderBottomWidth: 0,
    },
  });

export function DetailsCard({ children }: { children: ReactNode }) {
  const styles = useThemedStyles(makeStyles);
  return <View style={styles.card}>{children}</View>;
}
