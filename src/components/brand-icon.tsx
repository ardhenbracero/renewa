import Svg, { Path } from "react-native-svg";
import * as simpleIcons from "simple-icons";

function lookupIcon(slug: string) {
  return (simpleIcons as any)[
    `si${slug.charAt(0).toUpperCase()}${slug.slice(1)}`
  ];
}

export function hasBrandIcon(slug: string): boolean {
  return !!lookupIcon(slug);
}

export function getBrandHex(slug: string): string | null {
  const icon = lookupIcon(slug);
  return icon ? `#${icon.hex}` : null;
}

export function BrandIcon({
  slug,
  size = 24,
  color, // optional override — e.g. "white" when placed on a colored badge
}: {
  slug: string;
  size?: number;
  color?: string;
}) {
  const icon = lookupIcon(slug);
  if (!icon) return null;

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d={icon.path} fill={color ?? `#${icon.hex}`} />
    </Svg>
  );
}
