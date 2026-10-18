import { useMemo } from "react";

import type { ThemeColors } from "@/constants/palette";
import { useTheme } from "@/hooks/use-theme";

// Rebuilds a component's StyleSheet whenever the theme changes
export function useThemedStyles<T>(factory: (colors: ThemeColors) => T): T {
  const colors = useTheme();
  return useMemo(() => factory(colors), [colors, factory]);
}
