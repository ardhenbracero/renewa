import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";

const NAME_KEY = "profile:name";
const ONBOARDED_KEY = "profile:onboarded";

type ProfileContextValue = {
  loaded: boolean;
  onboarded: boolean;
  name: string;
  completeOnboarding: (name: string) => Promise<void>;
};

const ProfileContext = createContext<ProfileContextValue | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [loaded, setLoaded] = useState(false);
  const [onboarded, setOnboarded] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const [savedName, savedFlag] = await Promise.all([
          AsyncStorage.getItem(NAME_KEY),
          AsyncStorage.getItem(ONBOARDED_KEY),
        ]);
        setName(savedName ?? "");
        setOnboarded(savedFlag === "true");
      } catch (e) {
        console.warn("Failed to load profile", e);
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  async function completeOnboarding(newName: string) {
    const trimmed = newName.trim();
    try {
      await AsyncStorage.multiSet([
        [NAME_KEY, trimmed],
        [ONBOARDED_KEY, "true"],
      ]);
    } catch (e) {
      console.warn("Failed to save profile", e);
    }
    setName(trimmed);
    setOnboarded(true);
  }

  return (
    <ProfileContext.Provider
      value={{ loaded, onboarded, name, completeOnboarding }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used inside ProfileProvider");
  return ctx;
}
