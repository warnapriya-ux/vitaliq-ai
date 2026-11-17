import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Send } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { formatDate } from "@/lib/health";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function ClientProgressReview({ links, onSaved }) {
  const [logs, setLogs] = useState([]);
  const [openFor, setOpenFor] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const linksRef = useRef(links);
  linksRef.current = links;
  const clientKey = links.map((link) => link.client_user_id).join("|");

  const load = useCallback(async () => {
    const clientIds = linksRef.current.map((link) => link.client_user_id);
    if (!clientIds.length) return setLogs([]);
    const page = await base44.entities.DailyDietLog.filter(
      { client_user_id: { $in: clientIds } },
      { sort: "-log_date", limit: 100 },
    );
    setLogs(page.items ?? []);
  }, [clientKey]);

  useEffect(() => {
    load().catch((error) => console.error(error));
  }, [load]);

  async function send(link) {
    if (!message.trim()) return;
    setSending(true);
    try {
      await base44.entities.DietitianFeedback.create({
        dietitian_user_id: link.dietitian_user_id,
        dietitian_name: link.dietitian_name,
        client_user_id: link.client_user_id,
        client_name: link.client_name,
        kind: "advice",
        content: message.trim(),
      });
      toast.success(`Feedback sent to ${link.client_name}.`);
      setMessage("");
      setOpenFor("");
      await onSaved?.();
    } catch (error) {
      toast.error("Could not send the feedback.");
    } finally {
      setSending(false);
    }
  }

  if (!links.length) {
    return <p className="text-xs text-white/35">Accepted customers appear here with their daily nutrition.</p>;
  }

  return (
    <div className="space-y-2">
      {links.map((link) => {
        const mine = logs.filter((log) => log.client_user_id === link.client_user_id);
        const latest = mine[0];
        const missed = latest && (latest.meals_completed ?? 0) < (latest.meals_planned ?? 5);
        return (
          <div key={link.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-[12px] font-medium text-white/85">{link.client_name}</p>
                <p className="text-[10px] text-white/35">
                  {latest
                    ? `${formatDate(latest.log_date)} · ${latest.meals_completed ?? 0}/${latest.meals_planned ?? 5} meals · ${latest.water_l ?? 0}L · ${latest.weight ? `${latest.weight} kg` : "no weight"}`
                    : "No daily log yet"}
                </p>
              </div>
              {missed && (
                <span className="shrink-0 rounded-full bg-amber-400/12 px-2 py-0.5 text-[9px] font-semibold text-amber-300">
                  Missed meals
                </span>
              )}
            </div>
            {latest?.difficulties && (
              <p className="mt-1.5 rounded-lg bg-white/[0.03] p-2 text-[10px] text-white/45">Difficulties: {latest.difficulties}</p>
            )}
            {openFor === link.id ? (
              <div className="mt-2 space-y-1.5">
                <Textarea
                  rows={2}
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder="Encouragement, a food swap, or an updated instruction."
                  className="border-white/10 bg-[#0b1220] text-[11px] text-white"
                />
                <Button
                  onClick={() => send(link)}
                  disabled={sending}
                  className="h-9 w-full rounded-lg bg-emerald-400 text-[11px] font-semibold text-slate-950 hover:bg-emerald-300"
                >
                  <Send className="mr-1.5 h-3.5 w-3.5" /> Send feedback
                </Button>
              </div>
            ) : (
              <button
                onClick={() => setOpenFor(link.id)}
                className="mt-2 text-[10px] font-semibold text-emerald-300"
              >
                Send feedback →
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}