import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Image } from "@/components/ui/image";
import { BRAND_LOGO } from "@/lib/brand";
import { base44 } from "@/api/base44Client";
import { DEMO_VIDEOS, EXERCISES } from "@/lib/exerciseCatalog";
import CatalogSidebar from "@/components/catalog/CatalogSidebar";
import CatalogToolbar from "@/components/catalog/CatalogToolbar";
import ExerciseCard from "@/components/catalog/ExerciseCard";
import ExerciseTable from "@/components/catalog/ExerciseTable";
import ExerciseVideoDialog from "@/components/catalog/ExerciseVideoDialog";
import VideoWall from "@/components/catalog/VideoWall";

export const Route = createFileRoute("/catalog")({
  validateSearch: (search) => (typeof search.exercise === "string" ? { exercise: search.exercise } : {}),
  head: () => ({
    meta: [
      { title: "Exercise Catalog — VITALIQ AI" },
      {
        name: "description",
        content: `Browse ${EXERCISES.length} exercises across ten categories with coaching cues, equipment and levels, plus AI demonstration videos.`,
      },
    ],
  }),
  component: CatalogPage,
});

function CatalogPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [equipment, setEquipment] = useState("all");
  const [level, setLevel] = useState("all");
  const [view, setView] = useState("grid");
  const [media, setMedia] = useState({});
  const [active, setActive] = useState(null);
  const [visible, setVisible] = useState(60);
  const { exercise: exerciseParam } = Route.useSearch();
  const navigate = useNavigate({ from: "/catalog" });

  // Every exercise has its own catalog URL: /catalog?exercise=VIT-001.
  useEffect(() => {
    if (!exerciseParam) return;
    const wanted = String(exerciseParam).toUpperCase();
    const match = EXERCISES.find((item) => item.id === wanted);
    if (match) setActive(match);
  }, [exerciseParam]);

  function openExercise(exercise) {
    setActive(exercise);
    navigate({ search: { exercise: exercise.id }, replace: true });
  }

  function closeExercise() {
    setActive(null);
    navigate({ search: {}, replace: true });
  }

  useEffect(() => {
    let alive = true;
    base44.entities.ExerciseMedia
      .filter({ status: "generated" })
      .then((res) => {
        const rows = Array.isArray(res) ? res : res?.items ?? [];
        if (!alive) return;
        const map = {};
        rows.forEach((row) => {
          if (row.video_url) map[row.exercise_id] = row.video_url;
        });
        setMedia(map);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  const videoFor = (exercise) => media[exercise.id] || DEMO_VIDEOS[exercise.id];

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return EXERCISES.filter((exercise) => {
      if (category !== "all" && exercise.cat !== category) return false;
      if (equipment !== "all" && exercise.equip !== equipment) return false;
      if (level !== "all" && exercise.level !== level) return false;
      if (!q) return true;
      return `${exercise.id} ${exercise.name} ${exercise.desc} ${exercise.style}`.toLowerCase().includes(q);
    });
  }, [search, category, equipment, level]);

  const videoCount = filtered.filter((exercise) => videoFor(exercise)).length;
  const shown = filtered.slice(0, visible);

  // A fresh filter starts from the top of the list again.
  useEffect(() => setVisible(60), [search, category, equipment, level]);

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-white/[0.07] bg-[#060b14]/85 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between px-4 py-3 lg:px-8">
          <Link to="/" className="flex items-center gap-2.5">
            <Image src={BRAND_LOGO} alt="VITALIQ AI" className="h-8 w-8 overflow-hidden rounded-xl ring-1 ring-white/10" />
            <span className="font-heading text-[13px] font-semibold tracking-[0.14em] text-white">
              VITALIQ <span className="text-cyan-300">AI</span>
            </span>
          </Link>
          <Link to="/" className="rounded-full border border-white/10 px-3.5 py-1.5 text-[11px] text-white/60 transition hover:text-white">
            Open my app
          </Link>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-[1440px] gap-10 px-4 py-6 lg:px-8 lg:py-8">
        <aside className="hidden w-[250px] shrink-0 lg:block">
          <CatalogSidebar
            category={category}
            equipment={equipment}
            level={level}
            onCategory={setCategory}
            onEquipment={setEquipment}
            onLevel={setLevel}
          />
        </aside>

        <main className="min-w-0 flex-1 space-y-5">
          <CatalogToolbar
            search={search}
            onSearch={setSearch}
            level={level}
            onLevel={setLevel}
            view={view}
            onView={setView}
            category={category}
            onCategory={setCategory}
            total={filtered.length}
            videos={videoCount}
          />

          {filtered.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/[0.02] px-6 py-16 text-center">
              <p className="font-heading text-sm font-semibold text-white">No exercises match those filters</p>
              <p className="mt-1 text-[12px] text-white/40">Clear the search or widen the category and level.</p>
            </div>
          ) : view === "table" ? (
            <ExerciseTable exercises={shown} videoFor={videoFor} onOpen={openExercise} />
          ) : view === "video" ? (
            <VideoWall exercises={shown} videoFor={videoFor} onOpen={openExercise} />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {shown.map((exercise) => (
                <ExerciseCard key={exercise.id} exercise={exercise} videoUrl={videoFor(exercise)} onOpen={() => openExercise(exercise)} />
              ))}
            </div>
          )}

          {filtered.length > visible && (
            <div className="flex justify-center pt-1">
              <button
                type="button"
                onClick={() => setVisible((count) => count + 120)}
                className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-2.5 text-[11px] font-semibold text-white/70 transition hover:border-cyan-400/30 hover:text-white"
              >
                Show more exercises ({Math.min(visible, filtered.length)} of {filtered.length})
              </button>
            </div>
          )}
        </main>
      </div>

      <ExerciseVideoDialog
        key={active?.id ?? "none"}
        exercise={active}
        videoUrl={active ? videoFor(active) : null}
        open={Boolean(active)}
        onOpenChange={(next) => !next && closeExercise()}
        onGenerated={(id, url) => setMedia((prev) => ({ ...prev, [id]: url }))}
      />
    </div>
  );
}