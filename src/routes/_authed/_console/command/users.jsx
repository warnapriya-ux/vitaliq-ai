import { useCallback, useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Loader2, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { base44 } from "@/api/base44Client";
import Panel from "@/components/console/Panel";
import SelectSheet from "@/components/vitaliq/SelectSheet";
import SubPageHeader from "@/components/vitaliq/SubPageHeader";
import StatusPill, { statusTone } from "@/components/console/StatusPill";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@/lib/AuthContext";

export const Route = createFileRoute("/_authed/_console/command/users")({
  head: () => ({ meta: [{ title: "VITALIQ Command — Users" }] }),
  component: UsersPage,
});

function asArray(result) {
  return Array.isArray(result) ? result : result?.items ?? [];
}

function UsersPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [subs, setSubs] = useState([]);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("user");
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const [u, s] = await Promise.all([
      base44.entities.User.list(),
      base44.entities.Subscription.list({ limit: 200 }),
    ]);
    setUsers(asArray(u));
    setSubs(s.items ?? []);
  }, []);

  useEffect(() => {
    load().catch((error) => console.error(error));
  }, [load]);

  async function invite() {
    if (!email.trim()) return;
    setBusy(true);
    try {
      await base44.users.inviteUser(email.trim(), role);
      toast.success(`Invitation sent to ${email.trim()}`);
      setEmail("");
      setOpen(false);
      await load();
    } catch (error) {
      console.error(error);
      toast.error("Could not send the invitation.");
    } finally {
      setBusy(false);
    }
  }

  if (user?.role !== "admin") {
    return <Panel>User management is available to platform admins only.</Panel>;
  }

  return (
    <div className="space-y-5">
      <div className="lg:hidden">
        <SubPageHeader subtitle="Super admin" title="Users & access" to="/command" />
      </div>
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[12px] uppercase tracking-[0.24em] text-white/60">Super admin</p>
          <h1 className="mt-1.5 font-heading text-2xl font-semibold text-white">Users & access</h1>
          <p className="mt-1 text-xs text-white/40">Invite members and manage roles across the platform.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-1.5 rounded-full bg-cyan-400 text-xs font-semibold text-slate-950 hover:bg-cyan-300">
              <UserPlus className="h-3.5 w-3.5" /> Invite user
            </Button>
          </DialogTrigger>
          <DialogContent className="border-white/10 bg-[#0a0f1a] text-white sm:max-w-sm">
            <DialogHeader>
              <DialogTitle className="font-heading text-lg">Invite a user</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <Input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="name@email.com" className="border-white/10 bg-white/[0.04] text-white" />
              <SelectSheet
                label="Role"
                value={role}
                options={[
                  { value: "user", label: "Member (customer app)" },
                  { value: "admin", label: "Admin (professional / command access)" },
                ]}
                onChange={setRole}
              />
              <p className="text-[12px] leading-relaxed text-white/60">
                Admins can see every client record and manage billing, so only invite staff you trust.
              </p>
              <Button onClick={invite} disabled={busy} className="w-full rounded-full bg-cyan-400 text-slate-950 hover:bg-cyan-300">
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send invitation"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </header>

      <Panel>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[12px]">
            <thead>
              <tr className="text-[11px] uppercase tracking-wider text-white/55">
                <th className="pb-2 font-medium">Name</th>
                <th className="pb-2 font-medium">Email</th>
                <th className="pb-2 font-medium">Role</th>
                <th className="pb-2 font-medium">Plan</th>
                <th className="pb-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((row) => {
                const sub = subs.find((s) => s.user_email === row.email);
                return (
                  <tr key={row.id} className="border-t border-white/5 text-white/65">
                    <td className="py-2.5">{row.full_name || "—"}</td>
                    <td className="py-2.5 text-white/40">{row.email}</td>
                    <td className="py-2.5"><StatusPill tone={row.role === "admin" ? "purple" : "gray"}>{row.role}</StatusPill></td>
                    <td className="py-2.5 capitalize">{sub?.plan || "free"}</td>
                    <td className="py-2.5">{sub ? <StatusPill tone={statusTone(sub.status)}>{sub.status}</StatusPill> : <span className="text-white/25">—</span>}</td>
                  </tr>
                );
              })}
              {users.length === 0 && <tr><td colSpan={5} className="py-3 text-white/35">No users yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}