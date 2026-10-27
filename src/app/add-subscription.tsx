import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

import { AddSubscriptionHeader } from "@/components/AddSubscriptionHeader";
import { AmountCurrencyCard } from "@/components/AmountCurrencyCard";
import { BillingFrequencySection } from "@/components/BillingFrequencySection";
import { CategorySection } from "@/components/CategorySection";
import { DetailsCard, DetailsSection } from "@/components/DetailsCard";
import { NextRenewalDateSection } from "@/components/NextRenewalDateSection";
import { NotesSection } from "@/components/NotesSection";
import { PaymentMethodSection } from "@/components/payment-method-section";
import { QuickPickSection } from "@/components/QuickPickSection";
import { ServicePickerModal } from "@/components/service-picker-modal";
import { ServicePlanNameSection } from "@/components/ServicePlanNameSection";
import { ThemedText } from "@/components/themed-text";
import { ToggleRow } from "@/components/ToggleRow";
import type { ThemeColors } from "@/constants/palette";
import { Spacing } from "@/constants/theme";
import { usePro } from "@/context/pro-context";
import { useAppTheme } from "@/context/theme-context";
import { useTheme } from "@/hooks/use-theme";
import { useThemedStyles } from "@/hooks/use-themed-styles";
import { toIsoDate } from "@/utils/date";
import { syncReminders } from "@/utils/notifications";
import { BillingCycle, NewSubscription, PaymentMethod } from "@db/schema";
import {
  addSubscription,
  deleteSubscription,
  getSubscriptionById,
  updateSubscription,
} from "@db/subscriptions";

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

// Local date, not UTC (toISOString would give yesterday before 8am in UTC+8)
function todayIso(): string {
  return toIsoDate(new Date());
}

function isValidIsoDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !isNaN(new Date(value).getTime());
}

export default function AddSubscriptionScreen() {
  const styles = useThemedStyles(makeStyles);
  const theme = useTheme();
  const { scheme } = useAppTheme();
  const router = useRouter();
  const { canAddSubscription } = usePro();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEditing = !!id;

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("PHP");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");
  const [customIntervalDays, setCustomIntervalDays] = useState("30");
  const [nextRenewalDate, setNextRenewalDate] = useState(todayIso());
  // Set once when the subscription is created; editing keeps the original
  const [startDate, setStartDate] = useState(todayIso());
  const [isTrial, setIsTrial] = useState(false);
  const [autoPay, setAutoPay] = useState(true);
  const [notes, setNotes] = useState("");
  const [iconSlug, setIconSlug] = useState<string | null>(null);
  // New subscriptions default to Debit; older ones may have none (null)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(
    "debit",
  );
  const [pickerVisible, setPickerVisible] = useState(false);

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
        setStartDate(existing.startDate);
        setIsTrial(existing.isTrial);
        setAutoPay(existing.autoPay);
        setNotes(existing.notes ?? "");
        setIconSlug(existing.iconSlug ?? null);
        setPaymentMethod(existing.paymentMethod ?? null);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isEditing]);

  function handleSave() {
    const trimmedName = name.trim();
    const parsedAmount = parseFloat(amount);

    // Free plan limit (editing existing subscriptions is always allowed).
    // The Pro screen opens on top, so the form is still here after unlocking.
    if (!isEditing && !canAddSubscription()) {
      router.push("/pro?reason=limit");
      return;
    }
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
      startDate,
      nextRenewalDate,
      status: "active",
      iconSlug,
      paymentMethod,
    };

    if (isEditing) {
      updateSubscription(Number(id), payload);
    } else {
      addSubscription(payload);
    }
    syncReminders();

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
          syncReminders();
          router.dismissTo("/");
        },
      },
    ]);
  }

  return (
    // ScrollView is the root so the form sheet can size and expand it.
    // automaticallyAdjustKeyboardInsets keeps inputs above the keyboard
    // (KeyboardAvoidingView mis-measures inside a sheet).
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      automaticallyAdjustKeyboardInsets
    >
      <AddSubscriptionHeader
        isEditing={isEditing}
        onClose={() => router.back()}
      />

      <QuickPickSection
        selectedSlug={iconSlug}
        onSelect={(slug, name, category) => {
          setIconSlug(slug);
          setName(name);
          setCategory(category);
        }}
        onSeeMore={() => setPickerVisible(true)}
      />

      <ServicePickerModal
        visible={pickerVisible}
        selectedSlug={iconSlug}
        onClose={() => setPickerVisible(false)}
        onSelect={(picked) => {
          setIconSlug(picked.iconSlug);
          setName(picked.name);
          setCategory(picked.category);
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
                style={styles.input}
                placeholderTextColor={theme.textTertiary}
                keyboardAppearance={scheme}
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
        <DetailsSection last>
          <PaymentMethodSection
            value={paymentMethod}
            onChange={setPaymentMethod}
          />
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
  const styles = useThemedStyles(makeStyles);
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

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: c.background,
    },
    content: {
      padding: Spacing.two,
      gap: Spacing.three,
      paddingBottom: Spacing.six,
    },
    field: { gap: Spacing.one },
    fieldLabel: { textTransform: "uppercase" },
    input: {
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: Spacing.two,
      paddingHorizontal: Spacing.three,
      paddingVertical: Spacing.two,
      fontSize: 16,
      color: c.text,
    },
    saveButton: {
      backgroundColor: c.accent,
      borderRadius: Spacing.three,
      paddingVertical: Spacing.three,
      marginHorizontal: Spacing.three,
      alignItems: "center",
      marginTop: Spacing.two,
    },
    saveButtonText: { color: c.onAccent, fontWeight: "700" },
    deleteButton: {
      alignItems: "center",
      paddingVertical: Spacing.two,
    },
    deleteButtonText: { color: c.redText },
  });
