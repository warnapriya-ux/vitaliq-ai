const TONES = {
  green: "bg-emerald-400/15 text-emerald-300 ring-emerald-400/25",
  yellow: "bg-amber-400/15 text-amber-300 ring-amber-400/25",
  red: "bg-rose-500/15 text-rose-300 ring-rose-400/25",
  blue: "bg-sky-400/15 text-sky-300 ring-sky-400/25",
  purple: "bg-violet-400/15 text-violet-300 ring-violet-400/25",
  gray: "bg-white/8 text-white/50 ring-white/15",
};

export default function StatusPill({ children, tone = "gray" }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium capitalize ring-1 ${TONES[tone] ?? TONES.gray}`}
    >
      {String(children ?? "").replace(/_/g, " ")}
    </span>
  );
}

export const statusTone = (status) =>
  ({
    active: "green",
    approved: "green",
    paid: "green",
    completed: "green",
    pending: "yellow",
    requested: "yellow",
    ai_draft: "gray",
    scheduled: "blue",
    failed: "red",
    suspended: "red",
    expired: "red",
    cancelled: "gray",
    refunded: "gray",
  })[status] ?? "gray";