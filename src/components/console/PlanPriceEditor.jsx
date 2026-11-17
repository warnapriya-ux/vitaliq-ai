import { useEffect, useState } from "react";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { base44 } from "@/api/base44Client";
import Panel from "@/components/console/Panel";
import { PLAN_TIERS } from "@/lib/health";
import { CYCLES, amountFor, perMonth } from "@/lib/pricing";

const FIELDS = ["monthly", "quarterly", "annual"];

export default function PlanPriceEditor() {
  const [rows, setRows] = useState(null);
  const [savingId, setSavingId] = useState("");

  useEffect(() => {
    load().catch((error) => {
      console.error(error);
      setRows([]);
    });
  }, []);

  async function load() {
    const page = await base44.entities.PlanPrice.list({ limit: 50 });
    const existing = page.items ?? [];
    const missing = PLAN_TIERS.filter((tier) => !existing.some((row) => row.plan === tier.id));
    const created = [];
    for (const tier of missing) {
      created.push(
        await base44.entities.PlanPrice.create({
          plan: tier.id,
          currency: "USD",
          monthly: tier.price,
          quarterly: tier.price * 3,
          annual: tier.price * 10,
        }),
      );
    }
    const order = PLAN_TIERS.map((tier) => tier.id);
    setRows([...existing, ...created].sort((a, b) => order.indexOf(a.plan) - order.indexOf(b.plan)));
  }

  function update(id, field, value) {
    setRows((current) => current.map((row) => (row.id === id ? { ...row, [field]: value } : row)));
  }

  async function save(row) {
    setSavingId(row.id);
    try {
      await base44.entities.PlanPrice.update(row.id, {
        currency: (row.currency || "USD").toUpperCase(),
        monthly: Number(row.monthly) || 0,
        quarterly: Number(row.quarterly) || 0,
        annual: Number(row.annual) || 0,
      });
      toast.success(`${row.plan} pricing saved`);
      await load();
    } catch (error) {
      console.error(error);
      toast.error("Could not save the pricing.");
    } finally {
      setSavingId("");
    }
  }

  if (rows === null) {
    return (
      <Panel title="Plan pricing">
        <div className="flex items-center gap-2 py-4 text-[12px] text-white/40">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading prices
        </div>
      </Panel>
    );
  }

  return (
    <Panel
      title="Plan pricing"
      subtitle="Set what members are charged for each billing cycle. New requests use these amounts."
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[620px] text-left text-[12px]">
          <thead>
            <tr className="text-[10px] uppercase tracking-wider text-white/25">
              <th className="pb-2 font-medium">Plan</th>
              {CYCLES.map((cycle) => (
                <th key={cycle.id} className="pb-2 font-medium">{cycle.label}</th>
              ))}
              <th className="pb-2 font-medium">Currency</th>
              <th className="pb-2 font-medium" />
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-t border-white/5 text-white/70">
                <td className="py-2.5 pr-3">
                  <p className="capitalize text-white">{row.plan}</p>
                  <p className="text-[10px] text-white/30">
                    {amountFor(row, null, "annual") > 0
                      ? `$${perMonth(row.annual ?? 0, "annual")}/mo if billed yearly`
                      : "No charge"}
                  </p>
                </td>
                {FIELDS.map((field) => (
                  <td key={field} className="py-2.5 pr-3">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={row[field] ?? 0}
                      onChange={(event) => update(row.id, field, event.target.value)}
                      className="h-9 w-24 rounded-lg border border-white/10 bg-[#0b1220] px-2 text-[12px] text-white/80"
                    />
                  </td>
                ))}
                <td className="py-2.5 pr-3">
                  <input
                    value={row.currency || "USD"}
                    onChange={(event) => update(row.id, "currency", event.target.value)}
                    className="h-9 w-20 rounded-lg border border-white/10 bg-[#0b1220] px-2 text-[12px] uppercase text-white/80"
                  />
                </td>
                <td className="py-2.5">
                  <button
                    type="button"
                    disabled={savingId === row.id}
                    onClick={() => save(row)}
                    className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-900 disabled:opacity-50"
                  >
                    {savingId === row.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
                    Save
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-[10px] leading-relaxed text-white/30">
        Existing subscriptions keep the amount they were agreed at. The free plan should stay at zero.
      </p>
    </Panel>
  );
}