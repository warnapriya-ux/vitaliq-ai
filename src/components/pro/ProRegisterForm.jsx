import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Camera, FileCheck2, Video } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { registerProfessional } from "@/lib/professional-fns";
import { uploadPrivate, uploadPublic } from "@/lib/files";
import {
  DIET_SPECIALISATIONS,
  GYM_SPECIALISATIONS,
  LANGUAGES,
  PRO_PLANS,
  TRACKS,
  priceFor,
  trackApi,
} from "@/lib/professional";
import SubPageHeader from "@/components/vitaliq/SubPageHeader";
import GlassCard from "@/components/vitaliq/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

function Chips({ options, value, onChange }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((option) => {
        const active = value.includes(option);
        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(active ? value.filter((item) => item !== option) : [...value, option])}
            className={`rounded-full border px-2.5 py-1 text-[10px] transition ${
              active ? "border-cyan-400/50 bg-cyan-400/12 text-cyan-200" : "border-white/10 bg-white/[0.03] text-white/45"
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

const Field = ({ label, children }) => (
  <div className="space-y-1.5">
    <Label className="text-[11px] text-white/50">{label}</Label>
    {children}
  </div>
);

const inputClass = "border-white/10 bg-[#0b1220] text-white";

export default function ProRegisterForm({ track }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const config = TRACKS[track];
  const api = trackApi(track);
  const register = useServerFn(registerProfessional);

  const [existing, setExisting] = useState(null);
  const [prices, setPrices] = useState([]);
  const [saving, setSaving] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [doc, setDoc] = useState(null);
  const [video, setVideo] = useState(null);
  const [plan, setPlan] = useState("basic");
  const [cycle, setCycle] = useState("monthly");
  const [consent, setConsent] = useState(false);
  const [form, setForm] = useState({
    name: "",
    bio: "",
    qualifications: "",
    licence_details: "",
    years_experience: "",
    gym_location: "",
    city: "",
    contact: "",
    availability: "",
    paymentReference: "",
  });
  const [specialisations, setSpecialisations] = useState([]);
  const [languages, setLanguages] = useState(["English"]);

  useEffect(() => {
    if (!user) return;
    setForm((current) => ({ ...current, name: current.name || user.full_name || "", contact: current.contact || user.email || "" }));
    (async () => {
      const [profilePage, pricePage] = await Promise.all([
        api.profile.filter({ user_id: user.id }, { limit: 1 }),
        base44.entities.ProfessionalPrice.filter({ track: config.priceTrack }, { limit: 20 }),
      ]);
      setExisting(profilePage.items?.[0] ?? null);
      setPrices(pricePage.items ?? []);
    })().catch((error) => console.error(error));
  }, [api, config.priceTrack, user]);

  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  async function submit() {
    if (!consent) return toast.error("Please confirm your details are accurate.");
    if (form.name.trim().length < 2) return toast.error("Enter your full name.");
    if (form.paymentReference.trim().length < 2) return toast.error("Enter your payment reference.");
    if (!doc) return toast.error("Attach your qualification or licence document.");
    setSaving(true);
    try {
      const photoUrl = photo ? await uploadPublic(photo) : "";
      const docUri = await uploadPrivate(doc);
      const videoUri = video ? await uploadPrivate(video) : "";
      await register({
        data: {
          track,
          plan,
          cycle,
          paymentReference: form.paymentReference.trim(),
          name: form.name.trim(),
          bio: form.bio,
          qualifications: form.qualifications,
          licence_details: form.licence_details,
          years_experience: form.years_experience === "" ? 0 : Number(form.years_experience),
          specialisations,
          gym_location: form.gym_location,
          city: form.city,
          contact: form.contact,
          languages,
          availability: form.availability,
          intro_video_url: videoUri,
          photo_url: photoUrl,
          verification_doc_uri: docUri,
        },
      });
      toast.success("Registration submitted. Verification usually takes one working day.");
      navigate({ to: config.route });
    } catch (error) {
      toast.error(error?.message || "Could not submit your registration.");
    } finally {
      setSaving(false);
    }
  }

  if (existing) {
    return (
      <div className="space-y-4">
        <SubPageHeader title={`${config.label} account`} subtitle="Already registered" />
        <GlassCard className="space-y-2 p-4">
          <p className="font-heading text-sm font-semibold text-white">{existing.name}</p>
          <p className="text-[11px] text-white/45">
            {existing.plan} package · status {existing.status}. Manage clients and plans from your dashboard.
          </p>
          <Link to={config.route} className="inline-flex text-xs font-semibold text-cyan-300">Open dashboard →</Link>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <SubPageHeader title={`Become a ${config.label}`} subtitle="Registration" />

      <div className="space-y-3 rounded-[26px] border border-white/10 bg-white/[0.035] p-4">
        <p className="text-[10px] uppercase tracking-[0.2em] text-white/35">Professional profile</p>

        <div className="flex items-center gap-3">
          <label className="grid h-16 w-16 shrink-0 cursor-pointer place-items-center overflow-hidden rounded-2xl border border-dashed border-white/20 bg-white/[0.04] text-white/40">
            {photo ? <img src={URL.createObjectURL(photo)} alt="Profile" className="h-full w-full object-cover" /> : <Camera className="h-5 w-5" />}
            <input type="file" accept="image/*" className="hidden" onChange={(event) => setPhoto(event.target.files?.[0] ?? null)} />
          </label>
          <div className="min-w-0 flex-1 space-y-1.5">
            <Field label="Full name">
              <Input value={form.name} onChange={(event) => set("name", event.target.value)} className={inputClass} />
            </Field>
          </div>
        </div>

        <Field label="Professional biography">
          <Textarea rows={3} value={form.bio} onChange={(event) => set("bio", event.target.value)} className={inputClass} placeholder="Coaching style, who you work best with, results you are proud of." />
        </Field>

        <Field label={track === "diet" ? "Qualifications" : "Qualifications and certificates"}>
          <Textarea rows={2} value={form.qualifications} onChange={(event) => set("qualifications", event.target.value)} className={inputClass} placeholder={track === "diet" ? "BSc Nutrition, RD registration" : "NASM-CPT, First aid"} />
        </Field>

        {track === "diet" && (
          <Field label="Registration or licence details">
            <Input value={form.licence_details} onChange={(event) => set("licence_details", event.target.value)} className={inputClass} placeholder="Licence number and issuing body" />
          </Field>
        )}

        <div className="grid grid-cols-2 gap-2">
          <Field label="Years of experience">
            <Input inputMode="numeric" value={form.years_experience} onChange={(event) => set("years_experience", event.target.value)} className={inputClass} />
          </Field>
          {track === "gym" ? (
            <Field label="Gym location">
              <Input value={form.gym_location} onChange={(event) => set("gym_location", event.target.value)} className={inputClass} />
            </Field>
          ) : (
            <Field label="Consultation availability">
              <Input value={form.availability} onChange={(event) => set("availability", event.target.value)} className={inputClass} placeholder="Weekdays after 6pm" />
            </Field>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Field label="City">
            <Input value={form.city} onChange={(event) => set("city", event.target.value)} className={inputClass} />
          </Field>
          <Field label="Contact">
            <Input value={form.contact} onChange={(event) => set("contact", event.target.value)} className={inputClass} />
          </Field>
        </div>

        <Field label="Specialisations">
          <Chips
            options={track === "diet" ? DIET_SPECIALISATIONS : GYM_SPECIALISATIONS}
            value={specialisations}
            onChange={setSpecialisations}
          />
        </Field>

        <Field label="Languages">
          <Chips options={LANGUAGES} value={languages} onChange={setLanguages} />
        </Field>
      </div>

      <div className="space-y-3 rounded-[26px] border border-white/10 bg-white/[0.035] p-4">
        <p className="text-[10px] uppercase tracking-[0.2em] text-white/35">Verification & media</p>
        <div className="grid gap-2">
          <label className="flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-white/15 bg-white/[0.03] text-[11px] text-white/50">
            <FileCheck2 className="h-4 w-4" />
            {doc ? doc.name : "Qualification / licence document"}
            <input type="file" accept="image/*,application/pdf" className="hidden" onChange={(event) => setDoc(event.target.files?.[0] ?? null)} />
          </label>
          <label className="flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-white/15 bg-white/[0.03] text-[11px] text-white/50">
            <Video className="h-4 w-4" />
            {video ? video.name : "Introduction video (optional)"}
            <input type="file" accept="video/*" className="hidden" onChange={(event) => setVideo(event.target.files?.[0] ?? null)} />
          </label>
        </div>
        <p className="text-[10px] leading-relaxed text-white/30">
          Your documents and videos are stored privately. Customers only see your photo, profile and introduction video.
        </p>
      </div>

      <div className="space-y-3 rounded-[26px] border border-white/10 bg-white/[0.035] p-4">
        <p className="text-[10px] uppercase tracking-[0.2em] text-white/35">Subscription package</p>
        <div className="grid gap-2 sm:grid-cols-3">
          {PRO_PLANS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setPlan(item.id)}
              className={`rounded-2xl border p-3 text-left transition ${
                plan === item.id ? "border-cyan-400/50 bg-cyan-400/[0.08]" : "border-white/10 bg-white/[0.03]"
              }`}
            >
              <p className="font-heading text-[13px] font-semibold text-white">{item.name}</p>
              <p className="mt-0.5 text-[10px] text-white/40">Up to {item.clients} clients</p>
              <p className="mt-1 text-[11px] text-cyan-300">${priceFor(prices, config.priceTrack, item.id, cycle)} / {cycle === "annual" ? "year" : "month"}</p>
              <p className="mt-1 text-[9px] text-white/30">{item.reports} reports</p>
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          {["monthly", "annual"].map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setCycle(option)}
              className={`flex-1 rounded-xl border py-2 text-[11px] capitalize transition ${
                cycle === option ? "border-cyan-400/50 bg-cyan-400/[0.08] text-white" : "border-white/10 text-white/50"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
        <Field label="Payment reference">
          <Input
            value={form.paymentReference}
            onChange={(event) => set("paymentReference", event.target.value)}
            className={inputClass}
            placeholder="Bank transfer or receipt number"
          />
        </Field>
        <label className="flex items-start gap-2 text-[10px] leading-relaxed text-white/45">
          <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} className="mt-0.5 h-4 w-4 accent-cyan-400" />
          <span>
            I confirm these details are accurate, and I consent to VITALIQ AI verifying my qualifications and storing them
            securely for review.
          </span>
        </label>
        <Button onClick={submit} disabled={saving} className="h-11 w-full rounded-xl bg-cyan-400 text-sm font-semibold text-slate-950 hover:bg-cyan-300">
          {saving ? "Submitting…" : "Submit registration"}
        </Button>
        <p className="text-center text-[10px] text-white/30">
          Registration goes to the Super Admin for verification. Your dashboard unlocks after activation.
        </p>
      </div>
    </div>
  );
}