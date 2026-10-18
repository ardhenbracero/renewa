/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { useMemo } from "react";

import { palette } from "@/constants/palette";
import { Colors } from "@/constants/theme";
import { useAppTheme } from "@/context/theme-context";

export function useTheme() {
  const { scheme } = useAppTheme();
  // Old Colors keys stay available. The new palette wins wherever names overlap.
  return useMemo(() => ({ ...Colors[scheme], ...palette[scheme] }), [scheme]);
}
