import { ServiceIcon } from "@/components/service-icon";
import { ThemedText } from "@/components/themed-text";
import type { ThemeColors } from "@/constants/palette";
import { daysUntil } from "@/hooks/use-subscriptions";
import { useThemedStyles } from "@/hooks/use-themed-styles";
import { formatCurrency } from "@/utils/format";
import { getUpcomingRenewalDate } from "@db/dateLogic";
import { router } from "expo-router";

import { FlatList, Pressable, StyleSheet, View } from "react-native";

export function RenewingSoonSection({ renewingSoon }: { renewingSoon: any[] }) {
  const styles = useThemedStyles(makeStyles);

  return (
    <View style={styles.wrapper}>
      <View style={styles.headerRow}>
        <ThemedText style={styles.sectionTitle}>Renewing soon</ThemedText>
        <View style={styles.countPill}>
          <ThemedText style={styles.countPillText}>
            {renewingSoon.length} this week
          </ThemedText>
        </View>
      </View>

      <FlatList
        data={renewingSoon}
        keyExtractor={(item) => String(item.id)}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
        renderItem={({ item }) => {
          const days = daysUntil(getUpcomingRenewalDate(item));
          const isUrgent = days <= 0;
          const dueLabel =
            days <= 0 ? "Today" : days === 1 ? "1 day" : `${days} days`;

          return (
            <Pressable
              style={styles.card}
              onPress={() => router.push(`/subscription-details?id=${item.id}`)}
            >
              <View style={styles.titleRow}>
                <ServiceIcon
                  name={item.name}
                  iconSlug={item.iconSlug}
                  size={36}
                />

                <View
                  style={[styles.duePill, isUrgent && styles.duePillUrgent]}
                >
                  <ThemedText
                    style={[
                      styles.duePillText,
                      isUrgent && styles.duePillTextUrgent,
                    ]}
                  >
                    {dueLabel}
                  </ThemedText>
                </View>
              </View>

              <ThemedText style={styles.name} numberOfLines={1}>
                {item.name}
              </ThemedText>
              <ThemedText style={styles.nameCategory}>
                {item.category}
              </ThemedText>
              <View style={styles.hr} />
              <View style={styles.titleRow}>
                <ThemedText style={styles.cost}> cost </ThemedText>
                <ThemedText style={styles.amount}>
                  {formatCurrency(item.amount, item.currency)}
                </ThemedText>
              </View>
            </Pressable>
          );
        }}
      />
    </View>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    wrapper: { marginBottom: 24 },
    headerRow: {
      flexDirection: "row",
      gap: 15,
      alignItems: "baseline",
      marginBottom: 12,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: c.text,
      marginBottom: 12,
    },
    row: {
      gap: 12,
    },
    card: {
      width: 140,
      height: 140,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.surface,
      borderRadius: 18,
      padding: 10,
      justifyContent: "space-between",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: c.shadowOpacity,
      shadowRadius: 10,
      elevation: c.cardElevation,
      marginBottom: 15,
    },
    countPill: {
      backgroundColor: c.amberSoft,
      borderWidth: 2,
      borderColor: c.amberBorder,
      borderRadius: 30,
      paddingHorizontal: 10,
      paddingVertical: 4,
    },
    countPillText: {
      color: c.text,
      fontSize: 12,
      fontWeight: "600",
    },
    name: {
      fontSize: 13,
      fontWeight: "700",
      color: c.text,
    },
    amount: {
      fontSize: 12,
      color: c.text,
    },
    cost: {
      fontSize: 12,
      color: c.textSecondary,
    },
    nameCategory: {
      fontSize: 12,
      lineHeight: 15,
      color: c.textSecondary,
    },
    duePill: {
      alignSelf: "flex-start",
      backgroundColor: c.amberSoft,
      borderWidth: 2,
      borderColor: c.amberBorder,
      borderRadius: 30,
      paddingHorizontal: 8,
      paddingVertical: 1,
    },
    duePillUrgent: {
      backgroundColor: c.redSoft,
      borderColor: c.redBorder,
    },
    duePillText: {
      fontSize: 12,
      fontWeight: "600",
      color: c.amberText,
    },
    duePillTextUrgent: {
      color: c.redText,
    },
    titleRow: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
    },
    hr: {
      borderBottomColor: c.border,
      borderBottomWidth: 1,
    },
  });
