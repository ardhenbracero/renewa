import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  TextInput,
  View,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { BillingCycle, NewSubscription } from "@db/schema";
import {
  addSubscription,
  deleteSubscription,
  getSubscriptionById,
  updateSubscription,
} from "@db/subscriptions";

const CYCLES: { value: BillingCycle; label: string }[] = [
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
  { value: "custom", label: "Custom" },
];

const CATEGORIES = [
  "Entertainment",
  "Music",
  "Productivity",
  "Cloud & Storage",
  "Health",
  "Software",
  "AI Tools",
  "Other",
];

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function isValidIsoDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !isNaN(new Date(value).getTime());
}

export default function AddSubscriptionScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEditing = !!id;

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");
  const [customIntervalDays, setCustomIntervalDays] = useState("30");
  const [nextRenewalDate, setNextRenewalDate] = useState(todayIso());
  const [isTrial, setIsTrial] = useState(false);
  const [autoPay, setAutoPay] = useState(true);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (isEditing) {
      const existing = getSubscriptionById(Number(id));
      if (existing) {
        setName(existing.name);
        setAmount(String(existing.amount));
        setCurrency(existing.currency);
        setCategory(existing.category);
        setBillingCycle(existing.billingCycle);
        setCustomIntervalDays(String(existing.customIntervalDays ?? 30));
        setNextRenewalDate(existing.nextRenewalDate.slice(0, 10));
        setIsTrial(existing.isTrial);
        setAutoPay(existing.autoPay);
        setNotes(existing.notes ?? "");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isEditing]);

  function handleSave() {
    const trimmedName = name.trim();
    const parsedAmount = parseFloat(amount);

    if (!trimmedName) {
      Alert.alert("Name required", "Give this subscription a name.");
      return;
    }
    if (isNaN(parsedAmount) || parsedAmount < 0) {
      Alert.alert("Invalid amount", "Enter a valid amount, e.g. 9.99.");
      return;
    }
    if (!isValidIsoDate(nextRenewalDate)) {
      Alert.alert(
        "Invalid date",
        "Use the format YYYY-MM-DD, e.g. 2026-10-01.",
      );
      return;
    }

    const payload: NewSubscription = {
      name: trimmedName,
      amount: parsedAmount,
      currency: currency.trim().toUpperCase() || "USD",
      billingCycle,
      customIntervalDays:
        billingCycle === "custom" ? Number(customIntervalDays) || 30 : null,
      category,
      notes: notes.trim() || null,
      isTrial,
      trialConvertsAt: null,
      autoPay,
      startDate: isEditing ? nextRenewalDate : todayIso(),
      nextRenewalDate,
      status: "active",
    };

    if (isEditing) {
      updateSubscription(Number(id), payload);
    } else {
      addSubscription(payload);
    }

    router.back();
  }

  function handleDelete() {
    Alert.alert("Delete subscription?", "This can't be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          deleteSubscription(Number(id));
          router.back();
        },
      },
    ]);
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Field label="Name">
          <TextInput
            style={[styles.input, { color: theme.text }]}
            placeholder="Netflix"
            placeholderTextColor={theme.textSecondary}
            value={name}
            onChangeText={setName}
          />
        </Field>

        <View style={styles.row}>
          <Field label="Amount" style={styles.flex2}>
            <TextInput
              style={[styles.input, { color: theme.text }]}
              placeholder="9.99"
              placeholderTextColor={theme.textSecondary}
              keyboardType="decimal-pad"
              value={amount}
              onChangeText={setAmount}
            />
          </Field>
          <Field label="Currency" style={styles.flex1}>
            <TextInput
              style={[styles.input, { color: theme.text }]}
              placeholder="USD"
              placeholderTextColor={theme.textSecondary}
              autoCapitalize="characters"
              maxLength={3}
              value={currency}
              onChangeText={setCurrency}
            />
          </Field>
        </View>

        <Field label="Billing cycle">
          <View style={styles.chipRow}>
            {CYCLES.map((c) => (
              <Pressable
                key={c.value}
                style={[
                  styles.chip,
                  billingCycle === c.value && styles.chipSelected,
                ]}
                onPress={() => setBillingCycle(c.value)}
              >
                <ThemedText
                  type="small"
                  style={
                    billingCycle === c.value
                      ? styles.chipTextSelected
                      : undefined
                  }
                >
                  {c.label}
                </ThemedText>
              </Pressable>
            ))}
          </View>
        </Field>

        {billingCycle === "custom" && (
          <Field label="Repeats every (days)">
            <TextInput
              style={[styles.input, { color: theme.text }]}
              keyboardType="number-pad"
              value={customIntervalDays}
              onChangeText={setCustomIntervalDays}
            />
          </Field>
        )}

        <Field label="Next renewal date">
          <TextInput
            style={[styles.input, { color: theme.text }]}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={theme.textSecondary}
            value={nextRenewalDate}
            onChangeText={setNextRenewalDate}
          />
        </Field>

        <Field label="Category">
          <View style={styles.chipRow}>
            {CATEGORIES.map((c) => (
              <Pressable
                key={c}
                style={[styles.chip, category === c && styles.chipSelected]}
                onPress={() => setCategory(c)}
              >
                <ThemedText
                  type="small"
                  style={category === c ? styles.chipTextSelected : undefined}
                >
                  {c}
                </ThemedText>
              </Pressable>
            ))}
          </View>
        </Field>

        <View style={styles.switchRow}>
          <ThemedText type="default">Free trial</ThemedText>
          <Switch value={isTrial} onValueChange={setIsTrial} />
        </View>

        <View style={styles.switchRow}>
          <ThemedText type="default">Auto-pay</ThemedText>
          <Switch value={autoPay} onValueChange={setAutoPay} />
        </View>

        <Field label="Notes (optional)">
          <TextInput
            style={[styles.input, styles.notesInput, { color: theme.text }]}
            placeholder="Add a note..."
            placeholderTextColor={theme.textSecondary}
            value={notes}
            onChangeText={setNotes}
            multiline
          />
        </Field>

        <Pressable style={styles.saveButton} onPress={handleSave}>
          <ThemedText type="default" style={styles.saveButtonText}>
            {isEditing ? "Save changes" : "Add subscription"}
          </ThemedText>
        </Pressable>

        {isEditing && (
          <Pressable style={styles.deleteButton} onPress={handleDelete}>
            <ThemedText type="default" style={styles.deleteButtonText}>
              Delete subscription
            </ThemedText>
          </Pressable>
        )}
      </ScrollView>
    </ThemedView>
  );
}

function Field({
  label,
  children,
  style,
}: {
  label: string;
  children: React.ReactNode;
  style?: any;
}) {
  return (
    <View style={[styles.field, style]}>
      <ThemedText
        type="small"
        themeColor="textSecondary"
        style={styles.fieldLabel}
      >
        {label}
      </ThemedText>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    padding: Spacing.three,
    gap: Spacing.three,
    paddingBottom: Spacing.six,
  },
  field: { gap: Spacing.one },
  fieldLabel: { textTransform: "uppercase" },
  row: { flexDirection: "row", gap: Spacing.three },
  flex1: { flex: 1 },
  flex2: { flex: 2 },
  input: {
    borderWidth: 1,
    borderColor: "#8884",
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    fontSize: 16,
  },
  notesInput: { minHeight: 80, textAlignVertical: "top" },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.two },
  chip: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#8884",
  },
  chipSelected: { backgroundColor: "#4F46E5", borderColor: "#4F46E5" },
  chipTextSelected: { color: "#ffffff" },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  saveButton: {
    backgroundColor: "#4F46E5",
    borderRadius: Spacing.three,
    paddingVertical: Spacing.three,
    alignItems: "center",
    marginTop: Spacing.two,
  },
  saveButtonText: { color: "#ffffff", fontWeight: "700" },
  deleteButton: {
    alignItems: "center",
    paddingVertical: Spacing.two,
  },
  deleteButtonText: { color: "#E5484D" },
});
