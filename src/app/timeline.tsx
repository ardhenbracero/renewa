import { useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BottomTabBar } from "@/components/bottom-tab-bar";
import { colorForName } from "@/components/service-icon";
import { SubscriptionRow } from "@/components/subscription-row";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Spacing } from "@/constants/theme";
import { useSubscriptions } from "@/hooks/use-subscriptions";
import { formatCurrency } from "@/utils/format";
import { getRenewalOccurrencesInMonth } from "@db/dateLogic";
import { Subscription } from "@db/schema";

const WEEKDAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

type Occurrence = { subscription: Subscription; date: Date };
type DayCell = {
  date: Date;
  inCurrentMonth: boolean;
  occurrences: Occurrence[];
};

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function buildMonthGrid(
  year: number,
  month: number,
  subscriptions: Subscription[],
): DayCell[] {
  const firstOfMonth = new Date(year, month, 1);
  const startWeekday = firstOfMonth.getDay();
  const gridStart = new Date(year, month, 1 - startWeekday);

  const perSub = subscriptions.map((sub) => ({
    sub,
    dates: getRenewalOccurrencesInMonth(sub, year, month),
  }));

  const cells: DayCell[] = [];
  for (let i = 0; i < 42; i++) {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + i);

    const occurrences: Occurrence[] = [];
    perSub.forEach(({ sub, dates }) => {
      dates.forEach((d) => {
        if (isSameDay(d, date))
          occurrences.push({ subscription: sub, date: d });
      });
    });

    cells.push({
      date,
      inCurrentMonth: date.getMonth() === month,
      occurrences,
    });
  }
  return cells;
}

export default function TimelineScreen() {
  const { subscriptions, refresh } = useSubscriptions();
  const today = useMemo(() => new Date(), []);
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<Date>(today);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  const grid = useMemo(
    () => buildMonthGrid(viewYear, viewMonth, subscriptions),
    [viewYear, viewMonth, subscriptions],
  );

  function goToMonth(delta: number) {
    const next = new Date(viewYear, viewMonth + delta, 1);
    setViewYear(next.getFullYear());
    setViewMonth(next.getMonth());
  }

  const selectedCell = grid.find((cell) => isSameDay(cell.date, selectedDate));
  const selectedOccurrences = selectedCell?.occurrences ?? [];

  const monthOccurrences = grid
    .filter((cell) => cell.inCurrentMonth)
    .flatMap((cell) => cell.occurrences)
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  const monthTotal = monthOccurrences.reduce(
    (sum, o) => sum + o.subscription.amount,
    0,
  );

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.header}>
            <ThemedText type="subtitle">Timeline</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              Recurring schedule · Offline safe
            </ThemedText>
          </View>

          <ThemedView type="backgroundElement" style={styles.calendarCard}>
            <View style={styles.monthRow}>
              <Pressable onPress={() => goToMonth(-1)} hitSlop={12}>
                <ThemedText type="default">‹</ThemedText>
              </Pressable>
              <ThemedText type="smallBold">
                {MONTH_NAMES[viewMonth]} {viewYear}
              </ThemedText>
              <Pressable onPress={() => goToMonth(1)} hitSlop={12}>
                <ThemedText type="default">›</ThemedText>
              </Pressable>
            </View>

            <View style={styles.weekdayRow}>
              {WEEKDAY_LABELS.map((label, i) => (
                <ThemedText
                  key={`${label}-${i}`}
                  type="small"
                  themeColor="textSecondary"
                  style={styles.weekdayLabel}
                >
                  {label}
                </ThemedText>
              ))}
            </View>

            <View style={styles.grid}>
              {grid.map((cell, index) => {
                const selected = isSameDay(cell.date, selectedDate);
                const isToday = isSameDay(cell.date, today);
                return (
                  <Pressable
                    key={index}
                    style={styles.dayCell}
                    onPress={() => setSelectedDate(cell.date)}
                  >
                    <View
                      style={[
                        styles.dayNumberWrap,
                        selected && styles.dayNumberSelected,
                        !selected && isToday && styles.dayNumberToday,
                      ]}
                    >
                      <ThemedText
                        type="small"
                        style={
                          [
                            !cell.inCurrentMonth && styles.dayNumberMuted,
                            selected && styles.dayNumberTextSelected,
                          ] as any
                        }
                      >
                        {cell.date.getDate()}
                      </ThemedText>
                    </View>
                    <View style={styles.dotsRow}>
                      {cell.occurrences.slice(0, 3).map((o, i) => (
                        <View
                          key={i}
                          style={[
                            styles.dot,
                            {
                              backgroundColor: colorForName(
                                o.subscription.name,
                              ),
                            },
                          ]}
                        />
                      ))}
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </ThemedView>

          <ThemedView type="backgroundElement" style={styles.selectedCard}>
            <ThemedText type="small" themeColor="textSecondary">
              SELECTED ·{" "}
              {selectedDate.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </ThemedText>
            {selectedOccurrences.length === 0 ? (
              <ThemedText type="default">No renewals on this day</ThemedText>
            ) : (
              <ThemedText type="default">
                {selectedOccurrences.length} renewal
                {selectedOccurrences.length > 1 ? "s" : ""} due ·{" "}
                {formatCurrency(
                  selectedOccurrences.reduce(
                    (s, o) => s + o.subscription.amount,
                    0,
                  ),
                )}
              </ThemedText>
            )}
          </ThemedView>

          {selectedOccurrences.length > 0 && (
            <View style={styles.section}>
              {selectedOccurrences.map((o) => (
                <SubscriptionRow
                  key={o.subscription.id}
                  subscription={o.subscription}
                />
              ))}
            </View>
          )}

          <ThemedText type="smallBold" style={styles.sectionTitle}>
            Upcoming in {MONTH_NAMES[viewMonth]} · {formatCurrency(monthTotal)}
          </ThemedText>
          <View style={styles.section}>
            {monthOccurrences.length === 0 ? (
              <ThemedText type="default" themeColor="textSecondary">
                Nothing renewing this month.
              </ThemedText>
            ) : (
              monthOccurrences.map((o, i) => (
                <SubscriptionRow
                  key={`${o.subscription.id}-${i}`}
                  subscription={o.subscription}
                />
              ))
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
      <BottomTabBar active="timeline" />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  content: { paddingHorizontal: Spacing.three, paddingBottom: Spacing.six },
  header: { paddingVertical: Spacing.three },
  calendarCard: {
    borderRadius: Spacing.four,
    padding: Spacing.three,
    marginBottom: Spacing.three,
  },
  monthRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.two,
    paddingHorizontal: Spacing.one,
  },
  weekdayRow: { flexDirection: "row", marginBottom: Spacing.one },
  weekdayLabel: { flex: 1, textAlign: "center" },
  grid: { flexDirection: "row", flexWrap: "wrap" },
  dayCell: {
    width: `${100 / 7}%`,
    alignItems: "center",
    paddingVertical: Spacing.one,
    gap: 2,
  },
  dayNumberWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  dayNumberSelected: { backgroundColor: "#4F46E5" },
  dayNumberToday: { borderWidth: 1, borderColor: "#4F46E5" },
  dayNumberTextSelected: { color: "#ffffff" },
  dayNumberMuted: { opacity: 0.35 },
  dotsRow: { flexDirection: "row", gap: 2, height: 6 },
  dot: { width: 4, height: 4, borderRadius: 2 },
  selectedCard: {
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.one,
    marginBottom: Spacing.three,
  },
  section: { marginBottom: Spacing.four },
  sectionTitle: { marginBottom: Spacing.two },
});
