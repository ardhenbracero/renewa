import { Alert } from "react-native";

// The only place that talks to the App Store. Not connected yet: real
// purchases need an Apple Developer account, a non-consumable product in App
// Store Connect, and an EAS development build (Expo Go cannot buy).
//
// TODO(Pro 1.1): implement with StoreKit via `expo-iap` (not RevenueCat, which
// sends purchase data to its servers and would break "on-device only"):
//   - purchasePro: request the product, finish the transaction, return true
//   - restorePurchases: check the Apple ID's past purchases for the product
//   - read the localized price to replace PRO_PRICE_LABEL

export const PRO_PRODUCT_ID = "renewa.pro.lifetime";

// Returns true when Pro should be unlocked
export async function purchasePro(): Promise<boolean> {
  if (__DEV__) return confirmTestPurchase("Unlock Renewa Pro?");
  notAvailableYet();
  return false;
}

// Returns true when a previous Pro purchase was found
export async function restorePurchases(): Promise<boolean> {
  if (__DEV__) return confirmTestPurchase("Restore Renewa Pro?");
  notAvailableYet();
  return false;
}

// Development builds only: simulates the App Store so the flow can be tested
function confirmTestPurchase(title: string): Promise<boolean> {
  return new Promise((resolve) =>
    Alert.alert(title, "Test mode: no real payment is made.", [
      { text: "Cancel", style: "cancel", onPress: () => resolve(false) },
      { text: "Unlock", onPress: () => resolve(true) },
    ]),
  );
}

function notAvailableYet() {
  Alert.alert(
    "Not available yet",
    "Renewa Pro purchases aren't available in this version.",
  );
}
