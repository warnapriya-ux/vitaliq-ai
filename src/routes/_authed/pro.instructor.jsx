import { createFileRoute, Link } from "@tanstack/react-router";
import { useProfessional } from "@/components/pro/useProfessional";
import ProShell from "@/components/pro/ProShell";
import ProHeader from "@/components/pro/ProHeader";
import ProStatGrid from "@/components/pro/ProStatGrid";
import ClientRequests from "@/components/pro/ClientRequests";
import ClientList from "@/components/pro/ClientList";
import VideoReviews from "@/components/pro/VideoReviews";
import GlassCard from "@/components/vitaliq/GlassCard";
import { formatDate } from "@/lib/health";

export const Route = createFileRoute("/_authed/pro/instructor")({
  head: () => ({ meta: [{ title: "Instructor dashboard — VITALIQ AI" }] }),
  component: InstructorDashboard,
});

function InstructorDashboard() {
  const { loading, profile, subscription, links, plans, reload, user } = useProfessional("gym");

  if (loading) return <ProShell track="gym"><div className="h-56 animate-pulse rounded-[26px] bg-white/5" /></ProShell>;

  if (!profile) {
    return (
      <ProShell track="gym">
        <GlassCard className="space-y-2 text-center">
          <p className="font-heading text-base font-semibold text-white">No instructor account yet</p>
          <p className="text-xs text-white/45">Register with your certifications and choose a package to start taking clients.</p>
          <Link to="/pro/instructor/register" className="mt-2 inline-flex rounded-full bg-cyan-400 px-4 py-2 text-xs font-semibold text-slate-950">
            Start registration
          </Link>
        </GlassCard>
      </ProShell>
    );
  }

  const active = links.filter((link) => link.status === "active");
  const pending = links.filter((link) => link.status === "requested");
  const limit = profile.max_clients ?? 5;
  const approvedPlans = plans.filter((plan) => plan.status === "approved");

  return (
    <ProShell track="gym">
      <div className="space-y-5">
        <ProHeader track="gym" profile={profile} subscription={subscription} />

        <ProStatGrid
          stats={[
            { label: "Total clients", value: links.length },
            { label: "Active clients", value: active.length, accent: "text-emerald-300" },
            { label: "Available slots", value: Math.max(0, limit - active.length), accent: "text-cyan-300", hint: `of ${limit}` },
            { label: "Requests", value: pending.length, accent: pending.length ? "text-amber-300" : "text-white" },
          ]}
        />

        <div className="grid gap-4 lg:grid-cols-2">
          <section className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h2 className="text-[10px] uppercase tracking-[0.22em] text-white/35">Client requests</h2>
              <span className="text-[10px] text-white/30">{pending.length} waiting</span>
            </div>
            {pending.length ? (
              <ClientRequests track="gym" links={pending} onDone={reload} />
            ) : (
              <p className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-xs text-white/35">No new requests.</p>
            )}
          </section>

          <section className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h2 className="text-[10px] uppercase tracking-[0.22em] text-white/35">Active clients</h2>
              <Link to="/pro/instructor/plans" className="text-[10px] font-semibold text-cyan-300">Build a plan →</Link>
            </div>
            <ClientList track="gym" links={active} />
          </section>
        </div>

        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-[10px] uppercase tracking-[0.22em] text-white/35">Workout plans</h2>
            <span className="text-[10px] text-white/30">{approvedPlans.length} live · {plans.length} total</span>
          </div>
          {plans.length === 0 ? (
            <p className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-xs text-white/35">
              No plans yet. Use voice, AI assistance or manual entry to build your first programme.
            </p>
          ) : (
            <div className="space-y-2">
              {plans.slice(0, 6).map((plan) => (
                <div key={plan.id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2.5">
                  <div className="min-w-0">
                    <p className="truncate text-[12px] text-white/85">{plan.title}</p>
                    <p className="text-[10px] text-white/35">{plan.client_name} · {plan.days?.length ?? 0} days · {plan.source}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <span className={`rounded-full px-2 py-0.5 text-[9px] font-semibold ${
                      plan.status === "approved" ? "bg-emerald-400/12 text-emerald-300" : "bg-amber-400/12 text-amber-300"
                    }`}>{plan.status}</span>
                    <p className="mt-1 text-[9px] text-white/25">{formatDate(plan.created_date)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <VideoReviews user={user} />
        </section>
      </div>
    </ProShell>
  );
}