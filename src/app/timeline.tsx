import { TAB_BAR_SPACE } from "@/components/bottom-tab-bar";
import { FadeUpGroup } from "@/components/fade-up";
import { useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenHeader } from "@/components/screen-header";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import type { ThemeColors } from "@/constants/palette";
import { useThemedStyles } from "@/hooks/use-themed-styles";
import { useSubscriptions } from "@/hooks/use-subscriptions";
import { formatCurrency } from "@/utils/format";
import { getRenewalOccurrencesInMonth } from "@db/dateLogic";
import { Subscription } from "@db/schema";

import { CalendarCard } from "@/components/timeline/calendar-card";
import { SelectedDayCard } from "@/components/timeline/selected-day-card";
import { TimelineRow } from "@/components/timeline/timeline-row";

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
  const styles = useThemedStyles(makeStyles);
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
  const selectedTotal = selectedOccurrences.reduce(
    (sum, o) => sum + o.subscription.amount,
    0,
  );
  const selectedIsToday = isSameDay(selectedDate, today);

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
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <ScreenHeader
            title="Timeline"
            subtitle="Recurring schedule"
            style={styles.header}
          />

          <FadeUpGroup step={100}>
            <CalendarCard
              monthLabel={`${MONTH_NAMES[viewMonth]} ${viewYear}`}
              weekdayLabels={WEEKDAY_LABELS}
              grid={grid}
              selectedDate={selectedDate}
              today={today}
              activeCount={subscriptions.length}
              onSelect={setSelectedDate}
              onPrev={() => goToMonth(-1)}
              onNext={() => goToMonth(1)}
            />
          </FadeUpGroup>

          <FadeUpGroup step={100}>
            <SelectedDayCard
              date={selectedDate}
              occurrences={selectedOccurrences}
              isToday={selectedIsToday}
            />
          </FadeUpGroup>

          {selectedOccurrences.length > 0 && (
            <>
              <FadeUpGroup step={100}>
                <View style={styles.sectionHeader}>
                  <View style={styles.sectionLeft}>
                    <ThemedText style={styles.sectionTitle}>
                      Due on {MONTH_NAMES[selectedDate.getMonth()]}{" "}
                      {selectedDate.getDate()}
                    </ThemedText>
                    {selectedIsToday && (
                      <View style={styles.todayPill}>
                        <ThemedText style={styles.todayPillText}>
                          Today
                        </ThemedText>
                      </View>
                    )}
                  </View>
                  <ThemedText style={styles.sectionMeta}>
                    {formatCurrency(selectedTotal)}
                  </ThemedText>
                </View>
              </FadeUpGroup>

              <FadeUpGroup step={100}>
                <View style={styles.list}>
                  {selectedOccurrences.map((o) => (
                    <TimelineRow
                      key={o.subscription.id}
                      subscription={o.subscription}
                      date={o.date}
                    />
                  ))}
                </View>
              </FadeUpGroup>
            </>
          )}
          <FadeUpGroup step={100}>
            <View style={styles.sectionHeader}>
              <ThemedText style={styles.sectionTitle}>
                Upcoming in {MONTH_NAMES[viewMonth]}
              </ThemedText>
              <ThemedText style={styles.sectionMeta}>
                {monthOccurrences.length}{" "}
                {monthOccurrences.length === 1 ? "renewal" : "renewals"} ·{" "}
                {formatCurrency(monthTotal)}
              </ThemedText>
            </View>
          </FadeUpGroup>

          <View style={styles.list}>
            <FadeUpGroup step={100}>
              {monthOccurrences.length === 0 ? (
                <ThemedText style={styles.empty}>
                  Nothing renewing this month.
                </ThemedText>
              ) : (
                monthOccurrences.map((o, i) => (
                  <TimelineRow
                    key={`${o.subscription.id}-${i}`}
                    subscription={o.subscription}
                    date={o.date}
                    showDate
                  />
                ))
              )}
            </FadeUpGroup>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    container: { flex: 1 },
    safeArea: { flex: 1 },
    content: { paddingHorizontal: 20, paddingBottom: TAB_BAR_SPACE },
    // No gap on this ScrollView, so match the 16px gap Insights/Settings use
    header: { marginBottom: 16 },

    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: 24,
      marginBottom: 12,
    },
    sectionLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
    sectionTitle: { fontSize: 16, fontWeight: "700", color: c.text },
    sectionMeta: { fontSize: 13, color: c.textTertiary },
    todayPill: {
      backgroundColor: c.redSoft,
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 10,
    },
    todayPillText: { fontSize: 11, fontWeight: "700", color: c.redText },
    list: { gap: 10 },
    empty: { fontSize: 14, color: c.textTertiary },

  });
