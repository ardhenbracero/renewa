import Svg, { Path } from "react-native-svg";
import * as simpleIcons from "simple-icons";

function toExportName(slug: string) {
  return `si${slug.charAt(0).toUpperCase()}${slug.slice(1)}`;
}

function lookupIcon(slug: string) {
  return (simpleIcons as any)[toExportName(slug)];
}

export function hasBrandIcon(slug: string): boolean {
  return !!lookupIcon(slug);
}

export function BrandIcon({
  slug,
  size = 24,
}: {
  slug: string;
  size?: number;
}) {
  const icon = lookupIcon(slug);
  if (!icon) return null;

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d={icon.path} fill={`#${icon.hex}`} />
    </Svg>
  );
}
