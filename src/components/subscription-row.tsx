import { useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";

import { ServiceIcon } from "@/components/service-icon";
import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";
import { cycleLabel, formatCurrency, formatShortDate } from "@/utils/format";
import { getUpcomingRenewalDate } from "@db/dateLogic";
import { Subscription } from "@db/schema";

export function SubscriptionRow({
  subscription,
}: {
  subscription: Subscription;
}) {
  const router = useRouter();
  const renewalDate = getUpcomingRenewalDate(subscription);

  return (
    <Pressable
      style={styles.row}
      onPress={() =>
        router.push({
          pathname: "/add-subscription",
          params: { id: String(subscription.id) },
        })
      }
    >
      <ServiceIcon name={subscription.name} iconSlug={subscription.iconSlug} />
      <View style={styles.meta}>
        <ThemedText type="default" numberOfLines={1}>
          {subscription.name}
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {subscription.category} · {formatShortDate(renewalDate)}
        </ThemedText>
      </View>
      <View style={styles.pricing}>
        <ThemedText type="default">
          {formatCurrency(subscription.amount, subscription.currency)}
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {cycleLabel(subscription.billingCycle)}
        </ThemedText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.three,
    gap: Spacing.three,
  },
  meta: {
    flex: 1,
    gap: 2,
  },
  pricing: {
    alignItems: "flex-end",
    flexDirection: "row",
    gap: 2,
  },
});
