import { ServiceIcon } from "@/components/service-icon";
import { ThemedText } from "@/components/themed-text";
import { formatCurrency } from "@/utils/format";
import { router } from "expo-router";
import { FlatList, Pressable, StyleSheet, View } from "react-native";

// TEMPORARY — hardcoded test data, remove once confirmed working
const FAKE_DATA = [
  {
    id: 1,
    name: "Netflix",
    iconSlug: "netflix",
    amount: 15.49,
    currency: "USD",
  },
  {
    id: 2,
    name: "Spotify",
    iconSlug: "spotify",
    amount: 9.99,
    currency: "USD",
  },
  { id: 3, name: "My Local Gym", iconSlug: null, amount: 40, currency: "USD" },
];

export function RenewingSoonSection({ renewingSoon }: { renewingSoon: any[] }) {
  const data = FAKE_DATA; // TEMPORARY — ignoring the real prop for now

  if (data.length === 0) return null;

  return (
    <View style={styles.wrapper}>
      <ThemedText style={styles.sectionTitle}>Renewing soon</ThemedText>

      <FlatList
        data={data}
        keyExtractor={(item) => String(item.id)}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() => router.push(`/add-subscription?id=${item.id}`)}
          >
            <ServiceIcon name={item.name} iconSlug={item.iconSlug} size={36} />
            <ThemedText style={styles.name} numberOfLines={1}>
              {item.name}
            </ThemedText>
            <ThemedText style={styles.amount}>
              {formatCurrency(item.amount, item.currency)}
            </ThemedText>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginTop: 24 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  row: {
    paddingHorizontal: 20,
    gap: 12,
  },
  card: {
    width: 120,
    height: 120,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 12,
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  name: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111827",
  },
  amount: {
    fontSize: 12,
    color: "#6B7280",
  },
});
