import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { base44 } from "@/api/base44Client";
import Panel from "@/components/console/Panel";
import Kpi from "@/components/console/Kpi";

export default function ProfessionalKpis() {
  const [state, setState] = useState({
    instructors: 0,
    instructorsActive: 0,
    dietitians: 0,
    dietitiansActive: 0,
    customers: 0,
    revenue: 0,
    pendingPayments: 0,
    pendingApprovals: 0,
    satisfaction: 0,
  });

  useEffect(() => {
    (async () => {
      const [instructors, instructorsActive, dietitians, dietitiansActive, payments, gymPending, dietPending, users] =
        await Promise.all([
          base44.entities.GymInstructor.count({}),
          base44.entities.GymInstructor.count({ status: "active" }),
          base44.entities.Dietitian.count({}),
          base44.entities.Dietitian.count({ status: "active" }),
          base44.entities.ProfessionalPayment.list({ limit: 200 }),
          base44.entities.GymInstructor.count({ status: "pending" }),
          base44.entities.Dietitian.count({ status: "pending" }),
          base44.entities.User.list(),
        ]);
      const rows = payments.items ?? [];
      const paid = rows.filter((row) => row.status === "paid");
      const rated = [...(await base44.entities.GymInstructor.list({ limit: 100 })).items, ...(await base44.entities.Dietitian.list({ limit: 100 })).items].filter(
        (pro) => pro.review_count,
      );
      setState({
        instructors,
        instructorsActive,
        dietitians,
        dietitiansActive,
        customers: Array.isArray(users) ? users.length : (users?.items?.length ?? 0),
        revenue: paid.reduce((sum, row) => sum + (row.amount ?? 0), 0),
        pendingPayments: rows.filter((row) => row.status === "pending").length,
        pendingApprovals: gymPending + dietPending,
        satisfaction: rated.length
          ? Math.round((rated.reduce((sum, pro) => sum + (pro.rating ?? 0), 0) / rated.length) * 10) / 10
          : 0,
      });
    })().catch((error) => console.error(error));
  }, []);

  return (
    <Panel title="Professional marketplace" subtitle="Instructor and dietitian practices at a glance">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi label="Gym instructors" value={state.instructors} hint={`${state.instructorsActive} active`} />
        <Kpi label="Dietitians" value={state.dietitians} accent="text-emerald-300" hint={`${state.dietitiansActive} active`} />
        <Kpi label="Professional revenue" value={`$${state.revenue}`} accent="text-cyan-300" hint={`${state.pendingPayments} payments pending`} />
        <Kpi label="Customer satisfaction" value={state.satisfaction || "—"} accent="text-amber-300" hint={`${state.pendingApprovals} approvals waiting`} />
      </div>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <Link to="/command/instructors" className="flex items-center justify-between rounded-xl bg-white/[0.03] px-3 py-2.5 text-[11px] text-white/60 hover:bg-white/[0.06]">
          Gym instructor administration
          <ArrowRight className="h-3 w-3 text-cyan-300" />
        </Link>
        <Link to="/command/dietitians" className="flex items-center justify-between rounded-xl bg-white/[0.03] px-3 py-2.5 text-[11px] text-white/60 hover:bg-white/[0.06]">
          Dietitian administration
          <ArrowRight className="h-3 w-3 text-emerald-300" />
        </Link>
      </div>
    </Panel>
  );
}