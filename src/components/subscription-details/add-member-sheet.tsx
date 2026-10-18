import { useEffect, useState } from "react";
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    StyleSheet,
    TextInput,
    View,
} from "react-native";

import { InitialsAvatar } from "@/components/InitialsAvatar";
import { ThemedText } from "@/components/themed-text";
import { formatCurrency } from "@/utils/format";
import { previewEach } from "@/utils/split";

const ACCENT = "#5B21B6";

export function AddMemberSheet({
  visible,
  onClose,
  onAdd,
  total,
  currency,
  existingCount,
}: {
  visible: boolean;
  onClose: () => void;
  onAdd: (name: string) => void;
  total: number;
  currency: string;
  existingCount: number;
}) {
  const [name, setName] = useState("");

  useEffect(() => {
    if (visible) setName("");
  }, [visible]);

  // First member also adds you, so the split starts at 2 people
  const people = existingCount === 0 ? 2 : existingCount + 1;
  const each = previewEach(total, people);
  const canAdd = name.trim().length > 0;

  function submit() {
    if (canAdd) onAdd(name);
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.root}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View style={styles.sheet}>
          <View style={styles.handle} />
          <ThemedText style={styles.title}>Add member</ThemedText>

          <View style={styles.inputRow}>
            <InitialsAvatar name={name || "?"} size={36} />
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Member's name"
              placeholderTextColor="#9CA3AF"
              autoFocus
              autoCapitalize="words"
              autoCorrect={false}
              maxLength={30}
              returnKeyType="done"
              onSubmitEditing={submit}
            />
          </View>

          <View style={styles.preview}>
            <ThemedText style={styles.previewText}>
              Split {people} ways · about {formatCurrency(each, currency)} each
            </ThemedText>
          </View>

          <Pressable
            style={[styles.button, !canAdd && styles.buttonDisabled]}
            disabled={!canAdd}
            onPress={submit}
          >
            <ThemedText style={styles.buttonText}>Add member</ThemedText>
          </Pressable>

          <Pressable onPress={onClose} hitSlop={8} style={styles.cancelWrap}>
            <ThemedText style={styles.cancel}>Cancel</ThemedText>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: "flex-end" },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0,0,0,0)",
  },
  sheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 28,
    boxShadow: "0px 4px 10px 0px rgba(0, 0, 0, 0.75)",
  },
  handle: {
    alignSelf: "center",
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#E5E7EB",
    marginBottom: 14,
  },
  title: { fontSize: 20, fontWeight: "800", color: "#111827" },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 18,
    backgroundColor: "#F3F4F6",
    borderRadius: 16,
    paddingHorizontal: 14,
    height: 56,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    padding: 0,
  },
  preview: {
    marginTop: 12,
    backgroundColor: "#EDE9FE",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  previewText: { fontSize: 13, fontWeight: "600", color: ACCENT },
  button: {
    marginTop: 18,
    height: 54,
    borderRadius: 27,
    backgroundColor: ACCENT,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonDisabled: { opacity: 0.45 },
  buttonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
  cancelWrap: { alignSelf: "center", marginTop: 14 },
  cancel: { fontSize: 14, color: "#6B7280" },
});
