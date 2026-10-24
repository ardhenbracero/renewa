import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";

import { formatCurrency } from "@/utils/format";
import { getNextRenewalAfter, getUpcomingRenewalDate } from "@db/dateLogic";
import type { Subscription } from "@db/schema";
import { getActiveSubscriptions } from "@db/subscriptions";

// Local, on-device reminders only: nothing is sent to a server.
// One reminder per active subscription, at 9:00 AM the day before it renews.

const ENABLED_KEY = "settings:reminders";
const REMIND_HOUR = 9;
const MAX_SCHEDULED = 60; // iOS keeps at most 64 pending local notifications

// Show reminders as a banner even while the app is open
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export type ReminderPermission = "granted" | "denied" | "undetermined";

export async function getRemindersEnabled(): Promise<boolean> {
  try {
    // On by default; only an explicit "false" turns reminders off
    return (await AsyncStorage.getItem(ENABLED_KEY)) !== "false";
  } catch {
    return true;
  }
}

export async function setRemindersEnabled(enabled: boolean): Promise<void> {
  try {
    await AsyncStorage.setItem(ENABLED_KEY, String(enabled));
  } catch (e) {
    console.warn("Failed to save reminder setting", e);
  }
  await syncReminders();
}

export async function getReminderPermission(): Promise<ReminderPermission> {
  const { granted, canAskAgain } = await Notifications.getPermissionsAsync();
  if (granted) return "granted";
  return canAskAgain ? "undetermined" : "denied";
}

// Asks iOS once; afterwards the user has to change it in iOS Settings
async function ensurePermission(): Promise<boolean> {
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  if (!current.canAskAgain) return false;
  const asked = await Notifications.requestPermissionsAsync();
  return asked.granted;
}

// 9:00 AM local time on the day before `renewal`
function reminderTime(renewal: Date): Date {
  return new Date(
    renewal.getFullYear(),
    renewal.getMonth(),
    renewal.getDate() - 1,
    REMIND_HOUR,
  );
}

// The first reminder still in the future: the upcoming renewal's, or the
// one after it if today's 9 AM has already passed
function nextReminderTime(sub: Subscription): Date | null {
  const now = Date.now();
  for (const renewal of [getUpcomingRenewalDate(sub), getNextRenewalAfter(sub)]) {
    const fireAt = reminderTime(renewal);
    if (fireAt.getTime() > now) return fireAt;
  }
  return null;
}

function reminderContent(sub: Subscription) {
  const price = formatCurrency(sub.amount, sub.currency);
  if (sub.isTrial) {
    return {
      title: `Your ${sub.name} trial ends tomorrow`,
      body: sub.autoPay
        ? `Cancel today if you don't want to be charged ${price}.`
        : "It won't auto-renew. Renew it if you want to keep it.",
    };
  }
  return {
    title: `${sub.name} renews tomorrow`,
    body: sub.autoPay
      ? `${price} will be charged automatically.`
      : `${price} is due. Remember to pay it.`,
  };
}

let lastPlan: string | null = null;
let queue: Promise<void> = Promise.resolve();

// Rebuilds all scheduled reminders from the database. Safe to call often:
// calls run one at a time, and nothing is rescheduled if the plan is unchanged.
export function syncReminders(): Promise<void> {
  queue = queue.then(runSync, runSync);
  return queue;
}

async function runSync() {
  try {
    const enabled = await getRemindersEnabled();
    let subs = enabled ? getActiveSubscriptions() : [];
    if (subs.length > 0 && !(await ensurePermission())) subs = [];

    const plan = subs
      .map((sub) => ({ sub, fireAt: nextReminderTime(sub) }))
      .filter((p): p is { sub: Subscription; fireAt: Date } => !!p.fireAt)
      .sort((a, b) => a.fireAt.getTime() - b.fireAt.getTime())
      .slice(0, MAX_SCHEDULED)
      .map(({ sub, fireAt }) => ({
        id: sub.id,
        fireAt,
        ...reminderContent(sub),
      }));

    const key = JSON.stringify(plan);
    if (key === lastPlan) return;

    await Notifications.cancelAllScheduledNotificationsAsync();
    for (const p of plan) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: p.title,
          body: p.body,
          data: { subscriptionId: p.id },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: p.fireAt,
        },
      });
    }
    lastPlan = key;
  } catch (e) {
    console.warn("Failed to sync reminders", e);
  }
}
