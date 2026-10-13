import { Ionicons } from "@expo/vector-icons";
import { Alert, Pressable, StyleSheet, View } from "react-native";

import { InitialsAvatar } from "@/components/InitialsAvatar";
import { ThemedText } from "@/components/themed-text";
import { formatCurrency } from "@/utils/format";
import { computeSplit } from "@/utils/split";
import type { Member } from "@db/schema";

const ACCENT = "#5B21B6";

function StatusChip({ paid, onPress }: { paid: boolean; onPress: () => void }) {
  return (
    <Pressable
      style={[styles.chip, paid ? styles.chipPaid : styles.chipUnpaid]}
      onPress={onPress}
      hitSlop={6}
    >
      <ThemedText
        style={[
          styles.chipText,
          paid ? styles.chipTextPaid : styles.chipTextUnpaid,
        ]}
      >
        {paid ? "Paid" : "Unpaid"}
      </ThemedText>
      <Ionicons
        name={paid ? "checkmark" : "time-outline"}
        size={13}
        color={paid ? "#047857" : "#B45309"}
      />
    </Pressable>
  );
}

export function FamilySharingSection({
  total,
  currency,
  members,
  onAddPress,
  onTogglePaid,
  onRemove,
  onReset,
}: {
  total: number;
  currency: string;
  members: Member[];
  onAddPress: () => void;
  onTogglePaid: (member: Member) => void;
  onRemove: (id: number) => void;
  onReset: () => void;
}) {
  const split = computeSplit(total, members);
  const progress = total > 0 ? Math.min(split.collected / total, 1) : 0;

  function confirmRemove(m: Member) {
    Alert.alert(m.name, "Remove from this split?", [
      { text: "Cancel", style: "cancel" },
      { text: "Remove", style: "destructive", onPress: () => onRemove(m.id) },
    ]);
  }

  function confirmReset() {
    Alert.alert(
      "Reset for next cycle?",
      "Everyone except you will be marked as unpaid.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Reset", onPress: onReset },
      ],
    );
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.headerRow}>
        <ThemedText style={styles.label}>FAMILY SHARING</ThemedText>
        {members.length > 0 && (
          <Pressable onPress={onAddPress} hitSlop={8}>
            <ThemedText style={styles.addLink}>+ Add member</ThemedText>
          </Pressable>
        )}
      </View>

      {members.length === 0 ? (
        <View style={styles.card}>
          <ThemedText style={styles.emptyTitle}>
            Sharing this with others?
          </ThemedText>
          <ThemedText style={styles.emptySub}>
            Split the cost and keep track of who has paid you.
          </ThemedText>
          <Pressable style={styles.emptyButton} onPress={onAddPress}>
            <Ionicons name="person-add-outline" size={16} color={ACCENT} />
            <ThemedText style={styles.emptyButtonText}>Add member</ThemedText>
          </Pressable>
        </View>
      ) : (
        <>
          <View style={styles.card}>
            <View style={styles.summaryTop}>
              <ThemedText style={styles.summaryTitle}>
                Split {split.count} ways
              </ThemedText>
              <ThemedText style={styles.summaryEach}>
                {formatCurrency(split.eachAmount, currency)} each
              </ThemedText>
            </View>

            <View style={styles.track}>
              <View style={[styles.fill, { width: `${progress * 100}%` }]} />
            </View>

            <View style={styles.summaryBottom}>
              <ThemedText style={styles.paidCount}>
                {split.paidCount} of {split.count} paid
              </ThemedText>
              <ThemedText style={styles.collected}>
                {formatCurrency(split.collected, currency)} collected /{" "}
                {formatCurrency(total, currency)}
              </ThemedText>
            </View>
          </View>

          <View style={[styles.card, styles.listCard]}>
            {members.map((m, i) => (
              <Pressable
                key={m.id}
                style={[styles.memberRow, i > 0 && styles.memberDivider]}
                onPress={() => !m.isManager && confirmRemove(m)}
              >
                <InitialsAvatar name={m.name} size={44} />

                <View style={{ flex: 1 }}>
                  <View style={styles.nameRow}>
                    <ThemedText style={styles.memberName} numberOfLines={1}>
                      {m.isManager ? "You" : m.name}
                    </ThemedText>
                    {m.isManager && (
                      <View style={styles.managerTag}>
                        <ThemedText style={styles.managerTagText}>
                          Manager
                        </ThemedText>
                      </View>
                    )}
                  </View>
                  <ThemedText style={styles.share}>
                    {formatCurrency(split.shares[m.id], currency)}
                  </ThemedText>
                </View>

                <StatusChip paid={m.paid} onPress={() => onTogglePaid(m)} />
              </Pressable>
            ))}
          </View>

          <Pressable
            onPress={confirmReset}
            hitSlop={8}
            style={styles.resetWrap}
          >
            <ThemedText style={styles.reset}>Reset for next cycle</ThemedText>
          </Pressable>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginTop: 28, marginHorizontal: 20 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  label: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
    color: "#9CA3AF",
  },
  addLink: { fontSize: 13, fontWeight: "700", color: ACCENT },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  listCard: { padding: 0, overflow: "hidden" },

  emptyTitle: { fontSize: 16, fontWeight: "700", color: "#111827" },
  emptySub: { fontSize: 13, color: "#6B7280", marginTop: 4 },
  emptyButton: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 14,
    backgroundColor: "#EDE9FE",
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 18,
  },
  emptyButtonText: { fontSize: 13, fontWeight: "700", color: ACCENT },

  summaryTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryTitle: { fontSize: 17, fontWeight: "800", color: "#111827" },
  summaryEach: { fontSize: 13, color: "#6B7280" },
  track: {
    height: 6,
    borderRadius: 3,
    backgroundColor: "#E5E7EB",
    marginTop: 14,
    overflow: "hidden",
  },
  fill: { height: 6, borderRadius: 3, backgroundColor: ACCENT },
  summaryBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  paidCount: { fontSize: 12, fontWeight: "700", color: ACCENT },
  collected: { fontSize: 12, color: "#6B7280" },

  memberRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
  },
  memberDivider: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#F3F4F6",
  },
  nameRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  memberName: {
    flexShrink: 1,
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },
  managerTag: {
    backgroundColor: "#EDE9FE",
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
  },
  managerTagText: { fontSize: 10, fontWeight: "700", color: ACCENT },
  share: { fontSize: 13, color: "#6B7280", marginTop: 2 },

  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
    borderWidth: 1,
  },
  chipPaid: { backgroundColor: "#ECFDF5", borderColor: "#A7F3D0" },
  chipUnpaid: { backgroundColor: "#FFFBEB", borderColor: "#FDE68A" },
  chipText: { fontSize: 12, fontWeight: "700" },
  chipTextPaid: { color: "#047857" },
  chipTextUnpaid: { color: "#B45309" },

  resetWrap: { alignSelf: "center", marginTop: 6 },
  reset: { fontSize: 13, color: "#9CA3AF", textDecorationLine: "underline" },
});
