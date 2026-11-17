import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Search } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { useServerFn } from "@tanstack/react-start";
import { requestProfessional } from "@/lib/professional-fns";
import { GYM_SPECIALISATIONS, DIET_SPECIALISATIONS, LANGUAGES, TRACKS, trackApi } from "@/lib/professional";
import SubPageHeader from "@/components/vitaliq/SubPageHeader";
import ProfessionalCard from "@/components/pro/ProfessionalCard";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import SelectSheet from "@/components/vitaliq/SelectSheet";

export default function FinderScreen({ track }) {
  const { user } = useAuth();
  const config = TRACKS[track];
  const api = trackApi(track);
  const request = useServerFn(requestProfessional);

  const [pros, setPros] = useState([]);
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [specialisation, setSpecialisation] = useState("");
  const [language, setLanguage] = useState("");

  const [target, setTarget] = useState(null);
  const [goal, setGoal] = useState("");
  const [note, setNote] = useState("");
  const [consent, setConsent] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const [proPage, linkPage] = await Promise.all([
      api.profile.filter({ status: "active" }, { sort: "-rating", limit: 100 }),
      user ? api.link.filter({ client_user_id: user.id }, { limit: 50 }) : Promise.resolve({ items: [] }),
    ]);
    setPros(proPage.items ?? []);
    setLinks(linkPage.items ?? []);
    setLoading(false);
  }, [api, user]);

  useEffect(() => {
    if (user) load().catch((error) => console.error(error));
  }, [load, user]);

  const specialisations = track === "gym" ? GYM_SPECIALISATIONS : DIET_SPECIALISATIONS;
  const nameKey = track === "diet" ? "dietitian_id" : "instructor_id";

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return pros.filter((pro) => {
      const haystack = `${pro.name} ${pro.city} ${pro.gym_location} ${(pro.specialisations || []).join(" ")}`.toLowerCase();
      if (q && !haystack.includes(q)) return false;
      if (specialisation && !(pro.specialisations || []).includes(specialisation)) return false;
      if (language && !(pro.languages || []).includes(language)) return false;
      return true;
    });
  }, [pros, query, specialisation, language]);

  function stateFor(pro) {
    return links.find((link) => link[nameKey] === pro.id && link.status !== "ended" && link.status !== "declined");
  }

  async function submit() {
    if (!consent) {
      toast.error("Please consent to sharing your health profile.");
      return;
    }
    setSaving(true);
    try {
      await request({ data: { track, professionalId: target.id, goal, note, consent } });
      toast.success("Request sent. You will be connected once it is accepted.");
      setTarget(null);
      setGoal("");
      setNote("");
      setConsent(false);
      await load();
    } catch (error) {
      toast.error(error?.message || "Could not send the request.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <SubPageHeader title={`Find a ${config.short}`} subtitle="Verified professionals" />

      <div className="space-y-2.5">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search name, city or specialisation"
            className="h-11 w-full rounded-xl border border-white/10 bg-[#0b1220] pl-9 pr-3 text-sm text-white placeholder:text-white/30 focus:border-cyan-400/60 focus:outline-none"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <SelectSheet
            label="Specialisation"
            value={specialisation}
            onChange={setSpecialisation}
            options={[{ value: "", label: "All specialisations" }, ...specialisations.map((s) => ({ value: s, label: s }))]}
          />
          <SelectSheet
            label="Language"
            value={language}
            onChange={setLanguage}
            options={[{ value: "", label: "Any language" }, ...LANGUAGES.map((s) => ({ value: s, label: s }))]}
          />
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          <div className="h-44 animate-pulse rounded-[24px] bg-white/5" />
          <div className="h-44 animate-pulse rounded-[24px] bg-white/5" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-6 text-center">
          <p className="font-heading text-sm font-semibold text-white">No {config.plural.toLowerCase()} match yet</p>
          <p className="mt-1 text-xs text-white/40">
            Try a different filter. New professionals appear here once their verification is complete.
          </p>
        </div>
      ) : (
        <div className="space-y-3 lg:grid lg:grid-cols-2 lg:gap-3 lg:space-y-0">
          {filtered.map((pro) => (
            <ProfessionalCard
              key={pro.id}
              pro={pro}
              track={track}
              requestState={stateFor(pro)}
              onRequest={(selected) => setTarget(selected)}
            />
          ))}
        </div>
      )}

      <Dialog open={!!target} onOpenChange={(open) => !open && setTarget(null)}>
        <DialogContent className="max-w-md border-white/10 bg-[#080d16]">
          <DialogHeader>
            <DialogTitle className="font-heading text-base text-white">Request {target?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label className="text-[11px] text-white/50">Your goal</Label>
              <Input
                value={goal}
                onChange={(event) => setGoal(event.target.value)}
                placeholder={track === "gym" ? "Lose 6 kg and build strength" : "Lower cholesterol with better meals"}
                className="border-white/10 bg-[#0b1220] text-white"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[11px] text-white/50">Anything they should know?</Label>
              <Textarea
                value={note}
                onChange={(event) => setNote(event.target.value)}
                rows={3}
                className="border-white/10 bg-[#0b1220] text-white"
              />
            </div>
            <label className="flex items-start gap-2 rounded-xl border border-white/10 bg-white/[0.03] p-3 text-[11px] leading-relaxed text-white/55">
              <input
                type="checkbox"
                checked={consent}
                onChange={(event) => setConsent(event.target.checked)}
                className="mt-0.5 h-4 w-4 accent-cyan-400"
              />
              <span>
                I consent to sharing my health profile, measurements and activity with this {config.short.toLowerCase()} so they
                can build my plan.
              </span>
            </label>
            <Button
              onClick={submit}
              disabled={saving}
              className="h-11 w-full rounded-xl bg-cyan-400 text-sm font-semibold text-slate-950 hover:bg-cyan-300"
            >
              {saving ? "Sending…" : "Send request"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}