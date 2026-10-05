import { ThemedText } from "@/components/themed-text";
import { StyleSheet, TextInput, View } from "react-native";

export function NotesSection({
  value,
  onChangeText,
}: {
  value: string;
  onChangeText: (text: string) => void;
}) {
  return (
    <View style={styles.wrapper}>
      <ThemedText style={styles.labelText}>CANCELLATION NOTES</ThemedText>

      <TextInput
        style={styles.input}
        placeholder="Add a note..."
        placeholderTextColor="#9CA3AF"
        value={value}
        onChangeText={onChangeText}
        multiline
        textAlignVertical="top"
      />
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
  input: {
    fontSize: 14,
    color: "#111827",
    backgroundColor: "#F3F4F6",
    minHeight: 80,
    padding: 12,
    borderRadius: 12,
  },
});
