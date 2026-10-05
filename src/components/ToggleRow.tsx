import { ThemedText } from "@/components/themed-text";
import { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import { StyleSheet, Switch, View } from "react-native";

const ACCENT = "#5B21B6";

export function ToggleRow({
  icon,
  label,
  subtitle,
  value,
  onValueChange,
}: {
  icon: ComponentProps<typeof Ionicons>["name"];
  label: string;
  subtitle?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}) {
  return (
    <View style={styles.row}>
      <View style={styles.badge}>
        <Ionicons name={icon} size={16} color={ACCENT} />
      </View>

      <View style={{ flex: 1 }}>
        <ThemedText style={styles.label}>{label}</ThemedText>
        {subtitle && (
          <ThemedText style={styles.subtitle}>{subtitle}</ThemedText>
        )}
      </View>

      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: "#E5E7EB", true: ACCENT }}
        thumbColor="#FFFFFF"
        ios_backgroundColor="#E5E7EB"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  badge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#EDE9FE",
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  subtitle: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: -5,
  },
});
