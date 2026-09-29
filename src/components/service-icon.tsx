import { StyleSheet, View } from "react-native";

import { BrandIcon, hasBrandIcon } from "@/components/brand-icon";
import { InitialsAvatar } from "@/components/InitialsAvatar";

export function ServiceIcon({
  name,
  iconSlug,
  size = 40,
}: {
  name: string;
  iconSlug?: string | null;
  size?: number;
}) {
  if (iconSlug && hasBrandIcon(iconSlug)) {
    return (
      <View
        style={[
          styles.circle,
          styles.brandCircle,
          { width: size, height: size, borderRadius: size / 2 },
        ]}
      >
        <BrandIcon slug={iconSlug} size={size * 0.55} />
      </View>
    );
  }

  return <InitialsAvatar name={name} size={size} />;
}

const styles = StyleSheet.create({
  circle: {
    alignItems: "center",
    justifyContent: "center",
  },
  brandCircle: {
    backgroundColor: "#F0F0F3",
  },
});
