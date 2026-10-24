import { ThemedText } from "@/components/themed-text";
import type { ThemeColors } from "@/constants/palette";
import { useAppTheme } from "@/context/theme-context";
import { useTheme } from "@/hooks/use-theme";
import { useThemedStyles } from "@/hooks/use-themed-styles";
import {
    daysUntil,
    formatDisplayDate,
    parseIsoDate,
    toIsoDate,
} from "@/utils/date";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

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
  const styles = useThemedStyles(makeStyles);
  const theme = useTheme();
  const { scheme } = useAppTheme();
  const [showPicker, setShowPicker] = useState(false);
  const hasDate = !!date;
  const relative = hasDate ? relativeLabel(daysUntil(date)) : null;

  return (
    <View style={styles.wrapper}>
      <ThemedText style={styles.labelText}>NEXT RENEWAL DATE</ThemedText>

      <Pressable style={styles.row} onPress={() => setShowPicker(true)}>
        <View style={styles.badge}>
          <Ionicons name="calendar" size={18} color={theme.accentText} />
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
          themeVariant={scheme}
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

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    wrapper: { gap: 10 },
    labelText: {
      fontSize: 11,
      fontWeight: "700",
      letterSpacing: 0.5,
      color: c.textTertiary,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      backgroundColor: c.surfaceMuted,
      borderRadius: 12,
      paddingHorizontal: 10,
      paddingVertical: 5,
    },
    badge: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: c.accentSoft,
      justifyContent: "center",
      alignItems: "center",
    },
    dateText: {
      fontSize: 15,
      fontWeight: "700",
      color: c.text,
    },
    subtitle: {
      fontSize: 12,
      color: c.textTertiary,
      lineHeight: 20,
    },
    pill: {
      backgroundColor: c.amberSoft,
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 14,
    },
    pillOverdue: { backgroundColor: c.redSoft },
    pillLater: { backgroundColor: c.surface },
    pillText: {
      fontSize: 11,
      fontWeight: "700",
      color: c.amberText,
    },
    pillTextOverdue: { color: c.redText },
    pillTextLater: { color: c.textSecondary },
  });
