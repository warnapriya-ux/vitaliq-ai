// Movement templates for the AI Personal Trainer.
// `flexed` / `extended` are the joint angles (degrees) that mark the bottom and
// top of one repetition; `chain` holds the landmark triples whose angle is measured.
export const EXERCISES = [
  {
    id: "squat",
    name: "Squat",
    focus: "Quads · glutes · core",
    brief: "Stand facing the camera, feet shoulder width apart, full body in frame.",
    flexed: 100,
    extended: 165,
    chain: [
      [23, 25, 27],
      [24, 26, 28],
    ],
    cues: { bottom: "Good depth. Drive up through your heels.", top: "Stand tall, then sit back and down." },
    checks: ["kneesIn", "trunkLean"],
  },
  {
    id: "pushup",
    name: "Push-up",
    focus: "Chest · shoulders · core",
    brief: "Prop your phone low and film from the side so elbows and hips stay visible.",
    flexed: 95,
    extended: 158,
    chain: [
      [11, 13, 15],
      [12, 14, 16],
    ],
    cues: { bottom: "Chest low, elbows at 45 degrees.", top: "Press up and squeeze your core." },
    checks: ["hipSag"],
  },
  {
    id: "lunge",
    name: "Reverse lunge",
    focus: "Glutes · quads · balance",
    brief: "Side on, with your front knee and ankle in frame.",
    flexed: 100,
    extended: 162,
    chain: [
      [23, 25, 27],
      [24, 26, 28],
    ],
    aggregate: "min",
    cues: { bottom: "Front knee over your ankle, chest tall.", top: "Step back and control the descent." },
    checks: ["trunkLean"],
  },
  {
    id: "curl",
    name: "Bicep curl",
    focus: "Biceps · forearms",
    brief: "Stand side on, shoulder to wrist in frame.",
    flexed: 55,
    extended: 155,
    chain: [
      [11, 13, 15],
      [12, 14, 16],
    ],
    cues: { bottom: "Squeeze at the top for one second.", top: "Lower slowly all the way down." },
    checks: ["bodySwing"],
  },
  {
    id: "press",
    name: "Overhead press",
    focus: "Shoulders · triceps · core",
    brief: "Face the camera with your wrists in frame at the top.",
    flexed: 90,
    extended: 165,
    chain: [
      [11, 13, 15],
      [12, 14, 16],
    ],
    cues: { bottom: "Elbows under wrists, ribs down.", top: "Press overhead until the arms are straight." },
    checks: ["bodySwing"],
  },
  {
    id: "plank",
    name: "Plank hold",
    focus: "Core · shoulders",
    brief: "Side view. Build one straight line from head to heel and hold it.",
    static: true,
    target: 165,
    chain: [
      [11, 23, 27],
      [12, 24, 28],
    ],
    cues: { hold: "Straight line. Keep breathing." },
    checks: [],
  },
];

export const exerciseById = (id) => EXERCISES.find((item) => item.id === id) ?? EXERCISES[0];