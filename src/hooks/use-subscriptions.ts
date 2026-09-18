import { useCallback, useEffect, useState } from "react";

import { getUpcomingRenewalDate, toMonthlyAmount } from "@db/dateLogic";
import { NewSubscription, Subscription } from "@db/schema";
import {
  addSubscription,
  deleteSubscription,
  getActiveSubscriptions,
  updateSubscription,
} from "@db/subscriptions";

export function daysUntil(date: Date): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  const diffMs = target.getTime() - today.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

export function useSubscriptions() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    setLoading(true);
    const rows = getActiveSubscriptions();
    setSubscriptions(rows);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const sorted = [...subscriptions].sort(
    (a, b) =>
      getUpcomingRenewalDate(a).getTime() - getUpcomingRenewalDate(b).getTime(),
  );

  const monthlyTotal = subscriptions.reduce(
    (sum, sub) => sum + toMonthlyAmount(sub),
    0,
  );
  const yearlyTotal = monthlyTotal * 12;

  const renewingSoon = sorted.filter(
    (sub) => daysUntil(getUpcomingRenewalDate(sub)) <= 7,
  );

  function create(sub: NewSubscription) {
    addSubscription(sub);
    refresh();
  }

  function edit(id: number, sub: Partial<NewSubscription>) {
    updateSubscription(id, sub);
    refresh();
  }

  function remove(id: number) {
    deleteSubscription(id);
    refresh();
  }

  return {
    subscriptions: sorted,
    renewingSoon,
    monthlyTotal,
    yearlyTotal,
    loading,
    refresh,
    create,
    edit,
    remove,
  };
}
