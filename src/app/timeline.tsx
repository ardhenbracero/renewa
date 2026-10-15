import { BottomTabBar } from "@/components/bottom-tab-bar";
import { FadeUpGroup } from "@/components/fade-up";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// import { SubscriptionRow } from "@/components/subscription-row";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
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
  const router = useRouter();
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
          <View style={styles.header}>
            <ThemedText style={styles.title}>Timeline</ThemedText>
            <ThemedText style={styles.subtitle}>Recurring schedule</ThemedText>
          </View>

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

        <Pressable
          style={styles.fab}
          onPress={() => router.push("/add-subscription")}
        >
          <Ionicons name="add" size={30} color="#FFFFFF" />
        </Pressable>
      </SafeAreaView>
      <BottomTabBar active="timeline" />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  content: { paddingHorizontal: 20, paddingBottom: 120 },
  header: { paddingTop: 8, marginBottom: 16 },
  title: { fontSize: 30, fontWeight: "600", paddingTop: 20, color: "#111827" },
  subtitle: { fontSize: 13, color: "#9CA3AF", marginTop: 2 },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 24,
    marginBottom: 12,
  },
  sectionLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#111827" },
  sectionMeta: { fontSize: 13, color: "#9CA3AF" },
  todayPill: {
    backgroundColor: "#FEE2E2",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  todayPillText: { fontSize: 11, fontWeight: "700", color: "#DC2626" },
  list: { gap: 10 },
  empty: { fontSize: 14, color: "#9CA3AF" },

  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#5B21B6",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#5B21B6",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
});
