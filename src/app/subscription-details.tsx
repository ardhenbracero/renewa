import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useReducedMotion } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { Confetti, type ConfettiOrigin } from "@/components/confetti";
import { DetailsCard, DetailsSection } from "@/components/DetailsCard";
import { FadeUpGroup } from "@/components/fade-up";
import { DetailsHero } from "@/components/subscription-details/details-hero";
import { RenewButton } from "@/components/subscription-details/renew-button";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import type { ThemeColors } from "@/constants/palette";
import { useTheme } from "@/hooks/use-theme";
import { useThemedStyles } from "@/hooks/use-themed-styles";
import { formatDate, parseIsoDate, toIsoDate } from "@/utils/date";
import { syncReminders } from "@/utils/notifications";
import { getNextRenewalAfter, getUpcomingRenewalDate } from "@db/dateLogic";
import type { Subscription } from "@db/schema";
import { getSubscriptionById, updateSubscription } from "@db/subscriptions";
import { paymentMethodLabel } from "@/constants/payment-methods";

import { AddMemberSheet } from "@/components/subscription-details/add-member-sheet";
import { FamilySharingSection } from "@/components/subscription-details/family-sharing-section";
import { usePro } from "@/context/pro-context";
import { useProfile } from "@/context/profile-context";
import { useMembers } from "@/hooks/use-members";

function cycleLabel(sub: Subscription) {
  switch (sub.billingCycle) {
    case "weekly":
      return "Weekly";
    case "monthly":
      return "Monthly";
    case "yearly":
      return "Yearly";
    default:
      return `Every ${sub.customIntervalDays ?? 30} days`;
  }
}

function InfoRow({ label, value }: { label: string; value: string }) {
  const styles = useThemedStyles(makeStyles);
  return (
    <View style={styles.infoRow}>
      <ThemedText style={styles.infoLabel}>{label}</ThemedText>
      <ThemedText style={styles.infoValue} numberOfLines={1}>
        {value}
      </ThemedText>
    </View>
  );
}

export default function SubscriptionDetailsScreen() {
  const styles = useThemedStyles(makeStyles);
  const theme = useTheme();
  const router = useRouter();
  const { isPro } = usePro();
  const { id } = useLocalSearchParams<{ id: string }>();
  const subId = Number(id);

  const [sub, setSub] = useState<Subscription | null>(null);
  const [renewed, setRenewed] = useState(false);
  // Each Renew gets a new key so the confetti burst restarts
  const [burst, setBurst] = useState<{
    key: number;
    origin: ConfettiOrigin;
  } | null>(null);
  const reduceMotion = useReducedMotion();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const load = useCallback(() => {
    setSub(getSubscriptionById(subId) ?? null);
  }, [subId]);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  function handleRenew(origin: ConfettiOrigin) {
    if (!sub || renewed) return;
    const next = getNextRenewalAfter(sub);
    updateSubscription(sub.id, { nextRenewalDate: toIsoDate(next) });
    syncReminders(); // move the reminder to the new date
    resetPaid();
    load();
    setRenewed(true);
    if (!reduceMotion) setBurst({ key: Date.now(), origin });
    timer.current = setTimeout(() => setRenewed(false), 1800);
  }

  const { name: profileName } = useProfile();
  const {
    members,
    addNewMember,
    removeMember,
    togglePaid,
    resetPaid,
    refresh: refreshMembers,
  } = useMembers(subId, profileName);
  const [sheetVisible, setSheetVisible] = useState(false);

  // Reload subscription and members whenever the screen is focused
  // (e.g. coming back from Edit)
  useFocusEffect(
    useCallback(() => {
      load();
      refreshMembers();
    }, [load, refreshMembers]),
  );

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <View style={styles.header}>
          <Pressable
            style={styles.headerBtn}
            onPress={() => router.back()}
            hitSlop={8}
          >
            <Ionicons name="chevron-back" size={24} color={theme.text} />
          </Pressable>

          <ThemedText style={styles.headerTitle}>Details</ThemedText>

          <Pressable
            style={[styles.headerBtn, { alignItems: "flex-end" }]}
            onPress={() => sub && router.push(`/add-subscription?id=${sub.id}`)}
            hitSlop={8}
          >
            <Ionicons name="create-outline" size={22} color={theme.text} />
          </Pressable>
        </View>

        {!sub ? (
          <View style={styles.empty}>
            <ThemedText style={styles.emptyText}>
              Subscription not found.
            </ThemedText>
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            <DetailsHero sub={sub} />

            <DetailsCard>
              <FadeUpGroup step={100}>
                <DetailsSection>
                  <InfoRow
                    label="STARTED"
                    value={formatDate(parseIsoDate(sub.startDate.slice(0, 10)))}
                  />
                </DetailsSection>
                <DetailsSection>
                  <InfoRow
                    label="NEXT RENEWAL"
                    value={formatDate(getUpcomingRenewalDate(sub), true)}
                  />
                </DetailsSection>
                <DetailsSection>
                  <InfoRow label="BILLING CYCLE" value={cycleLabel(sub)} />
                </DetailsSection>
                <DetailsSection>
                  <InfoRow
                    label="PAID FROM"
                    value={paymentMethodLabel(sub.paymentMethod)}
                  />
                </DetailsSection>
                <DetailsSection last>
                  <InfoRow label="CATEGORY" value={sub.category} />
                </DetailsSection>
              </FadeUpGroup>
            </DetailsCard>

            <FadeUpGroup step={100}>
              <RenewButton
                nextDateLabel={formatDate(getNextRenewalAfter(sub))}
                renewed={renewed}
                onPress={handleRenew}
              />

              <FamilySharingSection
                total={sub.amount}
                currency={sub.currency}
                members={members}
                locked={!isPro}
                onAddPress={() =>
                  isPro ? setSheetVisible(true) : router.push("/pro?reason=family")
                }
                onTogglePaid={togglePaid}
                onRemove={removeMember}
                onReset={resetPaid}
              />
            </FadeUpGroup>
            {sub && (
              <AddMemberSheet
                visible={sheetVisible}
                onClose={() => setSheetVisible(false)}
                onAdd={(name) => {
                  addNewMember(name);
                  setSheetVisible(false);
                }}
                total={sub.amount}
                currency={sub.currency}
                existingCount={members.length}
              />
            )}
          </ScrollView>
        )}
      </SafeAreaView>

      {/* Full-screen layer so falling pieces draw over the cards below */}
      {burst && (
        <Confetti
          key={burst.key}
          origin={burst.origin}
          onDone={() => setBurst(null)}
        />
      )}
    </ThemedView>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    container: { flex: 1 },
    header: {
      height: 48,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
    },
    headerBtn: { width: 40, height: 40, justifyContent: "center" },
    headerTitle: { fontSize: 17, fontWeight: "700", color: c.text },
    content: { paddingBottom: 40 },
    infoRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 16,
    },
    infoLabel: {
      fontSize: 11,
      fontWeight: "700",
      letterSpacing: 0.5,
      color: c.textTertiary,
    },
    infoValue: {
      flexShrink: 1,
      fontSize: 15,
      fontWeight: "600",
      color: c.text,
    },
    empty: { flex: 1, alignItems: "center", justifyContent: "center" },
    emptyText: { color: c.textSecondary },
  });
