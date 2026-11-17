import { useCallback, useEffect, useRef, useState } from "react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { todayISO } from "@/lib/health";
import { ensureStarterData, seedPlatformDemo } from "@/lib/starterData";

const EMPTY = {
  loading: true,
  profile: null,
  today: null,
  diet: null,
  workout: null,
  subscription: null,
  measurements: [],
  logs: [],
};

export function useVitaliq() {
  const { user, isLoadingAuth } = useAuth();
  const [state, setState] = useState(EMPTY);
  const userRef = useRef(user);
  userRef.current = user;
  const inFlight = useRef(null);

  const load = useCallback(async () => {
    if (inFlight.current) return inFlight.current;

    const run = (async () => {
      const currentUser = userRef.current;
      if (!currentUser) return;
      if (currentUser.role === "admin") await seedPlatformDemo();

      const email = currentUser.email;
      let ownProfile = await base44.entities.HealthProfile.filter({ email }, { sort: "-created_date", limit: 1 });

      if (!ownProfile.items?.length) {
        const legacy = await base44.entities.HealthProfile.filter(
          { created_by_id: currentUser.id, email: { $exists: false } },
          { sort: "created_date", limit: 1 },
        );
        if (legacy.items?.length) {
          const migrated = await base44.entities.HealthProfile.update(legacy.items[0].id, { email });
          ownProfile = { items: [migrated] };
        }
      }

      if (!ownProfile.items?.length) {
        await ensureStarterData(currentUser);
        ownProfile = await base44.entities.HealthProfile.filter({ email }, { sort: "-created_date", limit: 1 });
      }
      const profile = ownProfile.items?.[0] ?? null;

      const [todayPage, dietPage, workoutPage, subPage, measurePage, logsPage] = await Promise.all([
        profile
          ? base44.entities.DailyLog.filter({ profile_id: profile.id, log_date: todayISO() }, { limit: 1 })
          : Promise.resolve({ items: [] }),
        profile
          ? base44.entities.Plan.filter({ client_id: currentUser.id, kind: "diet" }, { sort: "-created_date", limit: 1 })
          : Promise.resolve({ items: [] }),
        profile
          ? base44.entities.Plan.filter({ client_id: currentUser.id, kind: "workout" }, { sort: "-created_date", limit: 1 })
          : Promise.resolve({ items: [] }),
        base44.entities.Subscription.filter({ user_email: currentUser.email }, { sort: "-created_date", limit: 1 }),
        profile
          ? base44.entities.Measurement.filter({ profile_id: profile.id }, { sort: "measured_on", limit: 60 })
          : Promise.resolve({ items: [] }),
        profile
          ? base44.entities.DailyLog.filter({ profile_id: profile.id }, { sort: "-log_date", limit: 14 })
          : Promise.resolve({ items: [] }),
      ]);

      let subscription = subPage.items?.[0] ?? null;
      if (subscription?.status === "active" && subscription.renews_on && subscription.renews_on < todayISO()) {
        subscription = await base44.entities.Subscription.update(subscription.id, {
          status: "expired",
          auto_renew: false,
        });
      }

      setState({
        loading: false,
        profile,
        today: todayPage.items?.[0] ?? null,
        diet: dietPage.items?.[0] ?? null,
        workout: workoutPage.items?.[0] ?? null,
        subscription,
        measurements: measurePage.items ?? [],
        logs: logsPage.items ?? [],
      });
    })();

    inFlight.current = run;
    try {
      await run;
    } finally {
      inFlight.current = null;
    }
  }, []);

  useEffect(() => {
    if (isLoadingAuth) return;
    if (!user) {
      setState({ ...EMPTY, loading: false });
      return;
    }
    load().catch((error) => {
      console.error(error);
      setState((s) => ({ ...s, loading: false }));
    });
  }, [isLoadingAuth, user?.id, load]);

  return { ...state, user, reload: load };
}