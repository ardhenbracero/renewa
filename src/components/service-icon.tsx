import { StyleSheet, Text, View } from "react-native";
import Svg, { Path, SvgXml } from "react-native-svg";

import { colorForName, InitialsAvatar } from "@/components/InitialsAvatar";
import type { ThemeColors } from "@/constants/palette";
import { getService, type ServiceEntry } from "@/constants/service-catalog";
import { useThemedStyles } from "@/hooks/use-themed-styles";

// Services that aren't in the catalog store their chosen tile color in
// iconSlug as "custom:#RRGGBB", so no extra database column is needed.
const CUSTOM_PREFIX = "custom:";

export function customIconSlug(color: string): string {
  return `${CUSTOM_PREFIX}${color}`;
}

function customColor(iconSlug: string | null | undefined): string | null {
  return iconSlug?.startsWith(CUSTOM_PREFIX)
    ? iconSlug.slice(CUSTOM_PREFIX.length)
    : null;
}

// The one color that represents a subscription (calendar dots, legends)
export function serviceColor(
  name: string,
  iconSlug: string | null | undefined,
): string {
  return customColor(iconSlug) ?? getService(iconSlug)?.color ?? colorForName(name);
}

// Logo for any subscription: catalog logo, custom-color initials, or
// name-based initials as the last fallback. Always use this, not the catalog
// directly.
export function ServiceIcon({
  name,
  iconSlug,
  size = 40,
}: {
  name: string;
  iconSlug?: string | null;
  size?: number;
}) {
  const service = getService(iconSlug);
  if (service) return <ServiceLogo service={service} size={size} />;
  return (
    <InitialsAvatar
      name={name}
      size={size}
      color={customColor(iconSlug) ?? undefined}
    />
  );
}

export function ServiceLogo({
  service,
  size = 40,
}: {
  service: ServiceEntry;
  size?: number;
}) {
  const styles = useThemedStyles(makeStyles);
  const circle = { width: size, height: size, borderRadius: size / 2 };
  const { logo } = service;

  // Full-color logos need a white tile (with a hairline so it shows on white cards)
  if (logo.kind === "svg") {
    return (
      <View style={[styles.circle, styles.whiteTile, circle]}>
        <SvgXml xml={logo.xml} width={size * 0.56} height={size * 0.56} />
      </View>
    );
  }

  return (
    <View
      style={[styles.circle, styles.brandTile, circle, { backgroundColor: service.color }]}
    >
      {logo.kind === "glyph" ? (
        <Svg width={size * 0.52} height={size * 0.52} viewBox="0 0 24 24">
          <Path d={logo.path} fill="#FFFFFF" />
        </Svg>
      ) : (
        <Text
          numberOfLines={1}
          style={{
            color: logo.fg ?? "#FFFFFF",
            fontWeight: "800",
            // Shrink longer marks ("hulu", "prime") so they fit the circle
            fontSize:
              size * (logo.text.length <= 2 ? 0.4 : logo.text.length <= 3 ? 0.32 : 0.25),
          }}
        >
          {logo.text}
        </Text>
      )}
    </View>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    circle: { alignItems: "center", justifyContent: "center", overflow: "hidden" },
    whiteTile: {
      backgroundColor: "#FFFFFF",
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: c.border,
    },
    // Keeps black brand tiles (Apple, X, GitHub) visible on dark cards
    brandTile: {
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: c.cardBorder,
    },
  });
