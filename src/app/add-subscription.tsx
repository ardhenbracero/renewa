import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

import { AddSubscriptionHeader } from "@/components/AddSubscriptionHeader";
import { AmountCurrencyCard } from "@/components/AmountCurrencyCard";
import { BillingFrequencySection } from "@/components/BillingFrequencySection";
import { BrandIconPickerModal } from "@/components/BrandIconPickerModal";
import { CategorySection } from "@/components/CategorySection";
import { DetailsCard, DetailsSection } from "@/components/DetailsCard";
import { NextRenewalDateSection } from "@/components/NextRenewalDateSection";
import { NotesSection } from "@/components/NotesSection";
import { QuickPickSection } from "@/components/QuickPickSection";
import { ServicePlanNameSection } from "@/components/ServicePlanNameSection";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { ToggleRow } from "@/components/ToggleRow";
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
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("PHP");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");
  const [customIntervalDays, setCustomIntervalDays] = useState("30");
  const [nextRenewalDate, setNextRenewalDate] = useState(todayIso());
  const [isTrial, setIsTrial] = useState(false);
  const [autoPay, setAutoPay] = useState(true);
  const [notes, setNotes] = useState("");
  const [iconSlug, setIconSlug] = useState<string | null>(null);
  const QUICK_PICK_LIMIT = 8;
  const [pickerVisible, setPickerVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

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
        setIconSlug(existing.iconSlug ?? null);
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
      iconSlug,
    };

    if (isEditing) {
      updateSubscription(Number(id), payload);
    } else {
      addSubscription(payload);
    }

    router.back();
  }

  function parseIsoDate(iso: string): Date {
    const [year, month, day] = iso.split("-").map(Number);
    return new Date(year, (month || 1) - 1, day || 1);
  }

  function toIsoDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
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
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
    >
      <ThemedView style={styles.container}>
        <ScrollView contentContainerStyle={styles.content}>
          <AddSubscriptionHeader onClose={() => router.back()} />

          <QuickPickSection
            selectedSlug={selectedPreset}
            onSelect={(slug, name, category) => {
              setSelectedPreset(slug);
              setIconSlug(slug);
              setName(name);
              setCategory(category);
            }}
            onSeeMore={() => setPickerVisible(true)}
          />

          <BrandIconPickerModal
            visible={pickerVisible}
            onClose={() => setPickerVisible(false)}
            onSelect={(entry) => {
              setSelectedPreset(entry.slug);
              setName(entry.title);
              setIconSlug(entry.slug);
              setCategory(entry.category);
            }}
          />

          <AmountCurrencyCard
            amount={amount}
            onChangeAmount={setAmount}
            currencyCode={currency}
            onChangeCurrency={setCurrency}
            autoPay={autoPay}
            isTrial={isTrial}
          />

          <DetailsCard>
            <DetailsSection>
              <ServicePlanNameSection
                name={name}
                onChangeName={setName}
                iconSlug={iconSlug}
              />
            </DetailsSection>

            <DetailsSection>
              <BillingFrequencySection
                value={billingCycle}
                onChange={setBillingCycle}
              />
            </DetailsSection>

            {billingCycle === "custom" && (
              <DetailsSection>
                <Field label="Repeats every (days)">
                  <TextInput
                    style={[styles.input, { color: theme.text }]}
                    keyboardType="number-pad"
                    value={customIntervalDays}
                    onChangeText={setCustomIntervalDays}
                  />
                </Field>
              </DetailsSection>
            )}

            <DetailsSection>
              <NextRenewalDateSection
                date={nextRenewalDate}
                onChangeDate={setNextRenewalDate}
              />
            </DetailsSection>
            <DetailsSection>
              <CategorySection value={category} onChange={setCategory} />
            </DetailsSection>
          </DetailsCard>

          <DetailsCard>
            <DetailsSection>
              <ToggleRow
                icon="gift-outline"
                label="Free trial"
                subtitle="Mark if this is a trial period"
                value={isTrial}
                onValueChange={setIsTrial}
              />
            </DetailsSection>

            <DetailsSection>
              <ToggleRow
                icon="card-outline"
                label="Auto-pay"
                subtitle="Auto charged each cycle"
                value={autoPay}
                onValueChange={setAutoPay}
              />
            </DetailsSection>
          </DetailsCard>

          <DetailsCard>
            <DetailsSection last>
              <NotesSection value={notes} onChangeText={setNotes} />
            </DetailsSection>
          </DetailsCard>

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
    </KeyboardAvoidingView>
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
  container: {
    flex: 1,
    backgroundColor: "#FBF9F6",
  },
  content: {
    padding: Spacing.two,
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
  serviceChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#8884",
  },
  serviceChipSelected: {
    backgroundColor: "#4F46E5",
    borderColor: "#4F46E5",
  },
  serviceChipTextSelected: {
    color: "#ffffff",
  },
  saveButton: {
    backgroundColor: "#4F46E5",
    borderRadius: Spacing.three,
    paddingVertical: Spacing.three,
    marginHorizontal: Spacing.three,
    alignItems: "center",
    marginTop: Spacing.two,
  },
  saveButtonText: { color: "#ffffff", fontWeight: "700" },
  deleteButton: {
    alignItems: "center",
    paddingVertical: Spacing.two,
  },
  deleteButtonText: { color: "#E5484D" },
  eyebrow: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.6,
    color: "#5B21B6",
    textTransform: "uppercase",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    marginTop: 4,
    color: "#111827",
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
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
