// Exercise catalog data for the public catalog at /catalog.
// Each entry is one movement with its taxonomy, level and coaching cue.
import extra1 from "@/lib/catalog/extra1";
import extra2 from "@/lib/catalog/extra2";
import extra3 from "@/lib/catalog/extra3";

export const CATEGORIES = [
  { id: "cardio", label: "Weight Reduction & Cardio", short: "Cardio" },
  { id: "chest", label: "Chest", short: "Chest" },
  { id: "back", label: "Back", short: "Back" },
  { id: "arms", label: "Arms & Shoulders", short: "Arms" },
  { id: "legs", label: "Legs & Thighs", short: "Legs" },
  { id: "glutes", label: "Glutes", short: "Glutes" },
  { id: "core", label: "Abs & Core", short: "Core" },
  { id: "yoga", label: "Yoga & Flexibility", short: "Yoga" },
  { id: "senior", label: "Senior-Friendly Exercises", short: "Senior" },
  { id: "functional", label: "Functional Fitness", short: "Functional" },
];

export const EQUIPMENT = [
  { id: "bodyweight", label: "Bodyweight & Floor" },
  { id: "dumbbell", label: "Dumbbells & Kettlebells" },
  { id: "barbell", label: "Barbells & Racks" },
  { id: "machine", label: "Machines & Cables" },
  { id: "band", label: "Bands & Suspension" },
  { id: "bench", label: "Benches, Steps & Chairs" },
  { id: "cardio", label: "Cardio Machines & Pool" },
  { id: "props", label: "Props & Mobility Aids" },
];

export const LEVELS = ["beginner", "intermediate", "advanced"];

// AI demo clips generated for the catalog (stored as permanent video URLs).
export const DEMO_VIDEOS = {
  "VIT-001": "https://media.base44.com/videos/public/6afbd52c2f8bd7e10d10de9b/5a2c0b661_generated_video.mp4",
  "VIT-016": "https://media.base44.com/videos/public/6afbd52c2f8bd7e10d10de9b/49594de0a_generated_video.mp4",
  "VIT-047": "https://media.base44.com/videos/public/6afbd52c2f8bd7e10d10de9b/e3a9d4bed_generated_video.mp4",
  "VIT-079": "https://media.base44.com/videos/public/6afbd52c2f8bd7e10d10de9b/05db59459_generated_video.mp4",
};

const BASE_EXERCISES = [
  // Weight Reduction & Cardio
  { id: "VIT-001", name: "Marching in Place", cat: "cardio", equip: "bodyweight", level: "beginner", style: "Low-impact cardio", desc: "March on the spot, lifting knees comfortably and swinging opposite arms." },
  { id: "VIT-002", name: "Brisk March with Arm Drive", cat: "cardio", equip: "bodyweight", level: "beginner", style: "Low-impact cardio", desc: "March faster while driving arms forward and back." },
  { id: "VIT-003", name: "Step Touch", cat: "cardio", equip: "bodyweight", level: "beginner", style: "Dance cardio", desc: "Step sideways and bring the other foot in; alternate directions." },
  { id: "VIT-004", name: "Double Step Touch", cat: "cardio", equip: "bodyweight", level: "beginner", style: "Dance cardio", desc: "Take two small steps in one direction, then return." },
  { id: "VIT-005", name: "Side-to-Side Step with Reach", cat: "cardio", equip: "bodyweight", level: "beginner", style: "Low-impact cardio", desc: "Step laterally while reaching arms overhead or outward." },
  { id: "VIT-006", name: "Alternating Knee Lifts", cat: "cardio", equip: "bodyweight", level: "beginner", style: "Low-impact cardio", desc: "Lift one knee at a time toward hip height without leaning back." },
  { id: "VIT-007", name: "Standing Heel Kicks", cat: "cardio", equip: "bodyweight", level: "beginner", style: "Low-impact cardio", desc: "Bring heels gently toward the glutes while stepping in place." },
  { id: "VIT-008", name: "Low-Impact Jumping Jack", cat: "cardio", equip: "bodyweight", level: "beginner", style: "Low-impact cardio", desc: "Step one foot out as arms rise, then return; alternate sides." },
  { id: "VIT-009", name: "Grapevine Step", cat: "cardio", equip: "bodyweight", level: "beginner", style: "Dance cardio", desc: "Travel sideways by crossing one foot behind, then step out." },
  { id: "VIT-010", name: "V-Step", cat: "cardio", equip: "bodyweight", level: "beginner", style: "Dance cardio", desc: "Step feet wide forward into a V, then step together back." },
  { id: "VIT-011", name: "Shadow Boxing", cat: "cardio", equip: "bodyweight", level: "intermediate", style: "Cardio boxing", desc: "Alternate straight punches into the air while keeping wrists aligned." },
  { id: "VIT-012", name: "Mountain Climbers", cat: "cardio", equip: "bodyweight", level: "intermediate", style: "Floor cardio", desc: "In a strong plank, alternate knee drives at a steady pace." },

  // Chest
  { id: "VIT-013", name: "Wall Push-Up", cat: "chest", equip: "bodyweight", level: "beginner", style: "Horizontal push", desc: "Hands on the wall at chest height; bend elbows and press back to straight arms." },
  { id: "VIT-014", name: "Incline Push-Up", cat: "chest", equip: "bench", level: "beginner", style: "Horizontal push", desc: "Hands on a bench, body in one line, lower your chest and press away." },
  { id: "VIT-015", name: "Knee Push-Up", cat: "chest", equip: "bodyweight", level: "beginner", style: "Horizontal push", desc: "From your knees, keep hips in line with shoulders as you lower and press." },
  { id: "VIT-016", name: "Standard Push-Up", cat: "chest", equip: "bodyweight", level: "intermediate", style: "Horizontal push", desc: "Chest to just above the floor, elbows at 45 degrees, press back up." },
  { id: "VIT-017", name: "Wide-Grip Push-Up", cat: "chest", equip: "bodyweight", level: "intermediate", style: "Horizontal push", desc: "Hands wider than shoulders to bias the chest; keep the core braced." },
  { id: "VIT-018", name: "Diamond Push-Up", cat: "chest", equip: "bodyweight", level: "advanced", style: "Horizontal push", desc: "Hands together under the chest; elbows stay close to the ribs." },
  { id: "VIT-019", name: "Dumbbell Floor Press", cat: "chest", equip: "dumbbell", level: "beginner", style: "Horizontal push", desc: "Lie on the floor, press dumbbells up until arms are straight, lower with control." },
  { id: "VIT-020", name: "Dumbbell Bench Press", cat: "chest", equip: "dumbbell", level: "intermediate", style: "Horizontal push", desc: "Press dumbbells over the chest, lower to the ribs, wrists stacked over elbows." },
  { id: "VIT-021", name: "Band Chest Press", cat: "chest", equip: "band", level: "beginner", style: "Horizontal push", desc: "Anchor the band behind you and press both handles forward to straight arms." },
  { id: "VIT-022", name: "Cable Chest Fly", cat: "chest", equip: "machine", level: "intermediate", style: "Horizontal pull-in", desc: "Sweep the handles together in front of the chest with a soft elbow bend." },

  // Back
  { id: "VIT-023", name: "Prone Y-T-W Raise", cat: "back", equip: "bodyweight", level: "beginner", style: "Posture", desc: "Face down, lift arms into Y, T then W shapes, squeezing the shoulder blades." },
  { id: "VIT-024", name: "Band Pull-Apart", cat: "back", equip: "band", level: "beginner", style: "Posture", desc: "Hold the band at chest height and pull it apart until arms are wide." },
  { id: "VIT-025", name: "Dumbbell Bent-Over Row", cat: "back", equip: "dumbbell", level: "intermediate", style: "Horizontal pull", desc: "Hinge to a flat back and row the dumbbells toward your hips." },
  { id: "VIT-026", name: "Single-Arm Dumbbell Row", cat: "back", equip: "dumbbell", level: "beginner", style: "Horizontal pull", desc: "Support one hand on a bench and row the weight along your side." },
  { id: "VIT-027", name: "Seated Cable Row", cat: "back", equip: "machine", level: "beginner", style: "Horizontal pull", desc: "Sit tall and pull the handle to your ribs without leaning back." },
  { id: "VIT-028", name: "Lat Pulldown", cat: "back", equip: "machine", level: "beginner", style: "Vertical pull", desc: "Pull the bar toward your upper chest, elbows driving down, chest proud." },
  { id: "VIT-029", name: "Inverted Row", cat: "back", equip: "barbell", level: "intermediate", style: "Horizontal pull", desc: "Hang under a fixed bar and pull your chest toward it, body in one line." },
  { id: "VIT-030", name: "Superman Hold", cat: "back", equip: "bodyweight", level: "beginner", style: "Posture", desc: "Face down, lift arms and legs a few inches and hold while breathing steadily." },
  { id: "VIT-031", name: "Band Lat Pulldown", cat: "back", equip: "band", level: "beginner", style: "Vertical pull", desc: "Anchor the band high and pull the handles down to shoulder height." },
  { id: "VIT-032", name: "Barbell Bent-Over Row", cat: "back", equip: "barbell", level: "advanced", style: "Horizontal pull", desc: "Hinge with a neutral spine and row the bar to your lower ribs." },

  // Arms & Shoulders
  { id: "VIT-033", name: "Dumbbell Bicep Curl", cat: "arms", equip: "dumbbell", level: "beginner", style: "Arms", desc: "Curl the weights to your shoulders, elbows pinned to your sides." },
  { id: "VIT-034", name: "Hammer Curl", cat: "arms", equip: "dumbbell", level: "beginner", style: "Arms", desc: "Curl with palms facing in to work the forearms and biceps." },
  { id: "VIT-035", name: "Band Bicep Curl", cat: "arms", equip: "band", level: "beginner", style: "Arms", desc: "Stand on the band and curl the handles up, resisting on the way down." },
  { id: "VIT-036", name: "Triceps Kickback", cat: "arms", equip: "dumbbell", level: "beginner", style: "Arms", desc: "Hinge forward and straighten the elbow behind you, upper arm still." },
  { id: "VIT-037", name: "Bench Dip", cat: "arms", equip: "bench", level: "intermediate", style: "Arms", desc: "Hands on the bench edge, lower until elbows bend to 90 degrees, then press." },
  { id: "VIT-038", name: "Overhead Triceps Extension", cat: "arms", equip: "dumbbell", level: "intermediate", style: "Arms", desc: "Hold one weight overhead and lower it behind your head, elbows close." },
  { id: "VIT-039", name: "Lateral Raise", cat: "arms", equip: "dumbbell", level: "beginner", style: "Shoulders", desc: "Lift the weights out to shoulder height with a soft elbow." },
  { id: "VIT-040", name: "Front Raise", cat: "arms", equip: "dumbbell", level: "beginner", style: "Shoulders", desc: "Raise the weights forward to shoulder height, ribs down." },
  { id: "VIT-041", name: "Dumbbell Shoulder Press", cat: "arms", equip: "dumbbell", level: "intermediate", style: "Shoulders", desc: "Press the weights overhead until arms are straight, then lower to ear height." },
  { id: "VIT-042", name: "Arnold Press", cat: "arms", equip: "dumbbell", level: "advanced", style: "Shoulders", desc: "Start palms in, rotate out as you press overhead for full shoulder work." },
  { id: "VIT-043", name: "Band Face Pull", cat: "arms", equip: "band", level: "beginner", style: "Posture", desc: "Pull the band toward your face, elbows high and wide." },
  { id: "VIT-044", name: "Barbell Upright Row", cat: "arms", equip: "barbell", level: "advanced", style: "Shoulders", desc: "Draw the bar up along your body to chest height, elbows leading." },

  // Legs & Thighs
  { id: "VIT-045", name: "Bodyweight Squat", cat: "legs", equip: "bodyweight", level: "beginner", style: "Squat", desc: "Sit back and down, knees tracking over toes, then stand tall." },
  { id: "VIT-046", name: "Chair Squat", cat: "legs", equip: "bench", level: "beginner", style: "Squat", desc: "Lower until you lightly touch a chair, then stand without using your hands." },
  { id: "VIT-047", name: "Goblet Squat", cat: "legs", equip: "dumbbell", level: "intermediate", style: "Squat", desc: "Hold a weight at your chest, squat between your knees and drive up." },
  { id: "VIT-048", name: "Split Squat", cat: "legs", equip: "bodyweight", level: "intermediate", style: "Single leg", desc: "Staggered stance; lower straight down and press through the front heel." },
  { id: "VIT-049", name: "Reverse Lunge", cat: "legs", equip: "bodyweight", level: "beginner", style: "Single leg", desc: "Step back, lower the back knee, then return to standing." },
  { id: "VIT-050", name: "Walking Lunge", cat: "legs", equip: "bodyweight", level: "intermediate", style: "Single leg", desc: "Lunge forward and step through into the next rep, chest tall." },
  { id: "VIT-051", name: "Step-Up", cat: "legs", equip: "bench", level: "beginner", style: "Step", desc: "Step onto a low platform, stand tall, then lower with control." },
  { id: "VIT-052", name: "Lateral Step-Up", cat: "legs", equip: "bench", level: "intermediate", style: "Step", desc: "Face sideways and step onto the platform, alternating sides." },
  { id: "VIT-053", name: "Wall Sit", cat: "legs", equip: "bodyweight", level: "beginner", style: "Isometric", desc: "Slide down the wall to a sitting angle and hold, breathing steadily." },
  { id: "VIT-054", name: "Leg Extension", cat: "legs", equip: "machine", level: "beginner", style: "Machine", desc: "Straighten the knees against the pad, pause, then lower slowly." },
  { id: "VIT-055", name: "Seated Leg Curl", cat: "legs", equip: "machine", level: "beginner", style: "Machine", desc: "Curl the pad under you with your heels, then release with control." },
  { id: "VIT-056", name: "Standing Calf Raise", cat: "legs", equip: "bodyweight", level: "beginner", style: "Isolation", desc: "Rise onto the balls of your feet, pause at the top, lower slowly." },

  // Glutes
  { id: "VIT-057", name: "Glute Bridge", cat: "glutes", equip: "bodyweight", level: "beginner", style: "Bridge", desc: "Lie on your back and lift your hips until knees, hips and shoulders align." },
  { id: "VIT-058", name: "Single-Leg Glute Bridge", cat: "glutes", equip: "bodyweight", level: "intermediate", style: "Bridge", desc: "Bridge on one leg while the other stays lifted, keeping hips level." },
  { id: "VIT-059", name: "Hip Thrust", cat: "glutes", equip: "bench", level: "intermediate", style: "Bridge", desc: "Shoulders on a bench, drive the hips up and squeeze at the top." },
  { id: "VIT-060", name: "Donkey Kick", cat: "glutes", equip: "bodyweight", level: "beginner", style: "Floor", desc: "On all fours, press one heel toward the ceiling without arching the back." },
  { id: "VIT-061", name: "Fire Hydrant", cat: "glutes", equip: "bodyweight", level: "beginner", style: "Floor", desc: "On all fours, lift one knee out to the side, keeping hips square." },
  { id: "VIT-062", name: "Clamshell", cat: "glutes", equip: "band", level: "beginner", style: "Floor", desc: "Side-lying with a band above the knees, open the top knee and lower." },
  { id: "VIT-063", name: "Banded Lateral Walk", cat: "glutes", equip: "band", level: "intermediate", style: "Standing", desc: "Band above the knees, step sideways keeping constant tension." },
  { id: "VIT-064", name: "Sumo Squat", cat: "glutes", equip: "dumbbell", level: "intermediate", style: "Squat", desc: "Wide stance, toes turned out, lower straight down and drive up." },
  { id: "VIT-065", name: "Romanian Deadlift", cat: "glutes", equip: "barbell", level: "intermediate", style: "Hinge", desc: "Push hips back with a flat back, then squeeze the glutes to stand." },
  { id: "VIT-066", name: "Cable Glute Kickback", cat: "glutes", equip: "machine", level: "beginner", style: "Machine", desc: "Kick one leg back against the cable, keeping the torso still." },

  // Abs & Core
  { id: "VIT-067", name: "Dead Bug", cat: "core", equip: "bodyweight", level: "beginner", style: "Core stability", desc: "Lie on your back and lower opposite arm and leg while keeping the ribs down." },
  { id: "VIT-068", name: "Bird Dog", cat: "core", equip: "bodyweight", level: "beginner", style: "Core stability", desc: "On all fours, reach opposite arm and leg out long and hold." },
  { id: "VIT-069", name: "Forearm Plank", cat: "core", equip: "bodyweight", level: "beginner", style: "Isometric", desc: "Elbows under shoulders, one straight line from head to heel." },
  { id: "VIT-070", name: "Side Plank", cat: "core", equip: "bodyweight", level: "intermediate", style: "Isometric", desc: "Stack the shoulder over the elbow and lift the hips into one line." },
  { id: "VIT-071", name: "Hollow Hold", cat: "core", equip: "bodyweight", level: "advanced", style: "Isometric", desc: "Lower back pressed down, shoulders and legs lifted, hold the shape." },
  { id: "VIT-072", name: "Basic Crunch", cat: "core", equip: "bodyweight", level: "beginner", style: "Flexion", desc: "Curl the shoulders off the floor with the chin slightly tucked." },
  { id: "VIT-073", name: "Reverse Crunch", cat: "core", equip: "bodyweight", level: "beginner", style: "Flexion", desc: "Draw the knees toward your chest and lift the hips slightly." },
  { id: "VIT-074", name: "Bicycle Crunch", cat: "core", equip: "bodyweight", level: "intermediate", style: "Rotation", desc: "Alternate elbow to opposite knee with slow, controlled rotation." },
  { id: "VIT-075", name: "Russian Twist", cat: "core", equip: "bodyweight", level: "intermediate", style: "Rotation", desc: "Seated with a tall spine, rotate the ribs side to side." },
  { id: "VIT-076", name: "Lying Leg Raise", cat: "core", equip: "bodyweight", level: "intermediate", style: "Flexion", desc: "Keep the lower back down as you raise straight legs and lower slowly." },
  { id: "VIT-077", name: "Slow Mountain Climber", cat: "core", equip: "bodyweight", level: "beginner", style: "Core stability", desc: "From a plank, step knees forward one at a time without bouncing." },
  { id: "VIT-078", name: "Pallof Press", cat: "core", equip: "band", level: "intermediate", style: "Anti-rotation", desc: "Press the band straight out from your chest and resist the twist." },

  // Yoga & Flexibility
  { id: "VIT-079", name: "Cat-Cow", cat: "yoga", equip: "bodyweight", level: "beginner", style: "Spine mobility", desc: "On all fours, alternate rounding and arching the spine with the breath." },
  { id: "VIT-080", name: "Child's Pose", cat: "yoga", equip: "bodyweight", level: "beginner", style: "Restorative", desc: "Knees wide, hips back to heels, arms long and forehead relaxed." },
  { id: "VIT-081", name: "Downward Dog", cat: "yoga", equip: "bodyweight", level: "beginner", style: "Full body stretch", desc: "Hips high, heels reaching down, lengthen the spine and relax the neck." },
  { id: "VIT-082", name: "Cobra Stretch", cat: "yoga", equip: "bodyweight", level: "beginner", style: "Backbend", desc: "Face down, press the chest up with soft elbows and open the front body." },
  { id: "VIT-083", name: "Seated Forward Fold", cat: "yoga", equip: "bodyweight", level: "beginner", style: "Hamstrings", desc: "Hinge from the hips over straight legs, spine long, no bouncing." },
  { id: "VIT-084", name: "Figure-Four Stretch", cat: "yoga", equip: "bodyweight", level: "beginner", style: "Hips", desc: "Ankle over opposite knee and lean forward to release the glute." },
  { id: "VIT-085", name: "Kneeling Hip Flexor Stretch", cat: "yoga", equip: "bodyweight", level: "beginner", style: "Hips", desc: "Half-kneel, tuck the pelvis and shift gently forward." },
  { id: "VIT-086", name: "Thoracic Rotation", cat: "yoga", equip: "bodyweight", level: "beginner", style: "Spine mobility", desc: "On all fours, thread one arm under and rotate the upper back." },
  { id: "VIT-087", name: "World's Greatest Stretch", cat: "yoga", equip: "bodyweight", level: "intermediate", style: "Full body stretch", desc: "Deep lunge, elbow to instep, then open the chest toward the ceiling." },
  { id: "VIT-088", name: "Standing Hamstring Stretch", cat: "yoga", equip: "bodyweight", level: "beginner", style: "Hamstrings", desc: "Heel forward, hips back, hinge with a long spine until you feel the stretch." },
  { id: "VIT-089", name: "Neck Release", cat: "yoga", equip: "bodyweight", level: "beginner", style: "Upper body", desc: "Gently tilt the ear toward the shoulder and hold, then switch sides." },
  { id: "VIT-090", name: "Savasana", cat: "yoga", equip: "bodyweight", level: "beginner", style: "Restorative", desc: "Lie flat with palms up and let the breath slow for a few minutes." },

  // Senior-Friendly
  { id: "VIT-091", name: "Seated March", cat: "senior", equip: "bench", level: "beginner", style: "Seated cardio", desc: "Sit tall and lift alternate knees as if marching in place." },
  { id: "VIT-092", name: "Seated Knee Extension", cat: "senior", equip: "bench", level: "beginner", style: "Seated strength", desc: "Straighten one leg at a time and hold briefly before lowering." },
  { id: "VIT-093", name: "Chair Stand", cat: "senior", equip: "bench", level: "beginner", style: "Standing strength", desc: "Stand up from the chair without hands, then sit back down slowly." },
  { id: "VIT-094", name: "Standing Heel Raise", cat: "senior", equip: "bench", level: "beginner", style: "Balance", desc: "Hold the chair back and rise onto your toes, then lower with control." },
  { id: "VIT-095", name: "Seated Toe Taps", cat: "senior", equip: "bench", level: "beginner", style: "Seated mobility", desc: "Tap alternate toes forward while keeping the back supported." },
  { id: "VIT-096", name: "Seated Overhead Reach", cat: "senior", equip: "bench", level: "beginner", style: "Seated mobility", desc: "Reach both arms overhead within a pain-free range and breathe." },
  { id: "VIT-097", name: "Standing Balance Hold", cat: "senior", equip: "bodyweight", level: "beginner", style: "Balance", desc: "Hold a chair and stand on one foot for a few seconds, then switch." },
  { id: "VIT-098", name: "Seated Band Row", cat: "senior", equip: "band", level: "beginner", style: "Seated strength", desc: "Band around the feet, pull the handles to your ribs, elbows back." },
  { id: "VIT-099", name: "Supported Wall Push-Up", cat: "senior", equip: "bodyweight", level: "beginner", style: "Upper body", desc: "Hands on the wall, bend and straighten the elbows slowly." },
  { id: "VIT-100", name: "Slow Side Steps", cat: "senior", equip: "bodyweight", level: "beginner", style: "Balance", desc: "Step sideways with control, keeping a hand near support." },

  // Functional Fitness
  { id: "VIT-101", name: "Farmer Carry", cat: "functional", equip: "dumbbell", level: "beginner", style: "Carry", desc: "Walk tall with a weight in each hand, shoulders back and core braced." },
  { id: "VIT-102", name: "Kettlebell Swing", cat: "functional", equip: "dumbbell", level: "intermediate", style: "Hinge", desc: "Hinge and snap the hips to swing the weight to chest height." },
  { id: "VIT-103", name: "Medicine Ball Slam", cat: "functional", equip: "props", level: "intermediate", style: "Power", desc: "Lift the ball overhead and slam it down, hinging at the hips." },
  { id: "VIT-104", name: "Bear Crawl", cat: "functional", equip: "bodyweight", level: "intermediate", style: "Crawl", desc: "Knees hover as you crawl forward with opposite hand and foot." },
  { id: "VIT-105", name: "Low Box Jump", cat: "functional", equip: "bench", level: "advanced", style: "Power", desc: "Jump onto a low platform and land softly, knees tracking forward." },
  { id: "VIT-106", name: "Dumbbell Thruster", cat: "functional", equip: "dumbbell", level: "advanced", style: "Full body", desc: "Squat with weights at the shoulders, then drive up and press overhead." },
  { id: "VIT-107", name: "Turkish Get-Up", cat: "functional", equip: "dumbbell", level: "advanced", style: "Full body", desc: "Rise from lying to standing while keeping one arm locked overhead." },
  { id: "VIT-108", name: "Suitcase Carry", cat: "functional", equip: "dumbbell", level: "beginner", style: "Carry", desc: "Carry one weight at your side without leaning or letting the ribs flare." },
  { id: "VIT-109", name: "Banded Monster Walk", cat: "functional", equip: "band", level: "beginner", style: "Standing", desc: "Band at the ankles, step forward and out on a diagonal." },
  { id: "VIT-110", name: "Step-Back Burpee", cat: "functional", equip: "bodyweight", level: "advanced", style: "Conditioning", desc: "Step back to a plank, step in, stand and reach overhead." },
  { id: "VIT-111", name: "Jump Rope", cat: "functional", equip: "props", level: "intermediate", style: "Conditioning", desc: "Small bounces from the ankles with relaxed shoulders and steady rhythm." },
  { id: "VIT-112", name: "Wall Ball", cat: "functional", equip: "props", level: "advanced", style: "Full body", desc: "Squat with the ball, then throw it to a target and catch on the way down." },
];

// 500 moves: the original gallery plus the three extension files.
export const EXERCISES = [...BASE_EXERCISES, ...extra1, ...extra2, ...extra3];

export const CATEGORY_LABEL = Object.fromEntries(CATEGORIES.map((c) => [c.id, c.label]));
export const CATEGORY_SHORT = Object.fromEntries(CATEGORIES.map((c) => [c.id, c.short]));
export const EQUIPMENT_LABEL = Object.fromEntries(EQUIPMENT.map((e) => [e.id, e.label]));

export const EQUIPMENT_SHORT = {
  bodyweight: "No equipment",
  dumbbell: "Dumbbells",
  barbell: "Barbell",
  machine: "Machine",
  band: "Resistance band",
  bench: "Bench / step",
  cardio: "Cardio machine",
  props: "Props",
};