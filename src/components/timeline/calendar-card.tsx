import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, View } from "react-native";

import { getBrandHex } from "@/components/brand-icon";
import { colorForName } from "@/components/InitialsAvatar";
import { ThemedText } from "@/components/themed-text";
import type { Subscription } from "@db/schema";

const ACCENT = "#5B21B6";

export type CalendarCell = {
  date: Date;
  inCurrentMonth: boolean;
  occurrences: { date: Date; subscription: Subscription }[];
};

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

// Brand color when we have one (Netflix red, Spotify green), else the name-based color
function dotColor(sub: Subscription) {
  return (
    (sub.iconSlug ? getBrandHex(sub.iconSlug) : null) ?? colorForName(sub.name)
  );
}

export function CalendarCard({
  monthLabel,
  weekdayLabels,
  grid,
  selectedDate,
  today,
  activeCount,
  onSelect,
  onPrev,
  onNext,
}: {
  monthLabel: string;
  weekdayLabels: string[];
  grid: CalendarCell[];
  selectedDate: Date;
  today: Date;
  activeCount: number;
  onSelect: (date: Date) => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const monthSubs = new Map<number, Subscription>();
  for (const cell of grid) {
    if (!cell.inCurrentMonth) continue;
    for (const o of cell.occurrences)
      monthSubs.set(o.subscription.id, o.subscription);
  }
  const legend = Array.from(monthSubs.values()).slice(0, 3);
  const markedCount = grid.filter(
    (c) => c.inCurrentMonth && c.occurrences.length > 0,
  ).length;

  return (
    <View style={styles.card}>
      <View style={styles.monthRow}>
        <View style={styles.monthLeft}>
          <ThemedText style={styles.monthText}>{monthLabel}</ThemedText>
          <View style={styles.activePill}>
            <ThemedText style={styles.activePillText}>
              {activeCount} Active
            </ThemedText>
          </View>
        </View>

        <View style={styles.navRow}>
          <Pressable style={styles.navBtn} onPress={onPrev} hitSlop={8}>
            <Ionicons name="chevron-back" size={16} color="#6B7280" />
          </Pressable>
          <Pressable style={styles.navBtn} onPress={onNext} hitSlop={8}>
            <Ionicons name="chevron-forward" size={16} color="#6B7280" />
          </Pressable>
        </View>
      </View>

      <View style={styles.weekRow}>
        {weekdayLabels.map((label, i) => (
          <ThemedText key={`${label}-${i}`} style={styles.weekLabel}>
            {label}
          </ThemedText>
        ))}
      </View>

      <View style={styles.grid}>
        {grid.map((cell, index) => {
          const selected = sameDay(cell.date, selectedDate);
          const isToday = sameDay(cell.date, today);

          return (
            <Pressable
              key={index}
              style={styles.cell}
              onPress={() => onSelect(cell.date)}
            >
              <View
                style={[
                  styles.dayWrap,
                  !selected && isToday && styles.dayToday,
                  selected && styles.daySelected,
                ]}
              >
                <ThemedText
                  style={[
                    styles.dayText,
                    !cell.inCurrentMonth && styles.dayMuted,
                    !selected && isToday && styles.dayTodayText,
                    selected && styles.daySelectedText,
                  ]}
                >
                  {cell.date.getDate()}
                </ThemedText>
              </View>

              <View style={styles.dots}>
                {cell.occurrences.slice(0, 3).map((o, i) => (
                  <View
                    key={i}
                    style={[
                      styles.dot,
                      { backgroundColor: dotColor(o.subscription) },
                    ]}
                  />
                ))}
              </View>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.legendRow}>
        <View style={styles.legendLeft}>
          {legend.map((sub) => (
            <View key={sub.id} style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: dotColor(sub) }]}
              />
              <ThemedText style={styles.legendText} numberOfLines={1}>
                {sub.name}
              </ThemedText>
            </View>
          ))}
        </View>
        <ThemedText style={styles.marked}>
          {markedCount} {markedCount === 1 ? "date" : "dates"} marked
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  monthRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  monthLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  monthText: { fontSize: 17, fontWeight: "800", color: "#111827" },
  activePill: {
    backgroundColor: "#EDE9FE",
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 10,
  },
  activePillText: { fontSize: 11, fontWeight: "700", color: ACCENT },
  navRow: { flexDirection: "row", gap: 8 },
  navBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },

  weekRow: { flexDirection: "row", marginTop: 16, marginBottom: 6 },
  weekLabel: {
    width: "14.2857%",
    textAlign: "center",
    fontSize: 12,
    color: "#9CA3AF",
  },

  grid: { flexDirection: "row", flexWrap: "wrap" },
  cell: {
    width: "14.2857%",
    alignItems: "center",
    paddingVertical: 4,
  },
  dayWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  dayToday: { backgroundColor: "#EDE9FE" },
  daySelected: { backgroundColor: ACCENT },
  dayText: { fontSize: 14, fontWeight: "500", color: "#111827" },
  dayMuted: { color: "#D1D5DB" },
  dayTodayText: { color: ACCENT, fontWeight: "700" },
  daySelectedText: { color: "#FFFFFF", fontWeight: "700" },
  dots: { flexDirection: "row", gap: 3, height: 6, marginTop: 3 },
  dot: { width: 5, height: 5, borderRadius: 2.5 },

  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#E5E7EB",
  },
  legendLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flexShrink: 1,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    flexShrink: 1,
  },
  legendDot: { width: 7, height: 7, borderRadius: 3.5 },
  legendText: { fontSize: 11, color: "#6B7280", flexShrink: 1 },
  marked: { fontSize: 11, color: "#9CA3AF" },
});
