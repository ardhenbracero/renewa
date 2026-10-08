import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StyleSheet,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { NameStep } from "@/components/onboarding/name-step";
import { OnboardingDots } from "@/components/onboarding/onboarding-dots";
import { WelcomeStep } from "@/components/onboarding/welcomeStep";
import { ThemedText } from "@/components/themed-text";
import { useProfile } from "@/context/profile-context";

const ACCENT = "#4338CA";

export default function OnboardingScreen() {
  const { completeOnboarding } = useProfile();
  const [step, setStep] = useState<0 | 1>(0);
  const [name, setName] = useState("");
  const canContinue = name.trim().length > 0;

  return (
    <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {step === 0 ? (
          <>
            <View style={{ flex: 1 }}>
              <WelcomeStep />
            </View>

            <View style={styles.bottom}>
              <OnboardingDots total={2} active={0} />
              <Pressable style={styles.primary} onPress={() => setStep(1)}>
                <ThemedText style={styles.primaryText}>Get Started</ThemedText>
                <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
              </Pressable>
              <View style={styles.footerRow}>
                <Ionicons
                  name="lock-closed-outline"
                  size={12}
                  color="#9CA3AF"
                />
                <ThemedText style={styles.footerText}>
                  On-device only · Offline safe · Zero trackers
                </ThemedText>
              </View>
            </View>
          </>
        ) : (
          <>
            <View style={styles.nameWrap}>
              <Pressable
                style={styles.back}
                onPress={() => setStep(0)}
                hitSlop={10}
              >
                <Ionicons name="arrow-back" size={22} color="#111827" />
              </Pressable>

              <View style={styles.metaRow}>
                <OnboardingDots total={2} active={1} />
                <View style={styles.devicePill}>
                  <Ionicons name="lock-closed" size={11} color="#4B5563" />
                  <ThemedText style={styles.devicePillText}>
                    On-device only
                  </ThemedText>
                </View>
              </View>

              <NameStep
                name={name}
                onChangeName={setName}
                onSubmit={() => canContinue && completeOnboarding(name)}
              />
            </View>

            <View style={{ flex: 1 }} />

            <View style={styles.bottom}>
              <Pressable
                style={[styles.primary, !canContinue && styles.primaryDisabled]}
                disabled={!canContinue}
                onPress={() => completeOnboarding(name)}
              >
                <ThemedText style={styles.primaryText}>Continue</ThemedText>
                <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
              </Pressable>
              <Pressable onPress={() => completeOnboarding("")} hitSlop={8}>
                <ThemedText style={styles.skip}>Skip for now</ThemedText>
              </Pressable>
            </View>
          </>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#FAF9F6" },
  nameWrap: { paddingHorizontal: 20, paddingTop: 8 },
  back: { width: 32, height: 32, justifyContent: "center" },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  devicePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#F3F1EC",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  devicePillText: { fontSize: 11, fontWeight: "600", color: "#4B5563" },
  bottom: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    gap: 14,
    alignItems: "center",
  },
  primary: {
    alignSelf: "stretch",
    height: 56,
    borderRadius: 28,
    backgroundColor: ACCENT,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: ACCENT,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  primaryDisabled: { opacity: 0.45 },
  primaryText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
  skip: { fontSize: 14, color: "#6B7280" },
  footerRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  footerText: { fontSize: 11, color: "#9CA3AF" },
});
