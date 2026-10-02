import { ThemedText } from "@/components/themed-text";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, View } from "react-native";

export function AddSubscriptionHeader({ onClose }: { onClose: () => void }) {
  return (
    <View style={styles.row}>
      <View style={{ flex: 1 }}>
        <ThemedText style={styles.eyebrow}>NEW RECURRING EXPENSE</ThemedText>
        <ThemedText style={styles.title}>Add Subscription</ThemedText>
        <ThemedText style={styles.subtitle}>
          Keep renewals organized & budget safe offline
        </ThemedText>
      </View>

      <Pressable style={styles.closeButton} onPress={onClose}>
        <Ionicons name="close" size={18} color="#111827" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.6,
    color: "#5B21B6",
    backgroundColor: "#F3EFFB",
    textTransform: "uppercase",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 30,
    alignSelf: "flex-start",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    marginTop: 4,
    color: "#111827",
    paddingTop: 15,
  },
  subtitle: {
    fontSize: 13,
    color: "#6B7280",
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
});
