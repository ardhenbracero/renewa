import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";

const ACCENT = "#5B21B6";
const SUCCESS = "#059669";

export function RenewButton({
  nextDateLabel,
  renewed,
  onPress,
}: {
  nextDateLabel: string;
  renewed: boolean;
  onPress: () => void;
}) {
  return (
    <View style={styles.wrapper}>
      <Pressable
        style={[styles.button, renewed && styles.buttonSuccess]}
        onPress={onPress}
        disabled={renewed}
      >
        <Ionicons
          name={renewed ? "checkmark-circle" : "refresh"}
          size={20}
          color="#FFFFFF"
        />
        <ThemedText style={styles.label}>
          {renewed ? "Renewed" : "Renew"}
        </ThemedText>
      </Pressable>

      <ThemedText style={styles.helper}>
        {renewed ? (
          "Next renewal updated"
        ) : (
          <>
            Moves next renewal to{" "}
            <ThemedText style={styles.helperDate}>{nextDateLabel}</ThemedText>
          </>
        )}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 20,
    marginHorizontal: 20,
    alignItems: "center",
    gap: 10,
  },
  button: {
    alignSelf: "stretch",
    height: 56,
    borderRadius: 28,
    backgroundColor: ACCENT,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: ACCENT,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  buttonSuccess: { backgroundColor: SUCCESS, shadowColor: SUCCESS },
  label: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
  helper: { fontSize: 13, color: "#9CA3AF" },
  helperDate: { fontSize: 13, fontWeight: "700", color: "#111827" },
});
