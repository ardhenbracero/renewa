import { useCallback, useEffect, useState } from "react";

import {
    addMember,
    deleteMember,
    getMembers,
    resetPaidForSubscription,
    setMemberPaid,
} from "@db/members";
import type { Member } from "@db/schema";

export function useMembers(subscriptionId: number, managerName: string) {
  const [members, setMembers] = useState<Member[]>([]);

  const refresh = useCallback(() => {
    setMembers(getMembers(subscriptionId));
  }, [subscriptionId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addNewMember = useCallback(
    (name: string) => {
      // First member added: create the manager's own row so the split includes them
      if (getMembers(subscriptionId).length === 0) {
        addMember(subscriptionId, managerName.trim() || "You", true);
      }
      addMember(subscriptionId, name.trim(), false);
      refresh();
    },
    [subscriptionId, managerName, refresh],
  );

  const removeMember = useCallback(
    (id: number) => {
      deleteMember(id);
      const remaining = getMembers(subscriptionId);
      // Only the manager left means no split anymore: clear it
      if (remaining.length === 1 && remaining[0].isManager) {
        deleteMember(remaining[0].id);
      }
      refresh();
    },
    [subscriptionId, refresh],
  );

  const togglePaid = useCallback(
    (member: Member) => {
      setMemberPaid(member.id, !member.paid);
      refresh();
    },
    [refresh],
  );

  const resetPaid = useCallback(() => {
    resetPaidForSubscription(subscriptionId);
    refresh();
  }, [subscriptionId, refresh]);

  return {
    members,
    addNewMember,
    removeMember,
    togglePaid,
    resetPaid,
    refresh,
  };
}
