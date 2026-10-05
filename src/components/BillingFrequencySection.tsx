import { ThemedText } from "@/components/themed-text";
import { Pressable, StyleSheet, View } from "react-native";

const ACCENT = "#5B21B6";

export type BillingCycle = "weekly" | "monthly" | "yearly" | "custom";

const CYCLES: { value: BillingCycle; label: string }[] = [
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
  { value: "custom", label: "Custom" },
];

export function BillingFrequencySection({
  value,
  onChange,
}: {
  value: BillingCycle;
  onChange: (cycle: BillingCycle) => void;
}) {
  return (
    <View style={styles.wrapper}>
      <ThemedText style={styles.labelText}>BILLING FREQUENCY</ThemedText>

      <View style={styles.track}>
        {CYCLES.map((c) => {
          const selected = value === c.value;
          return (
            <Pressable
              key={c.value}
              style={[styles.segment, selected && styles.segmentSelected]}
              onPress={() => onChange(c.value)}
            >
              <ThemedText
                style={[
                  styles.segmentText,
                  selected && styles.segmentTextSelected,
                ]}
              >
                {c.label}
              </ThemedText>
            </Pressable>
          );
        })}
      </View>
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
  track: {
    flexDirection: "row",
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    padding: 4,
    gap: 4,
  },
  segment: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 9,
    alignItems: "center",
  },
  segmentSelected: {
    backgroundColor: ACCENT,
    shadowColor: ACCENT,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  segmentText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6B7280",
  },
  segmentTextSelected: {
    color: "#FFFFFF",
  },
});
