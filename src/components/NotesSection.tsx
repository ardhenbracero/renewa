import { ThemedText } from "@/components/themed-text";
import type { ThemeColors } from "@/constants/palette";
import { useAppTheme } from "@/context/theme-context";
import { useTheme } from "@/hooks/use-theme";
import { useThemedStyles } from "@/hooks/use-themed-styles";
import { StyleSheet, TextInput, View } from "react-native";

export function NotesSection({
  value,
  onChangeText,
}: {
  value: string;
  onChangeText: (text: string) => void;
}) {
  const styles = useThemedStyles(makeStyles);
  const theme = useTheme();
  const { scheme } = useAppTheme();

  return (
    <View style={styles.wrapper}>
      <ThemedText style={styles.labelText}>NOTES</ThemedText>

      <TextInput
        style={styles.input}
        placeholder="Add a note..."
        placeholderTextColor={theme.textTertiary}
        keyboardAppearance={scheme}
        value={value}
        onChangeText={onChangeText}
        multiline
        textAlignVertical="top"
      />
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
    input: {
      fontSize: 14,
      color: c.text,
      backgroundColor: c.surfaceMuted,
      minHeight: 80,
      padding: 12,
      borderRadius: 12,
    },
  });
