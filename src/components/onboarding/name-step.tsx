import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, TextInput, View } from "react-native";

import { ThemedText } from "@/components/themed-text";

const ACCENT = "#4338CA";

function getInitials(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

export function NameStep({
  name,
  onChangeName,
  onSubmit,
}: {
  name: string;
  onChangeName: (value: string) => void;
  onSubmit: () => void;
}) {
  const initials = getInitials(name) || "?";

  return (
    <View>
      <ThemedText style={styles.headline}>What should we call you?</ThemedText>
      <ThemedText style={styles.sub}>
        Just for a friendly greeting. Never synced or shared.
      </ThemedText>

      <View style={styles.inputCard}>
        <View style={styles.inputTop}>
          <ThemedText style={styles.label}>YOUR FIRST NAME</ThemedText>
          <View style={styles.initialsBadge}>
            <ThemedText style={styles.initialsText}>{initials}</ThemedText>
          </View>
        </View>

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={onChangeName}
            placeholder="Your first name"
            placeholderTextColor="#D1D5DB"
            autoFocus
            autoCapitalize="words"
            autoCorrect={false}
            maxLength={30}
            returnKeyType="done"
            onSubmitEditing={onSubmit}
          />
          {name.length > 0 && (
            <Pressable
              style={styles.clear}
              onPress={() => onChangeName("")}
              hitSlop={8}
            >
              <Ionicons name="close" size={14} color="#6B7280" />
            </Pressable>
          )}
        </View>
      </View>

      <View style={styles.previewLabelRow}>
        <Ionicons name="eye-outline" size={14} color={ACCENT} />
        <ThemedText style={styles.previewLabel}>HOME PREVIEW</ThemedText>
      </View>

      <View style={styles.previewCard}>
        <View style={{ flex: 1 }}>
          <ThemedText style={styles.previewHi}>
            Hi, {name.trim() || "there"}
          </ThemedText>
          <ThemedText style={styles.previewSub}>
            Here's what's coming up
          </ThemedText>
        </View>
        <View style={styles.initialsBadge}>
          <ThemedText style={styles.initialsText}>{initials}</ThemedText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headline: {
    fontSize: 30,
    fontWeight: "800",
    lineHeight: 36,
    letterSpacing: -0.5,
    color: "#111827",
    marginTop: 20,
  },
  sub: { fontSize: 15, color: "#6B7280", marginTop: 6 },
  inputCard: {
    marginTop: 24,
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  inputTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
    color: "#9CA3AF",
  },
  initialsBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#EDE9FE",
    justifyContent: "center",
    alignItems: "center",
  },
  initialsText: { fontSize: 11, fontWeight: "800", color: ACCENT },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 8,
  },
  input: {
    flex: 1,
    fontSize: 26,
    fontWeight: "700",
    color: "#111827",
    padding: 0,
  },
  clear: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  previewLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 24,
  },
  previewLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
    color: "#6B7280",
  },
  previewCard: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F1EC",
    borderRadius: 20,
    padding: 18,
  },
  previewHi: { fontSize: 20, fontWeight: "800", color: "#111827" },
  previewSub: { fontSize: 13, color: "#6B7280", marginTop: 2 },
});
