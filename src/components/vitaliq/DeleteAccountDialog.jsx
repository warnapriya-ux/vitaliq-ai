import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const USER_ENTITIES = [
  "HealthProfile",
  "Measurement",
  "DailyLog",
  "Plan",
  "Subscription",
  "Payment",
  "CoachMessage",
  "Consultation",
  "TrainerSession",
];

async function purgeUserData(userId) {
  for (const name of USER_ENTITIES) {
    await base44.entities[name].deleteMany({ created_by_id: userId });
  }
}

export default function DeleteAccountDialog() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  async function remove() {
    if (!user?.id) return;
    setBusy(true);
    try {
      await purgeUserData(user.id);
      await logout();
      navigate({ to: "/login" });
    } catch (error) {
      console.error(error);
      toast.error("We could not delete your data. Please try again.");
      setBusy(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="flex w-full items-center justify-center gap-2 rounded-full border border-rose-400/25 py-3 text-xs font-semibold text-rose-300/80 transition hover:bg-rose-500/10"
        >
          <Trash2 className="h-3.5 w-3.5" /> Delete account
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-[360px] rounded-2xl border-white/10 bg-[#0b1220]">
        <DialogHeader>
          <DialogTitle className="font-heading text-base text-white">Delete your account?</DialogTitle>
          <DialogDescription className="text-[11px] leading-relaxed text-white/50">
            This clears your profile, measurements, daily logs, plans, coaching messages, consultations and training sessions, then signs you out. It cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <button
            type="button"
            onClick={() => setOpen(false)}
            disabled={busy}
            className="rounded-full border border-white/10 px-4 py-2.5 text-xs font-semibold text-white/60 disabled:opacity-50"
          >
            Keep my account
          </button>
          <button
            type="button"
            onClick={remove}
            disabled={busy}
            className="flex items-center justify-center gap-2 rounded-full bg-rose-500/90 px-4 py-2.5 text-xs font-semibold text-white disabled:opacity-60"
          >
            {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Delete everything"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}