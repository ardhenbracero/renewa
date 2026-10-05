import { StyleSheet, View } from "react-native";

export function DetailsCard({ children }: { children: React.ReactNode }) {
  return <View style={styles.card}>{children}</View>;
}

export function DetailsSection({
  children,
  last,
}: {
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <View style={[styles.section, last && styles.sectionLast]}>{children}</View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 20,
    backgroundColor: "#fff",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  section: {
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#F3F4F6",
  },
  sectionLast: {
    borderBottomWidth: 0,
  },
});
