import { CATEGORY_SHORT, EXERCISES } from "@/lib/exerciseCatalog";

const LEVEL_RANK = { beginner: 1, intermediate: 2, advanced: 3 };

const GENTLE = /knee|back|shoulder|joint|injur|surg|pregnan|postpartum|heart|pressure|diabet|senior|arthrit|tight/i;

// The gallery entries a member may safely be given, narrowed by experience and health notes.
export function galleryCandidates(experience = "beginner", conditions = "") {
  const maxRank = LEVEL_RANK[experience] ?? 1;
  const gentle = GENTLE.test(String(conditions || ""));
  return EXERCISES.filter((exercise) => {
    if ((LEVEL_RANK[exercise.level] ?? 1) > maxRank) return false;
    if (gentle && exercise.level === "advanced") return false;
    return true;
  });
}

const MAX_GALLERY_LINES = 140;

// One compact line per exercise so the model can pick by gallery ID.
// The 500-entry catalog is sampled evenly so the prompt stays small while still
// covering every category.
export function galleryLines(list) {
  const step = Math.ceil(list.length / MAX_GALLERY_LINES);
  const sample = step > 1 ? list.filter((_, index) => index % step === 0) : list;
  return sample
    .slice(0, MAX_GALLERY_LINES)
    .map((exercise) => `${exercise.id} | ${exercise.name} | ${CATEGORY_SHORT[exercise.cat] ?? exercise.cat} | ${exercise.equip} | ${exercise.level}`)
    .join("\n");
}

// Keeps only real gallery picks, labelled with the gallery's own exercise name.
export function resolveGalleryItems(items = []) {
  const byId = new Map(EXERCISES.map((exercise) => [exercise.id, exercise]));
  return items.reduce((acc, item) => {
    const match = byId.get(String(item?.exercise_id ?? "").trim().toUpperCase());
    if (!match) return acc;
    acc.push({
      exercise_id: match.id,
      label: match.name,
      detail: item.detail || match.desc,
      meta: item.meta || `${match.level} · ${CATEGORY_SHORT[match.cat] ?? match.cat}`,
    });
    return acc;
  }, []);
}

// Keeps a session usable when the model returns unknown IDs.
export function fillGalleryItems(items, list, target = 5) {
  const used = new Set(items.map((item) => item.exercise_id));
  const missing = Math.max(0, target - items.length);
  const extra = list
    .filter((exercise) => !used.has(exercise.id))
    .slice(0, missing)
    .map((exercise) => ({
      exercise_id: exercise.id,
      label: exercise.name,
      detail: exercise.desc,
      meta: `${exercise.level} · ${CATEGORY_SHORT[exercise.cat] ?? exercise.cat}`,
    }));
  return [...items, ...extra];
}