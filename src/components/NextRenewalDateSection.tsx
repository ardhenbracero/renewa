import { ThemedText } from "@/components/themed-text";
import {
    daysUntil,
    formatDisplayDate,
    parseIsoDate,
    toIsoDate,
} from "@/utils/date";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Pressable, StyleSheet, View } from "react-native";

const ACCENT = "#5B21B6";

// function parseIsoDate(iso: string): Date {
//   const [year, month, day] = iso.split("-").map(Number);
//   return new Date(year, (month || 1) - 1, day || 1);
// }

// function toIsoDate(date: Date): string {
//   const year = date.getFullYear();
//   const month = String(date.getMonth() + 1).padStart(2, "0");
//   const day = String(date.getDate()).padStart(2, "0");
//   return `${year}-${month}-${day}`;
// }

// function formatDisplayDate(iso: string): string {
//   const date = parseIsoDate(iso);
//   return date.toLocaleDateString("en-US", {
//     weekday: "short",
//     month: "short",
//     day: "numeric",
//     year: "numeric",
//   });
// }

// function daysUntil(iso: string): number {
//   const target = parseIsoDate(iso);
//   const today = new Date();
//   today.setHours(0, 0, 0, 0);
//   target.setHours(0, 0, 0, 0);
//   const diffMs = target.getTime() - today.getTime();
//   return Math.round(diffMs / (1000 * 60 * 60 * 24));
// }

function relativeLabel(days: number): {
  text: string;
  tone: "soon" | "later" | "overdue";
} {
  if (days < 0) return { text: `${Math.abs(days)}d overdue`, tone: "overdue" };
  if (days === 0) return { text: "Today", tone: "soon" };
  if (days === 1) return { text: "Tomorrow", tone: "soon" };
  if (days <= 7) return { text: `In ${days} days`, tone: "soon" };
  return { text: `In ${days} days`, tone: "later" };
}

export function NextRenewalDateSection({
  date,
  onChangeDate,
}: {
  date: string;
  onChangeDate: (iso: string) => void;
}) {
  const [showPicker, setShowPicker] = require("react").useState(false);
  const hasDate = !!date;
  const relative = hasDate ? relativeLabel(daysUntil(date)) : null;

  return (
    <View style={styles.wrapper}>
      <ThemedText style={styles.labelText}>NEXT RENEWAL DATE</ThemedText>

      <Pressable style={styles.row} onPress={() => setShowPicker(true)}>
        <View style={styles.badge}>
          <Ionicons name="calendar" size={18} color={ACCENT} />
        </View>

        <View style={{ flex: 1 }}>
          <ThemedText style={styles.dateText}>
            {hasDate ? formatDisplayDate(date) : "Select a date"}
          </ThemedText>
          <ThemedText style={styles.subtitle}>Set next payment</ThemedText>
        </View>

        {relative && (
          <View
            style={[
              styles.pill,
              relative.tone === "overdue" && styles.pillOverdue,
              relative.tone === "later" && styles.pillLater,
            ]}
          >
            <ThemedText
              style={[
                styles.pillText,
                relative.tone === "overdue" && styles.pillTextOverdue,
                relative.tone === "later" && styles.pillTextLater,
              ]}
            >
              {relative.text}
            </ThemedText>
          </View>
        )}
      </Pressable>

      {showPicker && (
        <DateTimePicker
          value={hasDate ? parseIsoDate(date) : new Date()}
          mode="date"
          display="default"
          themeVariant="dark"
          onChange={(event, selectedDate) => {
            setShowPicker(false);
            if (selectedDate) {
              onChangeDate(toIsoDate(selectedDate));
            }
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: 10 },
  labelText: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
    color: "#9CA3AF",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  badge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#EDE9FE",
    justifyContent: "center",
    alignItems: "center",
  },
  dateText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },
  subtitle: {
    fontSize: 12,
    color: "#9CA3AF",
    lineHeight: 20,
  },
  pill: {
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
  },
  pillOverdue: { backgroundColor: "#FEE2E2" },
  pillLater: { backgroundColor: "#F3F4F6" },
  pillText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#B45309",
  },
  pillTextOverdue: { color: "#DC2626" },
  pillTextLater: { color: "#6B7280" },
});
