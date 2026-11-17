export const CYCLES = [
  { id: "monthly", label: "Monthly", months: 1 },
  { id: "quarterly", label: "Quarterly", months: 3 },
  { id: "annual", label: "Annual", months: 12 },
];

export function monthsFor(cycleId) {
  return CYCLES.find((cycle) => cycle.id === cycleId)?.months ?? 1;
}

export function cycleNoun(cycleId) {
  return { monthly: "per month", quarterly: "per 3 months", annual: "per year" }[cycleId] ?? "per month";
}

export function addMonthsISO(months) {
  const date = new Date();
  date.setMonth(date.getMonth() + months);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

// Price the super admin saved for this plan and cycle, falling back to the tier default.
export function amountFor(row, tier, cycleId) {
  const stored = Number(row?.[cycleId]);
  if (Number.isFinite(stored) && stored > 0) return stored;
  const monthly = Number(tier?.price) || 0;
  if (cycleId === "annual") return monthly * 10;
  if (cycleId === "quarterly") return monthly * 3;
  return monthly;
}

export function perMonth(amount, cycleId) {
  const months = monthsFor(cycleId);
  return Math.round(((Number(amount) || 0) / months) * 100) / 100;
}