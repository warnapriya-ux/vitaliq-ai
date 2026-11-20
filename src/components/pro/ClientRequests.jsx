import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Check, X } from "lucide-react";
import { respondToRequest } from "@/lib/professional-fns";
import { Button } from "@/components/ui/button";

export default function ClientRequests({ track, links, onDone }) {
  const respond = useServerFn(respondToRequest);
  const [busy, setBusy] = useState("");

  async function act(link, accept) {
    setBusy(link.id);
    try {
      await respond({ data: { track, linkId: link.id, accept } });
      toast.success(accept ? `${link.client_name} is now your client.` : "Request declined.");
      await onDone();
    } catch (error) {
      toast.error(error?.message || "Could not update this request.");
    } finally {
      setBusy("");
    }
  }

  if (!links.length) return null;

  return (
    <div className="space-y-2">
      {links.map((link) => (
        <div key={link.id} className="rounded-2xl border border-amber-400/20 bg-amber-400/[0.05] p-3">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-[12px] font-medium text-white/90">{link.client_name}</p>
              <p className="truncate text-[10px] text-white/40">{link.goal || "No goal shared yet"}</p>
              {link.note && <p className="mt-1 line-clamp-2 text-[10px] text-white/35">{link.note}</p>}
            </div>
            <span className="shrink-0 rounded-full bg-amber-400/12 px-2 py-0.5 text-[9px] font-semibold text-amber-300">Request</span>
          </div>
          <div className="mt-2 flex gap-2">
            <Button
              size="sm"
              onClick={() => act(link, true)}
              disabled={busy === link.id}
              className="h-9 flex-1 rounded-lg bg-emerald-400 text-[11px] font-semibold text-slate-950 hover:bg-emerald-300"
            >
              <Check className="mr-1 h-3.5 w-3.5" /> Accept
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => act(link, false)}
              disabled={busy === link.id}
              className="h-9 flex-1 rounded-lg border-white/15 bg-transparent text-[11px] text-white/60"
            >
              <X className="mr-1 h-3.5 w-3.5" /> Decline
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}