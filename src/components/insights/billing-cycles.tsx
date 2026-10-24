import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import type { ThemeColors } from "@/constants/palette";
import { useTheme } from "@/hooks/use-theme";
import { useThemedStyles } from "@/hooks/use-themed-styles";
import { formatCurrency } from "@/utils/format";
import type { BillingCycle } from "@db/schema";

// tint/color name palette tokens so the badges follow light/dark
const META = {
  monthly: {
    label: "MONTHLY",
    icon: "sync",
    tint: "accentSoft",
    color: "accentText",
    unit: "/ mo",
  },
  yearly: {
    label: "YEARLY",
    icon: "calendar",
    tint: "greenSoft",
    color: "greenText",
    unit: "/ yr",
  },
  weekly: {
    label: "WEEKLY",
    icon: "time-outline",
    tint: "surfaceMuted",
    color: "textSecondary",
    unit: "/ wk",
  },
  custom: {
    label: "CUSTOM",
    icon: "options-outline",
    tint: "amberSoft",
    color: "amberText",
    unit: "total",
  },
} as const;

export function BillingCycles({
  summary,
}: {
  summary: Record<BillingCycle, { count: number; sum: number }>;
}) {
  const styles = useThemedStyles(makeStyles);
  const theme = useTheme();
  // Custom only appears once someone actually uses it
  const keys: BillingCycle[] = ["monthly", "yearly", "weekly"];
  if (summary.custom.count > 0) keys.push("custom");

  const perRow = keys.length === 4 ? 2 : 3;
  const rows: BillingCycle[][] = [];
  for (let i = 0; i < keys.length; i += perRow)
    rows.push(keys.slice(i, i + perRow));

  return (
    <View style={{ gap: 10 }}>
      {rows.map((row, r) => (
        <View key={r} style={styles.row}>
          {row.map((key) => {
            const meta = META[key];
            const { count, sum } = summary[key];
            return (
              <View key={key} style={styles.card}>
                <View
                  style={[styles.iconBadge, { backgroundColor: theme[meta.tint] }]}
                >
                  <Ionicons name={meta.icon} size={14} color={theme[meta.color]} />
                </View>
                <ThemedText style={styles.label}>{meta.label}</ThemedText>
                <ThemedText style={styles.count}>{count}</ThemedText>
                <ThemedText style={styles.foot} numberOfLines={1}>
                  {count === 0
                    ? "None active"
                    : `${formatCurrency(sum)} ${meta.unit}`}
                </ThemedText>
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    row: { flexDirection: "row", gap: 10 },
    card: {
      flex: 1,
      backgroundColor: c.surface,
      borderWidth: 1,
      borderColor: c.cardBorder,
      borderRadius: 18,
      padding: 14,
      gap: 4,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: c.shadowOpacity,
      shadowRadius: 10,
      elevation: c.cardElevation,
    },
    iconBadge: {
      width: 26,
      height: 26,
      borderRadius: 13,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 6,
    },
    label: {
      fontSize: 10,
      fontWeight: "700",
      letterSpacing: 0.6,
      color: c.textTertiary,
    },
    count: { fontSize: 24, fontWeight: "800", color: c.text },
    foot: { fontSize: 11, color: c.textTertiary },
  });
