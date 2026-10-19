import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import { Appearance, useColorScheme } from "react-native";

export type ThemePreference = "system" | "light" | "dark";
const KEY = "settings:theme";

type ThemeContextValue = {
  loaded: boolean;
  preference: ThemePreference;
  scheme: "light" | "dark";
  setPreference: (p: ThemePreference) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreferenceState] = useState<ThemePreference>("system");
  const [loaded, setLoaded] = useState(false);
  const systemScheme = useColorScheme();

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(KEY);
        if (saved === "light" || saved === "dark" || saved === "system") {
          setPreferenceState(saved);
          Appearance.setColorScheme((saved === "system" ? null : saved) as any);
        }
      } catch (e) {
        console.warn("Failed to load theme", e);
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  const setPreference = useCallback((p: ThemePreference) => {
    setPreferenceState(p);
    // Also tells native UI (alerts, keyboard, pickers) which mode to use
    Appearance.setColorScheme((p === "system" ? null : p) as any);
    AsyncStorage.setItem(KEY, p).catch((e) =>
      console.warn("Failed to save theme", e),
    );
  }, []);

  const scheme: "light" | "dark" =
    preference === "system"
      ? systemScheme === "dark"
        ? "dark"
        : "light"
      : preference;

  const value = useMemo(
    () => ({ loaded, preference, scheme, setPreference }),
    [loaded, preference, scheme, setPreference],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useAppTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useAppTheme must be used inside ThemeProvider");
  return ctx;
}
