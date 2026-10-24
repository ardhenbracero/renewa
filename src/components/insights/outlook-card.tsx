import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import type { ThemeColors } from "@/constants/palette";
import { useTheme } from "@/hooks/use-theme";
import { useThemedStyles } from "@/hooks/use-themed-styles";
import { formatCurrency } from "@/utils/format";
import type { OutlookMonth } from "@/utils/insights";

const BAR_AREA = 96;

function compact(value: number) {
  return formatCurrency(Math.round(value)).replace(/\.00$/, "");
}

function monthYear(date: Date) {
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export function OutlookCard({ months }: { months: OutlookMonth[] }) {
  const styles = useThemedStyles(makeStyles);
  const theme = useTheme();
  const max = Math.max(...months.map((m) => m.total), 1);
  const average = months.reduce((sum, m) => sum + m.total, 0) / months.length;

  // Next month compared with this month
  const current = months[0]?.total ?? 0;
  const next = months[1]?.total ?? 0;
  const change = current > 0 ? ((next - current) / current) * 100 : null;
  const up = (change ?? 0) >= 0;

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View>
          <ThemedText style={styles.title}>6-Month Outlook</ThemedText>
          <ThemedText style={styles.sub}>
            {monthYear(months[0].date)} –{" "}
            {monthYear(months[months.length - 1].date)}
          </ThemedText>
        </View>

        {change !== null && (
          <View
            style={[styles.trendPill, up ? styles.trendUp : styles.trendDown]}
          >
            <Ionicons
              name={up ? "trending-up" : "trending-down"}
              size={13}
              color={up ? theme.amberText : theme.greenText}
            />
            <ThemedText
              style={[styles.trendText, { color: up ? theme.amberText : theme.greenText }]}
            >
              {change >= 0 ? "+" : ""}
              {change.toFixed(1)}%
            </ThemedText>
          </View>
        )}
      </View>

      <View style={styles.chart}>
        {months.map((m, i) => {
          const isCurrent = i === 0;
          const height = Math.max((m.total / max) * BAR_AREA, 6);
          return (
            <View key={m.label + i} style={styles.col}>
              <ThemedText
                style={[styles.value, isCurrent && styles.valueCurrent]}
              >
                {compact(m.total)}
              </ThemedText>
              <View style={styles.track}>
                <View
                  style={[
                    styles.bar,
                    { height },
                    isCurrent ? styles.barCurrent : styles.barOther,
                  ]}
                />
              </View>
              <ThemedText
                style={[styles.month, isCurrent && styles.monthCurrent]}
              >
                {m.label}
              </ThemedText>
            </View>
          );
        })}
      </View>

      <View style={styles.footer}>
        <ThemedText style={styles.footerLabel}>6-month average</ThemedText>
        <ThemedText style={styles.footerValue}>
          {formatCurrency(average)} / month
        </ThemedText>
      </View>
    </View>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    card: {
      backgroundColor: c.surface,
      borderWidth: 1,
      borderColor: c.cardBorder,
      borderRadius: 24,
      padding: 18,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: c.shadowOpacity,
      shadowRadius: 12,
      elevation: c.cardElevation,
    },
    headerRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    title: { fontSize: 16, fontWeight: "800", color: c.text },
    sub: { fontSize: 12, color: c.textTertiary, marginTop: 2 },
    trendPill: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 12,
      borderWidth: 1,
    },
    trendUp: { backgroundColor: c.amberSoft, borderColor: c.amberBorder },
    trendDown: { backgroundColor: c.greenSoft, borderColor: c.greenBorder },
    trendText: { fontSize: 12, fontWeight: "700" },

    chart: { flexDirection: "row", gap: 8, marginTop: 20 },
    col: { flex: 1, alignItems: "center", gap: 6 },
    value: { fontSize: 10, color: c.textTertiary },
    valueCurrent: { color: c.accentText, fontWeight: "700" },
    track: { height: BAR_AREA, justifyContent: "flex-end", alignSelf: "stretch" },
    bar: { width: "100%", borderRadius: 8 },
    barCurrent: { backgroundColor: c.accent },
    barOther: { backgroundColor: c.border },
    month: { fontSize: 11, color: c.textTertiary },
    monthCurrent: { color: c.accentText, fontWeight: "700" },

    footer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 16,
      paddingTop: 14,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: c.border,
    },
    footerLabel: { fontSize: 12, color: c.textTertiary },
    footerValue: { fontSize: 13, fontWeight: "800", color: c.text },
  });
