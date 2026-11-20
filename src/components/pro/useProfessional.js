import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { trackApi } from "@/lib/professional";

export function useProfessional(track) {
  const { user } = useAuth();
  const [state, setState] = useState({ loading: true, profile: null, subscription: null, links: [], plans: [] });

  const load = useCallback(async () => {
    if (!user) return;
    try {
      const api = trackApi(track);
      const profilePage = await api.profile.filter({ user_id: user.id }, { limit: 1 });
      const profile = profilePage.items?.[0] ?? null;
      if (!profile) {
        setState({ loading: false, profile: null, subscription: null, links: [], plans: [] });
        return;
      }
      const nameKey = track === "diet" ? "dietitian" : "instructor";
      const [subPage, linkPage, planPage] = await Promise.all([
        api.subscription.filter({ [`${nameKey}_id`]: profile.id }, { sort: "-created_date", limit: 1 }),
        api.link.filter({ [`${nameKey}_id`]: profile.id }, { sort: "-created_date", limit: 200 }),
        api.plan.filter({ [`${nameKey}_user_id`]: user.id }, { sort: "-created_date", limit: 100 }),
      ]);
      setState({
        loading: false,
        profile,
        subscription: subPage.items?.[0] ?? null,
        links: linkPage.items ?? [],
        plans: planPage.items ?? [],
      });
    } catch (error) {
      // A failed read must never leave the portal stuck on its loading skeleton.
      console.error(error);
      setState((prev) => ({ ...prev, loading: false }));
    }
  }, [track, user]);

  useEffect(() => {
    load().catch((error) => console.error(error));
  }, [load]);

  return { ...state, user, reload: load };
}