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

import { ThemedText } from "@/components/themed-text";
import type { ThemeColors } from "@/constants/palette";
import { useAppTheme } from "@/context/theme-context";
import { useTheme } from "@/hooks/use-theme";
import { useThemedStyles } from "@/hooks/use-themed-styles";
import { getInitials } from "@/utils/initials";

export function EditNameSheet({
  visible,
  currentName,
  onClose,
  onSave,
}: {
  visible: boolean;
  currentName: string;
  onClose: () => void;
  onSave: (name: string) => void;
}) {
  const theme = useTheme();
  const { scheme } = useAppTheme();
  const styles = useThemedStyles(makeStyles);
  const [name, setName] = useState(currentName);

  useEffect(() => {
    if (visible) setName(currentName);
  }, [visible, currentName]);

  const canSave = name.trim().length > 0;

  function submit() {
    if (canSave) onSave(name);
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
          <ThemedText style={styles.title}>Personal details</ThemedText>
          <ThemedText style={styles.sub}>
            Used for your greeting. Stays on this phone.
          </ThemedText>

          <View style={styles.inputRow}>
            <View style={styles.avatar}>
              <ThemedText style={styles.avatarText}>
                {getInitials(name) || "?"}
              </ThemedText>
            </View>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Your first name"
              placeholderTextColor={theme.textTertiary}
              keyboardAppearance={scheme}
              autoFocus
              autoCapitalize="words"
              autoCorrect={false}
              maxLength={30}
              returnKeyType="done"
              onSubmitEditing={submit}
            />
          </View>

          <Pressable
            style={[styles.button, !canSave && styles.buttonDisabled]}
            disabled={!canSave}
            onPress={submit}
          >
            <ThemedText style={styles.buttonText}>Save</ThemedText>
          </Pressable>

          <Pressable onPress={onClose} hitSlop={8} style={styles.cancelWrap}>
            <ThemedText style={styles.cancel}>Cancel</ThemedText>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    root: { flex: 1, justifyContent: "flex-end" },
    backdrop: { ...StyleSheet.absoluteFill, backgroundColor: c.overlay },
    sheet: {
      backgroundColor: c.surface,
      borderTopLeftRadius: 28,
      borderTopRightRadius: 28,
      paddingHorizontal: 20,
      paddingTop: 10,
      paddingBottom: 28,
    },
    handle: {
      alignSelf: "center",
      width: 40,
      height: 4,
      borderRadius: 2,
      backgroundColor: c.border,
      marginBottom: 14,
    },
    title: { fontSize: 20, fontWeight: "800", color: c.text },
    sub: { fontSize: 13, color: c.textSecondary, marginTop: 4 },
    inputRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      marginTop: 18,
      backgroundColor: c.surfaceMuted,
      borderRadius: 16,
      paddingHorizontal: 14,
      height: 56,
    },
    avatar: {
      width: 34,
      height: 34,
      borderRadius: 17,
      backgroundColor: c.accent,
      alignItems: "center",
      justifyContent: "center",
    },
    avatarText: { fontSize: 12, fontWeight: "800", color: c.onAccent },
    input: {
      flex: 1,
      fontSize: 16,
      fontWeight: "600",
      color: c.text,
      padding: 0,
    },
    button: {
      marginTop: 18,
      height: 54,
      borderRadius: 27,
      backgroundColor: c.accent,
      alignItems: "center",
      justifyContent: "center",
    },
    buttonDisabled: { opacity: 0.45 },
    buttonText: { color: c.onAccent, fontSize: 16, fontWeight: "700" },
    cancelWrap: { alignSelf: "center", marginTop: 14 },
    cancel: { fontSize: 14, color: c.textSecondary },
  });
