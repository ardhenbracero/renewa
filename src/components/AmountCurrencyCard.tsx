import { ThemedText } from "@/components/themed-text";
import { CURRENCIES } from "@/constants/currencies";
import type { ThemeColors } from "@/constants/palette";
import { useAppTheme } from "@/context/theme-context";
import { useTheme } from "@/hooks/use-theme";
import { useThemedStyles } from "@/hooks/use-themed-styles";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
    FlatList,
    Modal,
    Pressable,
    StyleSheet,
    TextInput,
    View,
} from "react-native";

export function AmountCurrencyCard({
  amount,
  onChangeAmount,
  currencyCode,
  onChangeCurrency,
  autoPay,
  isTrial,
}: {
  amount: string;
  onChangeAmount: (value: string) => void;
  currencyCode: string;
  onChangeCurrency: (code: string) => void;
  autoPay: boolean;
  isTrial: boolean;
}) {
  const styles = useThemedStyles(makeStyles);
  const theme = useTheme();
  const { scheme } = useAppTheme();
  const [pickerVisible, setPickerVisible] = useState(false);
  const selected =
    CURRENCIES.find((c) => c.code === currencyCode) ?? CURRENCIES[0];

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <ThemedText style={styles.label}>SUBSCRIPTION AMOUNT</ThemedText>

        <Pressable
          style={styles.currencyButton}
          onPress={() => setPickerVisible(true)}
        >
          <ThemedText style={styles.flag}>{selected.flag}</ThemedText>
          <ThemedText style={styles.currencyCode}>
            {selected.code} ({selected.symbol})
          </ThemedText>
          <Ionicons name="chevron-down" size={14} color={theme.textSecondary} />
        </Pressable>
      </View>

      <View style={styles.amountRow}>
        <View style={styles.priceRow}>
          <ThemedText style={styles.symbol}>{selected.symbol}</ThemedText>
          <TextInput
            style={styles.amountInput}
            placeholder="0.00"
            placeholderTextColor={theme.textTertiary}
            keyboardAppearance={scheme}
            keyboardType="decimal-pad"
            value={amount}
            onChangeText={onChangeAmount}
          />
        </View>

        {isTrial && autoPay && (
          <View style={[styles.pill, styles.pillTrial]}>
            <ThemedText style={[styles.pillText, styles.pillTextTrial]}>
              Trial - auto renew
            </ThemedText>
          </View>
        )}

        {isTrial && !autoPay && (
          <View style={[styles.pill, styles.pillTrial]}>
            <ThemedText style={[styles.pillText, styles.pillTextTrial]}>
              Free Trial
            </ThemedText>
          </View>
        )}

        {!isTrial && autoPay && (
          <View style={styles.pill}>
            <ThemedText style={styles.pillText}>Auto-Pay active</ThemedText>
          </View>
        )}
      </View>

      <Modal
        visible={pickerVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setPickerVisible(false)}
      >
        <Pressable
          style={styles.backdrop}
          onPress={() => setPickerVisible(false)}
        >
          <View style={styles.sheet}>
            <ThemedText style={styles.sheetTitle}>Select currency</ThemedText>
            <FlatList
              data={CURRENCIES}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <Pressable
                  style={styles.sheetRow}
                  onPress={() => {
                    onChangeCurrency(item.code);
                    setPickerVisible(false);
                  }}
                >
                  <ThemedText style={styles.flag}>{item.flag}</ThemedText>
                  <ThemedText style={styles.sheetRowText}>
                    {item.code} — {item.label}
                  </ThemedText>
                  {item.code === currencyCode && (
                    <Ionicons
                      name="checkmark"
                      size={18}
                      color={theme.accentText}
                    />
                  )}
                </Pressable>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    card: {
      marginHorizontal: 20,
      backgroundColor: c.surface,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: c.cardBorder,
      padding: 18,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: c.shadowOpacity,
      shadowRadius: 12,
      elevation: c.cardElevation,
    },
    topRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    label: {
      fontSize: 11,
      fontWeight: "700",
      letterSpacing: 0.5,
      color: c.textTertiary,
    },
    currencyButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      backgroundColor: c.surfaceWarm,
      borderRadius: 30,
      paddingHorizontal: 10,
      paddingVertical: 5,
    },
    flag: { fontSize: 14 },
    currencyCode: {
      fontSize: 13,
      fontWeight: "600",
      color: c.textSecondary,
    },
    amountRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 10,
    },
    priceRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    symbol: {
      fontSize: 32,
      fontWeight: "700",
      color: c.text,
      marginRight: 2,
      paddingTop: 15,
      paddingHorizontal: 5,
    },
    amountInput: {
      fontSize: 44,
      fontWeight: "800",
      color: c.text,
      padding: 0,
      minWidth: 80,
    },
    pill: {
      alignSelf: "flex-start",
      backgroundColor: c.accentSoft,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 20,
      marginTop: 12,
    },
    pillTrial: {
      backgroundColor: c.greenSoft, // distinct from violet auto-pay pill
    },
    pillText: {
      fontSize: 12,
      fontWeight: "600",
      color: c.accentText,
    },
    pillTextTrial: {
      color: c.greenText,
    },
    backdrop: {
      flex: 1,
      justifyContent: "flex-end",
    },
    sheet: {
      backgroundColor: c.surface,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      borderWidth: 1,
      borderColor: c.cardBorder,
      paddingTop: 16,
      paddingHorizontal: 16,
      maxHeight: "50%",
      boxShadow: "0px 4px 10px 0px rgba(0, 0, 0, 0.73)",
    },
    sheetTitle: {
      fontSize: 16,
      fontWeight: "700",
      marginBottom: 12,
      color: c.text,
    },
    sheetRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      paddingVertical: 12,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: c.divider,
    },
    sheetRowText: {
      flex: 1,
      fontSize: 14,
      color: c.textSecondary,
    },
  });
