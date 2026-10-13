import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { DetailsCard, DetailsSection } from "@/components/DetailsCard";
import { DetailsHero } from "@/components/subscription-details/details-hero";
import { RenewButton } from "@/components/subscription-details/renew-button";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { formatDate, parseIsoDate, toIsoDate } from "@/utils/date";
import { getNextRenewalAfter, getUpcomingRenewalDate } from "@db/dateLogic";
import type { Subscription } from "@db/schema";
import { getSubscriptionById, updateSubscription } from "@db/subscriptions";

import { AddMemberSheet } from "@/components/subscription-details/add-member-sheet";
import { FamilySharingSection } from "@/components/subscription-details/family-sharing-section";
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
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const subId = Number(id);

  const [sub, setSub] = useState<Subscription | null>(null);
  const [renewed, setRenewed] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const load = useCallback(() => {
    setSub(getSubscriptionById(subId) ?? null);
  }, [subId]);

  // Reload whenever the screen is focused (e.g. coming back from Edit)
  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  function handleRenew() {
    if (!sub || renewed) return;
    const next = getNextRenewalAfter(sub);
    updateSubscription(sub.id, { nextRenewalDate: toIsoDate(next) });
    load();
    setRenewed(true);
    timer.current = setTimeout(() => setRenewed(false), 1800);
  }

  // inside the component, below the existing useState lines:
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

  // reload both when the screen gains focus:
  useFocusEffect(
    useCallback(() => {
      load();
      refreshMembers();
    }, [load, refreshMembers]),
  );

  // in handleRenew, after updateSubscription(...):
  resetPaid();

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <View style={styles.header}>
          <Pressable
            style={styles.headerBtn}
            onPress={() => router.back()}
            hitSlop={8}
          >
            <Ionicons name="chevron-back" size={24} color="#111827" />
          </Pressable>

          <ThemedText style={styles.headerTitle}>Details</ThemedText>

          <Pressable
            style={[styles.headerBtn, { alignItems: "flex-end" }]}
            onPress={() => sub && router.push(`/add-subscription?id=${sub.id}`)}
            hitSlop={8}
          >
            <Ionicons name="create-outline" size={22} color="#111827" />
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
                <InfoRow label="CATEGORY" value={sub.category} />
              </DetailsSection>
              <DetailsSection last>
                <InfoRow
                  label="STARTED"
                  value={formatDate(parseIsoDate(sub.startDate.slice(0, 10)))}
                />
              </DetailsSection>
            </DetailsCard>

            <RenewButton
              nextDateLabel={formatDate(getNextRenewalAfter(sub))}
              renewed={renewed}
              onPress={handleRenew}
            />

            <FamilySharingSection
              total={sub.amount}
              currency={sub.currency}
              members={members}
              onAddPress={() => setSheetVisible(true)}
              onTogglePaid={togglePaid}
              onRemove={removeMember}
              onReset={resetPaid}
            />
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
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  headerBtn: { width: 40, height: 40, justifyContent: "center" },
  headerTitle: { fontSize: 17, fontWeight: "700", color: "#111827" },
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
    color: "#9CA3AF",
  },
  infoValue: {
    flexShrink: 1,
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },
  empty: { flex: 1, alignItems: "center", justifyContent: "center" },
  emptyText: { color: "#6B7280" },
});
