import { BrandIcon, getBrandHex, hasBrandIcon } from "@/components/brand-icon";
import { InitialsAvatar } from "@/components/InitialsAvatar";
import { ThemedText } from "@/components/themed-text";
import { StyleSheet, TextInput, View } from "react-native";

export function ServicePlanNameSection({
  name,
  onChangeName,
  iconSlug,
}: {
  name: string;
  onChangeName: (value: string) => void;
  iconSlug: string | null;
}) {
  const showBrandIcon = iconSlug && hasBrandIcon(iconSlug);
  const badgeColor = iconSlug ? getBrandHex(iconSlug) : null;

  return (
    <View style={styles.row}>
      <View style={styles.label}>
        <ThemedText style={styles.labelText}>SERVICE / PLAN NAME</ThemedText>
      </View>

      <View style={styles.inputRow}>
        <View
          style={[styles.badge, { backgroundColor: badgeColor ?? "#E5E7EB" }]}
        >
          {showBrandIcon ? (
            <BrandIcon slug={iconSlug!} size={18} color="white" />
          ) : (
            <InitialsAvatar name={name || "?"} size={32} />
          )}
        </View>

        <TextInput
          style={styles.input}
          placeholder="Netflix"
          placeholderTextColor="#9CA3AF"
          value={name}
          onChangeText={onChangeName}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { gap: 10 },
  label: {},
  labelText: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
    color: "#9CA3AF",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 2,
    borderColor: "rgb(236,230,223, 0.5)",
    backgroundColor: "#F3F4F6",
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 12,
  },
  badge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    padding: 0,
  },
});
