export type SplitMember = { id: number; isManager: boolean; paid: boolean };

// All math is done in cents so shares always add up to the exact total.
// Any leftover cents go to the manager.
export function computeSplit(total: number, members: SplitMember[]) {
  const count = members.length;
  const totalCents = Math.round(total * 100);
  const base = count ? Math.floor(totalCents / count) : 0;
  const remainder = count ? totalCents - base * count : 0;
  const managerId = (members.find((m) => m.isManager) ?? members[0])?.id;

  const shares: Record<number, number> = {};
  let collectedCents = 0;

  for (const m of members) {
    const cents = base + (m.id === managerId ? remainder : 0);
    shares[m.id] = cents / 100;
    if (m.paid) collectedCents += cents;
  }

  return {
    shares,
    count,
    eachAmount: base / 100,
    collected: collectedCents / 100,
    paidCount: members.filter((m) => m.paid).length,
  };
}

export function previewEach(total: number, people: number) {
  if (people <= 0) return 0;
  return Math.floor(Math.round(total * 100) / people) / 100;
}
