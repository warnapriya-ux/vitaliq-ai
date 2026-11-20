/**
 * Measured length of every narration clip, in seconds. The tutorial timeline is
 * built from these, so a chapter lasts exactly as long as its voice-over and the
 * transcript timestamps match what the player shows.
 */
export const SCENE_SECONDS = {
  "v1-s1": 13.8,
  "v1-s2": 8.4,
  "v1-s3": 7.8,
  "v1-s4": 10.6,
  "v2-s1": 10.7,
  "v2-s2": 7.8,
  "v2-s3": 9,
  "v2-s4": 8.8,
  "v3-s1": 8.3,
  "v3-s2": 6.9,
  "v3-s3": 8.2,
  "v3-s4": 9,
  "v4-s1": 8.8,
  "v4-s2": 9.2,
  "v4-s3": 7.5,
  "v4-s4": 8.6,
  "v5-s1": 9.1,
  "v5-s2": 9.6,
  "v5-s3": 8.9,
  "v5-s4": 10.9,
  "v6-s1": 8.2,
  "v6-s2": 8.5,
  "v6-s3": 8.8,
  "v6-s4": 11.1,
  "v7-s1": 9.5,
  "v7-s2": 9.4,
  "v7-s3": 10.1,
  "v7-s4": 7.3,
  "v8-s1": 8.5,
  "v8-s2": 8.1,
  "v8-s3": 9.1,
  "v8-s4": 8,
  "v9-s1": 5.9,
  "v9-s2": 8.6,
  "v9-s3": 7.1,
  "v9-s4": 7.2,
};

// A short beat of silence between chapters, so one line never runs into the next.
const GAP = 0.8;

const round = (value) => Math.round(value * 10) / 10;

/** Adds real start/end times to a tutorial's scenes and returns its total length. */
export function timedVideo(video) {
  let cursor = 0;
  const scenes = video.scenes.map((scene) => {
    const seconds = SCENE_SECONDS[scene.id] ?? 8;
    const timed = { ...scene, seconds, start: round(cursor), end: round(cursor + seconds) };
    cursor += seconds + GAP;
    return timed;
  });
  return { ...video, scenes, total: Math.max(1, round(cursor - GAP)) };
}

export function sceneAt(scenes, value) {
  let index = 0;
  scenes.forEach((scene, position) => {
    if (value >= scene.start - 0.001) index = position;
  });
  return index;
}

export const clockLabel = (value) => {
  const total = Math.max(0, Math.round(value));
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
};