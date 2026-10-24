import { StyleSheet, View } from "react-native";
import Svg, { Circle, G } from "react-native-svg";

import { ThemedText } from "@/components/themed-text";
import type { ThemeColors } from "@/constants/palette";
import { useTheme } from "@/hooks/use-theme";
import { useThemedStyles } from "@/hooks/use-themed-styles";
import { formatCurrency } from "@/utils/format";
import type { CategorySlice } from "@/utils/insights";

const SIZE = 190;
const STROKE = 22;
const RADIUS = (SIZE - STROKE) / 2;
const CIRC = 2 * Math.PI * RADIUS;
const GAP = 3; // small visual gap between segments

export function CategoryCard({
  slices,
  total,
  categoryCount,
}: {
  slices: CategorySlice[];
  total: number;
  categoryCount: number;
}) {
  const styles = useThemedStyles(makeStyles);
  const theme = useTheme();
  let acc = 0;
  const arcs = slices.map((s) => {
    const len = s.percent * CIRC;
    const arc = {
      color: s.color,
      dash: Math.max(len - (slices.length > 1 ? GAP : 0), 0.5),
      offset: acc,
    };
    acc += len;
    return arc;
  });

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View>
          <ThemedText style={styles.title}>Spending by Category</ThemedText>
          <ThemedText style={styles.sub}>
            {categoryCount} active{" "}
            {categoryCount === 1 ? "category" : "categories"}
          </ThemedText>
        </View>
        <View style={styles.pill}>
          <ThemedText style={styles.pillText}>Monthly avg</ThemedText>
        </View>
      </View>

      <View style={styles.donutWrap}>
        <Svg width={SIZE} height={SIZE}>
          <G rotation="-90" origin={`${SIZE / 2}, ${SIZE / 2}`}>
            <Circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              stroke={theme.surfaceMuted}
              strokeWidth={STROKE}
              fill="none"
            />
            {arcs.map((a, i) => (
              <Circle
                key={i}
                cx={SIZE / 2}
                cy={SIZE / 2}
                r={RADIUS}
                stroke={a.color}
                strokeWidth={STROKE}
                fill="none"
                strokeDasharray={`${a.dash} ${CIRC - a.dash}`}
                strokeDashoffset={-a.offset}
              />
            ))}
          </G>
        </Svg>

        <View style={styles.center} pointerEvents="none">
          <ThemedText style={styles.centerLabel}>TOTAL SPEND</ThemedText>
          <ThemedText style={styles.centerValue}>
            {formatCurrency(total)}
          </ThemedText>
          <ThemedText style={styles.centerUnit}>/ month</ThemedText>
        </View>
      </View>

      <View style={styles.legend}>
        {slices.map((s) => (
          <View key={s.name} style={styles.legendRow}>
            <View style={[styles.dot, { backgroundColor: s.color }]} />
            <ThemedText style={styles.legendName} numberOfLines={1}>
              {s.name}
            </ThemedText>
            <ThemedText style={styles.legendAmount}>
              {formatCurrency(s.amount)}
            </ThemedText>
            <ThemedText style={styles.legendPercent}>
              {(s.percent * 100).toFixed(1)}%
            </ThemedText>
          </View>
        ))}
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
    pill: {
      backgroundColor: c.accentSoft,
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 12,
    },
    pillText: { fontSize: 11, fontWeight: "700", color: c.accentText },

    donutWrap: {
      alignSelf: "center",
      width: SIZE,
      height: SIZE,
      marginVertical: 18,
    },
    center: {
      ...StyleSheet.absoluteFill,
      alignItems: "center",
      justifyContent: "center",
    },
    centerLabel: {
      fontSize: 10,
      fontWeight: "700",
      letterSpacing: 0.8,
      color: c.textTertiary,
    },
    centerValue: {
      fontSize: 26,
      fontWeight: "800",
      color: c.text,
      marginTop: 2,
    },
    centerUnit: { fontSize: 12, color: c.textTertiary },

    legend: {
      gap: 12,
      paddingTop: 14,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: c.border,
    },
    legendRow: { flexDirection: "row", alignItems: "center", gap: 10 },
    dot: { width: 9, height: 9, borderRadius: 4.5 },
    legendName: { flex: 1, fontSize: 13, color: c.textSecondary },
    legendAmount: { fontSize: 13, fontWeight: "700", color: c.text },
    legendPercent: {
      width: 48,
      textAlign: "right",
      fontSize: 12,
      color: c.textTertiary,
    },
  });
