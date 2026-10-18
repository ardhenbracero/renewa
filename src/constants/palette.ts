const light = {
  background: "#FAF9F6",
  surface: "#FFFFFF",
  backgroundElement: "#FFFFFF", // what ThemedView type="backgroundElement" uses
  surfaceMuted: "#F3F4F6",
  surfaceWarm: "#F3F1EC",
  border: "#E5E7EB",
  divider: "#F3F4F6",

  text: "#111827",
  textSecondary: "#6B7280",
  textTertiary: "#9CA3AF",
  onAccent: "#FFFFFF",

  accent: "#5B21B6", // button and fill color
  accentText: "#5B21B6", // violet text and icons on a surface
  accentSoft: "#EDE9FE", // tinted badge backgrounds

  amberSoft: "#FEF3C7",
  amberBorder: "#FDE68A",
  amberText: "#B45309",
  redSoft: "#FEE2E2",
  redBorder: "#FECACA",
  redText: "#DC2626",
  greenSoft: "#ECFDF5",
  greenBorder: "#A7F3D0",
  greenText: "#047857",

  overlay: "rgba(0,0,0,0.4)",
  shadowOpacity: 0.06,
  cardBorder: "transparent",
  cardElevation: 2,
};

export type ThemeColors = typeof light;

const dark: ThemeColors = {
  background: "#0C0C12",
  surface: "#17171F",
  backgroundElement: "#17171F",
  surfaceMuted: "#22222C",
  surfaceWarm: "#1F1F28",
  border: "#2B2B38",
  divider: "#242430",

  text: "#F5F5F8",
  textSecondary: "#A3A3B5",
  textTertiary: "#77778A",
  onAccent: "#FFFFFF",

  accent: "#6D28D9",
  accentText: "#A78BFA",
  accentSoft: "#2B2150",

  amberSoft: "#3A2C0E",
  amberBorder: "#5C4513",
  amberText: "#FBBF24",
  redSoft: "#3F1A1A",
  redBorder: "#6B2626",
  redText: "#F87171",
  greenSoft: "#0F2F25",
  greenBorder: "#14532D",
  greenText: "#34D399",

  overlay: "rgba(0,0,0,0.6)",
  shadowOpacity: 0,
  cardBorder: "#2B2B38", // shadows disappear on dark, so cards get a thin border
  cardElevation: 0,
};

export const palette = { light, dark };
