export interface ExercisePhase {
  name: string;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  description: string;
}

/** Keyed by exercise id from exercises.ts */
export const MUSCLE_PHASES: Record<string, ExercisePhase[]> = {
  // ── UPPER BODY ───────────────────────────────────────────────
  "push-up": [
    {
      name: "Setup",
      primaryMuscles: ["chest", "shoulders", "triceps"],
      secondaryMuscles: ["abs", "traps"],
      description: "High plank position, core braced",
    },
    {
      name: "Eccentric (Lower)",
      primaryMuscles: ["chest", "shoulders"],
      secondaryMuscles: ["triceps", "abs"],
      description: "Lowering chest toward floor under control",
    },
    {
      name: "Concentric (Push)",
      primaryMuscles: ["chest", "triceps"],
      secondaryMuscles: ["shoulders", "abs"],
      description: "Press up through the hands explosively",
    },
    {
      name: "Lock-Out",
      primaryMuscles: ["triceps"],
      secondaryMuscles: ["chest", "shoulders"],
      description: "Arms fully extended, squeeze chest",
    },
  ],
  "dumbbell-bench-press": [
    {
      name: "Setup",
      primaryMuscles: ["chest", "shoulders"],
      secondaryMuscles: ["triceps", "traps"],
      description: "Dumbbells at chest level, feet flat",
    },
    {
      name: "Eccentric (Lower)",
      primaryMuscles: ["chest", "shoulders"],
      secondaryMuscles: ["triceps", "abs"],
      description: "Controlled descent to chest level",
    },
    {
      name: "Concentric (Press)",
      primaryMuscles: ["chest", "triceps"],
      secondaryMuscles: ["shoulders", "abs"],
      description: "Drive dumbbells up and inward",
    },
    {
      name: "Peak Contraction",
      primaryMuscles: ["chest", "triceps"],
      secondaryMuscles: ["shoulders"],
      description: "Squeeze chest at top, slight inward arc",
    },
  ],
  "pull-up": [
    {
      name: "Dead Hang",
      primaryMuscles: ["lats", "forearms"],
      secondaryMuscles: ["traps", "abs"],
      description: "Full hang, shoulder blades depressed",
    },
    {
      name: "Initiation",
      primaryMuscles: ["lats", "traps"],
      secondaryMuscles: ["biceps", "abs"],
      description: "Depress scapula, initiate the pull",
    },
    {
      name: "Pull",
      primaryMuscles: ["lats", "biceps"],
      secondaryMuscles: ["traps", "abs"],
      description: "Drive elbows down toward hips",
    },
    {
      name: "Peak",
      primaryMuscles: ["lats", "biceps"],
      secondaryMuscles: ["traps", "forearms"],
      description: "Chin over bar, fully contracted lats",
    },
  ],
  "overhead-press": [
    {
      name: "Rack Position",
      primaryMuscles: ["shoulders", "traps"],
      secondaryMuscles: ["triceps", "abs"],
      description: "Bar at shoulder height, core tight",
    },
    {
      name: "Initial Drive",
      primaryMuscles: ["shoulders", "triceps"],
      secondaryMuscles: ["traps", "abs"],
      description: "Press bar straight up past the face",
    },
    {
      name: "Lockout",
      primaryMuscles: ["triceps", "shoulders"],
      secondaryMuscles: ["traps", "abs"],
      description: "Arms locked overhead, shrug slightly",
    },
  ],
  "tricep-dips": [
    {
      name: "Support Position",
      primaryMuscles: ["triceps", "chest"],
      secondaryMuscles: ["shoulders", "abs"],
      description: "Arms extended, body suspended",
    },
    {
      name: "Descent",
      primaryMuscles: ["triceps", "chest"],
      secondaryMuscles: ["shoulders"],
      description: "Lower until upper arms parallel to floor",
    },
    {
      name: "Press Up",
      primaryMuscles: ["triceps"],
      secondaryMuscles: ["chest", "shoulders"],
      description: "Drive through hands to full extension",
    },
  ],
  "barbell-row": [
    {
      name: "Hip Hinge",
      primaryMuscles: ["lower_back", "hamstrings"],
      secondaryMuscles: ["glutes", "abs"],
      description: "Torso hinged, bar hanging at arms",
    },
    {
      name: "Pull Initiation",
      primaryMuscles: ["lats", "traps"],
      secondaryMuscles: ["biceps", "lower_back"],
      description: "Initiate pull by retracting shoulder blades",
    },
    {
      name: "Row",
      primaryMuscles: ["lats", "biceps"],
      secondaryMuscles: ["traps", "forearms"],
      description: "Pull bar toward lower sternum",
    },
    {
      name: "Peak Contraction",
      primaryMuscles: ["lats", "traps"],
      secondaryMuscles: ["biceps", "lower_back"],
      description: "Bar touches body, back fully squeezed",
    },
  ],
  "diamond-push-up": [
    {
      name: "Setup",
      primaryMuscles: ["triceps", "chest"],
      secondaryMuscles: ["shoulders", "abs"],
      description: "Diamond hand position, body straight",
    },
    {
      name: "Eccentric",
      primaryMuscles: ["triceps", "chest"],
      secondaryMuscles: ["shoulders"],
      description: "Elbows tracking back, chest descends",
    },
    {
      name: "Concentric",
      primaryMuscles: ["triceps"],
      secondaryMuscles: ["chest", "shoulders"],
      description: "Drive up through triceps powerfully",
    },
  ],

  // ── LOWER BODY ──────────────────────────────────────────────
  squat: [
    {
      name: "Standing Ready",
      primaryMuscles: ["quads", "glutes"],
      secondaryMuscles: ["abs", "calves"],
      description: "Feet shoulder-width, weight in heels",
    },
    {
      name: "Descent",
      primaryMuscles: ["quads", "glutes"],
      secondaryMuscles: ["hamstrings", "abs"],
      description: "Hip crease below parallel",
    },
    {
      name: "Ascent",
      primaryMuscles: ["quads", "glutes"],
      secondaryMuscles: ["hamstrings", "calves"],
      description: "Drive through full foot to stand",
    },
    {
      name: "Lock-Out",
      primaryMuscles: ["glutes", "quads"],
      secondaryMuscles: ["abs", "calves"],
      description: "Hips fully extended, glutes squeezed",
    },
  ],
  "barbell-squat": [
    {
      name: "Bar Setup",
      primaryMuscles: ["traps", "shoulders"],
      secondaryMuscles: ["abs", "lower_back"],
      description: "Bar on upper traps, stance set",
    },
    {
      name: "Descent",
      primaryMuscles: ["quads", "glutes"],
      secondaryMuscles: ["hamstrings", "abs", "lower_back"],
      description: "Hip crease below parallel",
    },
    {
      name: "Drive",
      primaryMuscles: ["quads", "glutes"],
      secondaryMuscles: ["hamstrings", "lower_back"],
      description: "Explosive ascent, chest leading",
    },
    {
      name: "Lockout",
      primaryMuscles: ["glutes", "quads"],
      secondaryMuscles: ["traps", "abs"],
      description: "Stand tall, squeeze glutes",
    },
  ],
  "romanian-deadlift": [
    {
      name: "Hinge Start",
      primaryMuscles: ["hamstrings", "glutes"],
      secondaryMuscles: ["lower_back", "abs"],
      description: "Hip hinge begins, slight knee bend",
    },
    {
      name: "Eccentric",
      primaryMuscles: ["hamstrings", "lower_back"],
      secondaryMuscles: ["glutes", "abs"],
      description: "Weight lowers along the legs",
    },
    {
      name: "Stretch",
      primaryMuscles: ["hamstrings"],
      secondaryMuscles: ["glutes", "lower_back"],
      description: "Peak hamstring stretch at bottom",
    },
    {
      name: "Hip Drive",
      primaryMuscles: ["glutes", "hamstrings"],
      secondaryMuscles: ["lower_back", "traps"],
      description: "Drive hips forward, return to tall",
    },
  ],
  lunges: [
    {
      name: "Step Forward",
      primaryMuscles: ["quads", "glutes"],
      secondaryMuscles: ["calves", "abs"],
      description: "Front foot lands, knee tracks",
    },
    {
      name: "Descent",
      primaryMuscles: ["quads", "glutes"],
      secondaryMuscles: ["hamstrings", "abs"],
      description: "Back knee descends toward floor",
    },
    {
      name: "Drive",
      primaryMuscles: ["quads", "glutes"],
      secondaryMuscles: ["calves", "hamstrings"],
      description: "Push off front foot to step",
    },
  ],
  "glute-bridge": [
    {
      name: "Setup",
      primaryMuscles: ["glutes", "hamstrings"],
      secondaryMuscles: ["abs", "lower_back"],
      description: "Lying, knees bent, feet flat",
    },
    {
      name: "Bridge Up",
      primaryMuscles: ["glutes"],
      secondaryMuscles: ["hamstrings", "abs"],
      description: "Drive heels into floor, lift hips",
    },
    {
      name: "Peak Hold",
      primaryMuscles: ["glutes"],
      secondaryMuscles: ["hamstrings", "lower_back"],
      description: "Hips fully extended, glutes maxed",
    },
  ],
  "calf-raises": [
    {
      name: "Neutral Stance",
      primaryMuscles: ["calves"],
      secondaryMuscles: ["tibialis", "abs"],
      description: "Weight evenly distributed",
    },
    {
      name: "Rise",
      primaryMuscles: ["calves"],
      secondaryMuscles: ["tibialis"],
      description: "Rise onto balls of feet",
    },
    {
      name: "Peak",
      primaryMuscles: ["calves"],
      secondaryMuscles: ["tibialis"],
      description: "Full plantar flexion, squeeze",
    },
  ],
  "sumo-squat": [
    {
      name: "Wide Stance",
      primaryMuscles: ["quads", "adductors"],
      secondaryMuscles: ["glutes", "abs"],
      description: "Feet wide, toes pointed out",
    },
    {
      name: "Descent",
      primaryMuscles: ["adductors", "quads"],
      secondaryMuscles: ["glutes", "abs"],
      description: "Knees track over toes outward",
    },
    {
      name: "Ascent",
      primaryMuscles: ["glutes", "adductors"],
      secondaryMuscles: ["quads", "calves"],
      description: "Drive up through heels, squeeze",
    },
  ],

  // ── CORE ────────────────────────────────────────────────────
  plank: [
    {
      name: "Forearm Plank",
      primaryMuscles: ["abs", "obliques"],
      secondaryMuscles: ["shoulders", "glutes", "traps"],
      description: "Elbows under shoulders, body straight",
    },
    {
      name: "Hold Phase",
      primaryMuscles: ["abs", "obliques"],
      secondaryMuscles: ["lower_back", "glutes"],
      description: "Max tension throughout, breathe steadily",
    },
    {
      name: "Endurance",
      primaryMuscles: ["abs"],
      secondaryMuscles: ["obliques", "shoulders", "traps"],
      description: "Sustain position, hips locked in",
    },
  ],
  "bicycle-crunches": [
    {
      name: "Starting Position",
      primaryMuscles: ["abs", "obliques"],
      secondaryMuscles: ["hip_flexors"],
      description: "Hands behind head, legs raised",
    },
    {
      name: "Rotation Right",
      primaryMuscles: ["obliques", "abs"],
      secondaryMuscles: ["hip_flexors", "quads"],
      description: "Left elbow to right knee, twist",
    },
    {
      name: "Rotation Left",
      primaryMuscles: ["obliques", "abs"],
      secondaryMuscles: ["hip_flexors", "quads"],
      description: "Right elbow to left knee, twist",
    },
  ],
  "hanging-leg-raise": [
    {
      name: "Dead Hang",
      primaryMuscles: ["lats", "forearms"],
      secondaryMuscles: ["traps", "abs"],
      description: "Full hang, core braced",
    },
    {
      name: "Raise",
      primaryMuscles: ["abs", "hip_flexors"],
      secondaryMuscles: ["lats", "obliques"],
      description: "Legs rise to parallel, slow",
    },
    {
      name: "Peak",
      primaryMuscles: ["abs", "hip_flexors"],
      secondaryMuscles: ["lats", "obliques"],
      description: "Legs parallel or above, peak crunch",
    },
  ],
  "russian-twist": [
    {
      name: "Seated Balance",
      primaryMuscles: ["abs", "obliques"],
      secondaryMuscles: ["hip_flexors", "lower_back"],
      description: "Leaning back 45°, feet elevated",
    },
    {
      name: "Rotate Right",
      primaryMuscles: ["obliques"],
      secondaryMuscles: ["abs", "lower_back"],
      description: "Torso twists right, weight follows",
    },
    {
      name: "Rotate Left",
      primaryMuscles: ["obliques"],
      secondaryMuscles: ["abs", "lower_back"],
      description: "Torso twists left, weight follows",
    },
  ],
  "ab-rollout": [
    {
      name: "Kneeling Start",
      primaryMuscles: ["abs", "shoulders"],
      secondaryMuscles: ["lats", "hip_flexors"],
      description: "Kneeling, hands on wheel, core engaged",
    },
    {
      name: "Roll Out",
      primaryMuscles: ["abs", "lats"],
      secondaryMuscles: ["shoulders", "hip_flexors"],
      description: "Extend body forward under control",
    },
    {
      name: "Full Extension",
      primaryMuscles: ["abs", "lats"],
      secondaryMuscles: ["shoulders", "lower_back"],
      description: "Maximally extended, back flat",
    },
    {
      name: "Pull Back",
      primaryMuscles: ["abs", "lats"],
      secondaryMuscles: ["shoulders", "hip_flexors"],
      description: "Pull wheel back to knees",
    },
  ],
  "dead-bug": [
    {
      name: "Starting Position",
      primaryMuscles: ["abs", "hip_flexors"],
      secondaryMuscles: ["lower_back", "shoulders"],
      description: "Arms up, knees at 90°, back flat",
    },
    {
      name: "Extend Right Arm / Left Leg",
      primaryMuscles: ["abs", "hip_flexors"],
      secondaryMuscles: ["lower_back", "obliques"],
      description: "Lower opposite limbs slowly",
    },
    {
      name: "Extend Left Arm / Right Leg",
      primaryMuscles: ["abs", "hip_flexors"],
      secondaryMuscles: ["lower_back", "obliques"],
      description: "Alternate side, same control",
    },
  ],

  // ── CARDIO ───────────────────────────────────────────────────
  burpees: [
    {
      name: "Standing",
      primaryMuscles: ["quads", "glutes"],
      secondaryMuscles: ["calves", "abs"],
      description: "Ready position, weight centered",
    },
    {
      name: "Drop to Plank",
      primaryMuscles: ["chest", "shoulders"],
      secondaryMuscles: ["abs", "triceps"],
      description: "Hands down, jump feet back",
    },
    {
      name: "Push-Up",
      primaryMuscles: ["chest", "triceps"],
      secondaryMuscles: ["shoulders", "abs"],
      description: "Full push-up at bottom",
    },
    {
      name: "Jump Up",
      primaryMuscles: ["quads", "glutes", "calves"],
      secondaryMuscles: ["abs", "shoulders"],
      description: "Explosive jump with arms overhead",
    },
  ],
  "jump-rope": [
    {
      name: "Grip and Stance",
      primaryMuscles: ["calves", "shoulders"],
      secondaryMuscles: ["abs", "forearms"],
      description: "Handles light, elbows at sides",
    },
    {
      name: "Jump",
      primaryMuscles: ["calves"],
      secondaryMuscles: ["abs", "tibialis"],
      description: "Small jump, balls of feet",
    },
    {
      name: "Swing",
      primaryMuscles: ["shoulders", "forearms"],
      secondaryMuscles: ["calves", "abs"],
      description: "Wrist rotation drives the rope",
    },
  ],
  "box-jumps": [
    {
      name: "Prep",
      primaryMuscles: ["quads", "glutes"],
      secondaryMuscles: ["calves", "abs"],
      description: "Arms swing back, knees bend",
    },
    {
      name: "Launch",
      primaryMuscles: ["quads", "glutes", "calves"],
      secondaryMuscles: ["abs", "hip_flexors"],
      description: "Explosive takeoff from both feet",
    },
    {
      name: "Landing",
      primaryMuscles: ["quads", "glutes"],
      secondaryMuscles: ["calves", "abs"],
      description: "Soft landing, absorb with knees",
    },
  ],
  "mountain-climbers": [
    {
      name: "Plank Hold",
      primaryMuscles: ["shoulders", "abs"],
      secondaryMuscles: ["traps", "obliques"],
      description: "High plank, hips level",
    },
    {
      name: "Drive Right Knee",
      primaryMuscles: ["hip_flexors", "abs"],
      secondaryMuscles: ["quads", "shoulders"],
      description: "Knee drives to chest explosively",
    },
    {
      name: "Drive Left Knee",
      primaryMuscles: ["hip_flexors", "abs"],
      secondaryMuscles: ["quads", "shoulders"],
      description: "Alternate, running motion",
    },
  ],
  "high-knees": [
    {
      name: "Standing",
      primaryMuscles: ["hip_flexors", "quads"],
      secondaryMuscles: ["abs", "calves"],
      description: "Standing, weight on balls of feet",
    },
    {
      name: "Right Knee Drive",
      primaryMuscles: ["hip_flexors", "quads"],
      secondaryMuscles: ["abs", "calves"],
      description: "Drive right knee to hip height",
    },
    {
      name: "Left Knee Drive",
      primaryMuscles: ["hip_flexors", "quads"],
      secondaryMuscles: ["abs", "calves"],
      description: "Drive left knee to hip height",
    },
  ],
  rowing: [
    {
      name: "Catch",
      primaryMuscles: ["quads", "calves"],
      secondaryMuscles: ["abs", "lats"],
      description: "Knees bent, arms extended forward",
    },
    {
      name: "Drive",
      primaryMuscles: ["quads", "glutes"],
      secondaryMuscles: ["hamstrings", "abs"],
      description: "Leg drive first, power through",
    },
    {
      name: "Pull",
      primaryMuscles: ["lats", "biceps"],
      secondaryMuscles: ["traps", "abs"],
      description: "Arms pull handle to lower chest",
    },
    {
      name: "Recovery",
      primaryMuscles: ["hamstrings", "lats"],
      secondaryMuscles: ["abs", "glutes"],
      description: "Arms extend, lean forward, knees bend",
    },
  ],

  // ── FLEXIBILITY ─────────────────────────────────────────────
  "forward-fold": [
    {
      name: "Standing Tall",
      primaryMuscles: ["hamstrings", "calves"],
      secondaryMuscles: ["lower_back", "abs"],
      description: "Feet hip-width, spine neutral",
    },
    {
      name: "Hinge",
      primaryMuscles: ["hamstrings", "lower_back"],
      secondaryMuscles: ["calves", "glutes"],
      description: "Fold from hips, not the waist",
    },
    {
      name: "Deep Stretch",
      primaryMuscles: ["hamstrings"],
      secondaryMuscles: ["lower_back", "calves"],
      description: "Breathe into the stretch",
    },
  ],
  "pigeon-pose": [
    {
      name: "Setup",
      primaryMuscles: ["glutes", "hip_flexors"],
      secondaryMuscles: ["quads", "adductors"],
      description: "Front shin across, rear leg extended",
    },
    {
      name: "Hip Sink",
      primaryMuscles: ["glutes", "hip_flexors"],
      secondaryMuscles: ["adductors", "quads"],
      description: "Hips descend toward the floor",
    },
    {
      name: "Fold Forward",
      primaryMuscles: ["glutes"],
      secondaryMuscles: ["lower_back", "hip_flexors"],
      description: "Torso folds over front shin",
    },
  ],
  "seated-hamstring-stretch": [
    {
      name: "Seated",
      primaryMuscles: ["hamstrings", "lower_back"],
      secondaryMuscles: ["calves", "abs"],
      description: "Legs extended, hips hinged",
    },
    {
      name: "Reach",
      primaryMuscles: ["hamstrings"],
      secondaryMuscles: ["lower_back", "calves"],
      description: "Hands toward feet, breathe out",
    },
    {
      name: "Hold",
      primaryMuscles: ["hamstrings"],
      secondaryMuscles: ["calves", "lower_back"],
      description: "30-60 seconds at full stretch",
    },
  ],
  "quad-stretch": [
    {
      name: "Single Leg Balance",
      primaryMuscles: ["quads", "calves"],
      secondaryMuscles: ["abs", "hip_flexors"],
      description: "Standing on one foot",
    },
    {
      name: "Pull Ankle",
      primaryMuscles: ["quads", "hip_flexors"],
      secondaryMuscles: ["abs"],
      description: "Ankle pulled to glutes",
    },
    {
      name: "Hold",
      primaryMuscles: ["quads"],
      secondaryMuscles: ["hip_flexors", "calves"],
      description: "Sustained quad stretch",
    },
  ],
  "yoga-flow": [
    {
      name: "Mountain / Forward Fold",
      primaryMuscles: ["hamstrings", "lower_back"],
      secondaryMuscles: ["calves", "abs"],
      description: "Sweep up, fold forward",
    },
    {
      name: "Plank / Chaturanga",
      primaryMuscles: ["chest", "triceps"],
      secondaryMuscles: ["shoulders", "abs"],
      description: "Low plank, body hovering",
    },
    {
      name: "Upward Dog",
      primaryMuscles: ["abs", "lower_back"],
      secondaryMuscles: ["chest", "shoulders"],
      description: "Chest open, hips lifted",
    },
    {
      name: "Downward Dog",
      primaryMuscles: ["hamstrings", "calves"],
      secondaryMuscles: ["shoulders", "lats"],
      description: "Hips up, heels press down",
    },
  ],

  // ── STRENGTH ────────────────────────────────────────────────
  deadlift: [
    {
      name: "Setup",
      primaryMuscles: ["lower_back", "lats"],
      secondaryMuscles: ["hamstrings", "traps", "abs"],
      description: "Bar over mid-foot, spine neutral",
    },
    {
      name: "Leg Drive",
      primaryMuscles: ["quads", "glutes"],
      secondaryMuscles: ["hamstrings", "lower_back"],
      description: "Drive floor away with legs",
    },
    {
      name: "Hip Hinge",
      primaryMuscles: ["hamstrings", "glutes"],
      secondaryMuscles: ["lower_back", "traps"],
      description: "Bar passes knees, hips come through",
    },
    {
      name: "Lockout",
      primaryMuscles: ["glutes", "traps"],
      secondaryMuscles: ["hamstrings", "lower_back"],
      description: "Hips and shoulders finish simultaneously",
    },
  ],
  "clean-and-press": [
    {
      name: "Setup",
      primaryMuscles: ["lower_back", "quads"],
      secondaryMuscles: ["hamstrings", "lats"],
      description: "Bar at mid-shin, athletic stance",
    },
    {
      name: "Pull",
      primaryMuscles: ["quads", "traps"],
      secondaryMuscles: ["lats", "hamstrings"],
      description: "Explosive pull, triple extension",
    },
    {
      name: "Clean",
      primaryMuscles: ["shoulders", "traps"],
      secondaryMuscles: ["biceps", "abs"],
      description: "Bar caught in front rack",
    },
    {
      name: "Press",
      primaryMuscles: ["shoulders", "triceps"],
      secondaryMuscles: ["traps", "abs"],
      description: "Press bar to overhead lockout",
    },
  ],
  "farmers-carry": [
    {
      name: "Pick Up",
      primaryMuscles: ["traps", "forearms"],
      secondaryMuscles: ["lats", "abs"],
      description: "Hinge to pick up weights",
    },
    {
      name: "Carry",
      primaryMuscles: ["traps", "forearms"],
      secondaryMuscles: ["abs", "shoulders"],
      description: "Walk tall, shoulders packed",
    },
    {
      name: "Stabilize",
      primaryMuscles: ["abs", "traps"],
      secondaryMuscles: ["lats", "quads"],
      description: "Resist lateral lean, core tight",
    },
  ],
  "kettlebell-swing": [
    {
      name: "Hike",
      primaryMuscles: ["hamstrings", "glutes"],
      secondaryMuscles: ["lower_back", "lats"],
      description: "Hike bell back between legs",
    },
    {
      name: "Hip Drive",
      primaryMuscles: ["glutes", "hamstrings"],
      secondaryMuscles: ["lower_back", "abs"],
      description: "Explosive hip extension",
    },
    {
      name: "Float",
      primaryMuscles: ["shoulders", "abs"],
      secondaryMuscles: ["traps", "lats"],
      description: "Bell floats to shoulder height",
    },
    {
      name: "Hinge Back",
      primaryMuscles: ["hamstrings", "lower_back"],
      secondaryMuscles: ["glutes", "abs"],
      description: "Bell descends, reload the hips",
    },
  ],

  // ── BALANCE ─────────────────────────────────────────────────
  "single-leg-deadlift": [
    {
      name: "Single Leg Stand",
      primaryMuscles: ["glutes", "calves"],
      secondaryMuscles: ["abs", "hamstrings"],
      description: "Weight on one leg, core stable",
    },
    {
      name: "Hinge",
      primaryMuscles: ["glutes", "hamstrings"],
      secondaryMuscles: ["lower_back", "abs"],
      description: "Free leg extends back as torso tips",
    },
    {
      name: "Bottom Position",
      primaryMuscles: ["hamstrings", "glutes"],
      secondaryMuscles: ["lower_back", "abs"],
      description: "T-shape body, flat back",
    },
    {
      name: "Return",
      primaryMuscles: ["glutes", "hamstrings"],
      secondaryMuscles: ["abs", "calves"],
      description: "Hip drive to standing",
    },
  ],
  "bosu-squat": [
    {
      name: "Mount",
      primaryMuscles: ["quads", "abs"],
      secondaryMuscles: ["calves", "tibialis"],
      description: "Step onto BOSU, find balance",
    },
    {
      name: "Descent",
      primaryMuscles: ["quads", "glutes"],
      secondaryMuscles: ["abs", "calves"],
      description: "Controlled squat on unstable surface",
    },
    {
      name: "Ascent",
      primaryMuscles: ["quads", "glutes"],
      secondaryMuscles: ["calves", "abs"],
      description: "Press up, re-stabilize",
    },
  ],
  "tree-pose": [
    {
      name: "Root",
      primaryMuscles: ["calves", "abs"],
      secondaryMuscles: ["quads", "hip_flexors"],
      description: "Weight fully on standing leg",
    },
    {
      name: "Lift",
      primaryMuscles: ["abs", "adductors"],
      secondaryMuscles: ["calves", "glutes"],
      description: "Foot placed on inner thigh/calf",
    },
    {
      name: "Hold",
      primaryMuscles: ["abs", "calves"],
      secondaryMuscles: ["adductors", "glutes"],
      description: "Tall posture, gaze fixed",
    },
  ],
  "warrior-3": [
    {
      name: "Forward Fold Start",
      primaryMuscles: ["hamstrings", "glutes"],
      secondaryMuscles: ["abs", "lower_back"],
      description: "Weight shifting to front foot",
    },
    {
      name: "Leg Extension",
      primaryMuscles: ["glutes", "hamstrings"],
      secondaryMuscles: ["abs", "lower_back"],
      description: "Rear leg lifts to parallel",
    },
    {
      name: "T-Balance",
      primaryMuscles: ["glutes", "abs"],
      secondaryMuscles: ["hamstrings", "shoulders"],
      description: "Full T-shape, arms forward",
    },
  ],

  // ── MOBILITY ─────────────────────────────────────────────────
  "worlds-greatest-stretch": [
    {
      name: "Deep Lunge",
      primaryMuscles: ["hip_flexors", "quads"],
      secondaryMuscles: ["adductors", "calves"],
      description: "Front foot forward, rear knee down",
    },
    {
      name: "Thoracic Rotation",
      primaryMuscles: ["obliques", "shoulders"],
      secondaryMuscles: ["traps", "lats"],
      description: "Arm reaches toward ceiling",
    },
    {
      name: "Inside Reach",
      primaryMuscles: ["lats", "obliques"],
      secondaryMuscles: ["shoulders", "hip_flexors"],
      description: "Arm threads inside, torso opens",
    },
    {
      name: "Hamstring Rock",
      primaryMuscles: ["hamstrings", "calves"],
      secondaryMuscles: ["glutes", "lower_back"],
      description: "Rock back, straighten front leg",
    },
  ],
  "90-90-stretch": [
    {
      name: "Setup",
      primaryMuscles: ["glutes", "adductors"],
      secondaryMuscles: ["hip_flexors", "abs"],
      description: "Both legs in 90° position",
    },
    {
      name: "Tall Sit",
      primaryMuscles: ["glutes", "hip_flexors"],
      secondaryMuscles: ["abs", "lower_back"],
      description: "Upright posture, hold",
    },
    {
      name: "Forward Lean",
      primaryMuscles: ["glutes", "adductors"],
      secondaryMuscles: ["hip_flexors", "lower_back"],
      description: "Lean over front shin",
    },
  ],
  "ankle-circles": [
    {
      name: "Lift Foot",
      primaryMuscles: ["calves", "tibialis"],
      secondaryMuscles: ["abs"],
      description: "One foot lifted, knee bent",
    },
    {
      name: "Clockwise Circle",
      primaryMuscles: ["calves", "tibialis"],
      secondaryMuscles: [],
      description: "Full ankle circle, clockwise",
    },
    {
      name: "Counter-Clockwise",
      primaryMuscles: ["tibialis", "calves"],
      secondaryMuscles: [],
      description: "Full ankle circle, counter-clockwise",
    },
  ],
  "thoracic-rotation": [
    {
      name: "Quadruped",
      primaryMuscles: ["abs", "lower_back"],
      secondaryMuscles: ["shoulders", "traps"],
      description: "On hands and knees, spine neutral",
    },
    {
      name: "Rotation Down",
      primaryMuscles: ["obliques", "lats"],
      secondaryMuscles: ["traps", "abs"],
      description: "Elbow rotates toward floor",
    },
    {
      name: "Rotation Up",
      primaryMuscles: ["obliques", "traps"],
      secondaryMuscles: ["lats", "shoulders"],
      description: "Elbow opens toward ceiling",
    },
  ],
  "hip-flexor-stretch": [
    {
      name: "Kneeling Lunge",
      primaryMuscles: ["hip_flexors", "quads"],
      secondaryMuscles: ["glutes", "abs"],
      description: "Rear knee down, front foot forward",
    },
    {
      name: "Hip Shift",
      primaryMuscles: ["hip_flexors"],
      secondaryMuscles: ["quads", "glutes"],
      description: "Hips push forward for stretch",
    },
    {
      name: "Hold",
      primaryMuscles: ["hip_flexors"],
      secondaryMuscles: ["quads", "abs"],
      description: "30-60 second sustained stretch",
    },
  ],
  "cat-cow": [
    {
      name: "Neutral Spine",
      primaryMuscles: ["abs", "lower_back"],
      secondaryMuscles: ["traps", "shoulders"],
      description: "Quadruped, neutral starting position",
    },
    {
      name: "Cow (Inhale)",
      primaryMuscles: ["lower_back"],
      secondaryMuscles: ["abs", "traps"],
      description: "Belly drops, head and tail lift",
    },
    {
      name: "Cat (Exhale)",
      primaryMuscles: ["abs", "obliques"],
      secondaryMuscles: ["lower_back"],
      description: "Back rounds, head tucks, tailbone under",
    },
  ],

  // ── ADDITIONAL UPPER BODY ──────────────────────────────────
  "face-pull": [
    {
      name: "Start Position",
      primaryMuscles: ["shoulders", "traps"],
      secondaryMuscles: ["biceps", "forearms"],
      description: "Arms extended, palms facing in",
    },
    {
      name: "Pull",
      primaryMuscles: ["shoulders", "traps"],
      secondaryMuscles: ["biceps", "forearms"],
      description: "Pull rope to face, elbows flare",
    },
    {
      name: "Peak",
      primaryMuscles: ["shoulders", "traps"],
      secondaryMuscles: ["biceps"],
      description: "External rotation, rear delts squeezed",
    },
  ],
  "incline-pushup": [
    {
      name: "Elevated Plank",
      primaryMuscles: ["chest", "shoulders"],
      secondaryMuscles: ["triceps", "abs"],
      description: "Hands on bench, body straight",
    },
    {
      name: "Lower",
      primaryMuscles: ["chest", "shoulders"],
      secondaryMuscles: ["triceps"],
      description: "Chest toward bench",
    },
    {
      name: "Press Up",
      primaryMuscles: ["chest", "triceps"],
      secondaryMuscles: ["shoulders", "abs"],
      description: "Push up to full extension",
    },
  ],

  // ── ADDITIONAL CARDIO ───────────────────────────────────────
  "sprint-intervals": [
    {
      name: "Drive Phase",
      primaryMuscles: ["quads", "glutes"],
      secondaryMuscles: ["hamstrings", "calves"],
      description: "Explosive leg drive at sprint start",
    },
    {
      name: "Top Speed",
      primaryMuscles: ["quads", "hamstrings"],
      secondaryMuscles: ["glutes", "calves", "abs"],
      description: "Maximum velocity, full stride",
    },
    {
      name: "Recovery Jog",
      primaryMuscles: ["calves", "quads"],
      secondaryMuscles: ["abs", "hip_flexors"],
      description: "Easy jog, breathing recovers",
    },
  ],
  "jumping-jacks": [
    {
      name: "Start",
      primaryMuscles: ["calves", "abs"],
      secondaryMuscles: ["shoulders"],
      description: "Feet together, arms at sides",
    },
    {
      name: "Jump Out",
      primaryMuscles: ["calves", "adductors"],
      secondaryMuscles: ["shoulders", "abs"],
      description: "Feet out, arms raise overhead",
    },
    {
      name: "Jump Back",
      primaryMuscles: ["adductors", "calves"],
      secondaryMuscles: ["shoulders", "abs"],
      description: "Return to start position",
    },
  ],

  // ── ADDITIONAL STRENGTH ─────────────────────────────────────
  "dumbbell-curl": [
    {
      name: "Hang",
      primaryMuscles: ["biceps", "forearms"],
      secondaryMuscles: ["shoulders", "traps"],
      description: "Arms hanging, palms forward",
    },
    {
      name: "Curl Up",
      primaryMuscles: ["biceps"],
      secondaryMuscles: ["forearms", "shoulders"],
      description: "Curl weights toward shoulders",
    },
    {
      name: "Peak Squeeze",
      primaryMuscles: ["biceps"],
      secondaryMuscles: ["forearms"],
      description: "Full bicep contraction at top",
    },
  ],
  "bench-dip": [
    {
      name: "Support",
      primaryMuscles: ["triceps", "chest"],
      secondaryMuscles: ["shoulders", "abs"],
      description: "Hands on bench, hips off",
    },
    {
      name: "Lower",
      primaryMuscles: ["triceps"],
      secondaryMuscles: ["chest", "shoulders"],
      description: "Elbows bend to 90°",
    },
    {
      name: "Press",
      primaryMuscles: ["triceps"],
      secondaryMuscles: ["chest", "shoulders"],
      description: "Drive up to full extension",
    },
  ],

  // ── ADDITIONAL CORE ─────────────────────────────────────────
  "flutter-kicks": [
    {
      name: "Setup",
      primaryMuscles: ["abs", "hip_flexors"],
      secondaryMuscles: ["lower_back", "quads"],
      description: "Legs raised, lower back flat",
    },
    {
      name: "Right Kick",
      primaryMuscles: ["hip_flexors", "abs"],
      secondaryMuscles: ["quads"],
      description: "Right leg lowers, left rises",
    },
    {
      name: "Left Kick",
      primaryMuscles: ["hip_flexors", "abs"],
      secondaryMuscles: ["quads"],
      description: "Left leg lowers, right rises",
    },
  ],
  "v-ups": [
    {
      name: "Flat Start",
      primaryMuscles: ["abs", "hip_flexors"],
      secondaryMuscles: ["lower_back"],
      description: "Fully extended on floor",
    },
    {
      name: "V-Up",
      primaryMuscles: ["abs", "hip_flexors"],
      secondaryMuscles: ["quads", "lower_back"],
      description: "Legs and torso rise simultaneously",
    },
    {
      name: "Peak V",
      primaryMuscles: ["abs"],
      secondaryMuscles: ["hip_flexors", "quads"],
      description: "Hands reach feet, full contraction",
    },
  ],

  // ── ADDITIONAL FLEXIBILITY ──────────────────────────────────
  "chest-opener": [
    {
      name: "Hands Clasped",
      primaryMuscles: ["chest", "shoulders"],
      secondaryMuscles: ["biceps", "traps"],
      description: "Hands clasped behind back",
    },
    {
      name: "Open",
      primaryMuscles: ["chest", "shoulders"],
      secondaryMuscles: ["biceps", "traps"],
      description: "Lift hands, chest opens upward",
    },
    {
      name: "Hold",
      primaryMuscles: ["chest"],
      secondaryMuscles: ["shoulders", "biceps"],
      description: "Sustained chest stretch",
    },
  ],
  "cobra-stretch": [
    {
      name: "Face Down",
      primaryMuscles: ["abs", "lower_back"],
      secondaryMuscles: ["chest", "shoulders"],
      description: "Hands under shoulders, hips down",
    },
    {
      name: "Lift",
      primaryMuscles: ["lower_back", "abs"],
      secondaryMuscles: ["chest", "shoulders"],
      description: "Press hands, chest lifts",
    },
    {
      name: "Hold",
      primaryMuscles: ["abs", "lower_back"],
      secondaryMuscles: ["chest"],
      description: "Full stretch held 20-30s",
    },
  ],

  // ── ADDITIONAL MOBILITY ─────────────────────────────────────
  "lateral-band-walk": [
    {
      name: "Band Ready",
      primaryMuscles: ["glutes", "adductors"],
      secondaryMuscles: ["quads", "abs"],
      description: "Band above knees, partial squat",
    },
    {
      name: "Step Out",
      primaryMuscles: ["glutes", "adductors"],
      secondaryMuscles: ["quads", "calves"],
      description: "Lead foot steps sideways",
    },
    {
      name: "Bring Feet Together",
      primaryMuscles: ["adductors", "glutes"],
      secondaryMuscles: ["quads", "calves"],
      description: "Trail foot follows, tension maintained",
    },
  ],

  // ── ADDITIONAL BALANCE ───────────────────────────────────────
  "heel-to-toe-walk": [
    {
      name: "Standing Ready",
      primaryMuscles: ["calves", "abs"],
      secondaryMuscles: ["tibialis", "quads"],
      description: "Tall posture, gaze forward",
    },
    {
      name: "Heel Plant",
      primaryMuscles: ["tibialis", "calves"],
      secondaryMuscles: ["abs", "quads"],
      description: "Heel of front foot meets toe of back",
    },
    {
      name: "Toe Off",
      primaryMuscles: ["calves", "tibialis"],
      secondaryMuscles: ["abs", "glutes"],
      description: "Push off rear toe, repeat pattern",
    },
  ],

  // ── PUSH-UP VARIANTS ─────────────────────────────────────────
  "wall-push-up": [
    {
      name: "Setup",
      primaryMuscles: ["chest", "shoulders"],
      secondaryMuscles: ["triceps", "abs"],
      description: "Hands on wall, body at angle",
    },
    {
      name: "Eccentric (Lower)",
      primaryMuscles: ["chest", "shoulders"],
      secondaryMuscles: ["triceps", "abs"],
      description: "Lean chest toward wall, elbows bend",
    },
    {
      name: "Concentric (Push)",
      primaryMuscles: ["chest", "triceps"],
      secondaryMuscles: ["shoulders", "abs"],
      description: "Press away from wall through hands",
    },
    {
      name: "Lock-Out",
      primaryMuscles: ["triceps"],
      secondaryMuscles: ["chest", "shoulders"],
      description: "Arms fully extended, chest away from wall",
    },
  ],
  "knee-push-up": [
    {
      name: "Setup",
      primaryMuscles: ["chest", "shoulders"],
      secondaryMuscles: ["triceps", "abs"],
      description: "Kneeling plank, core braced",
    },
    {
      name: "Eccentric (Lower)",
      primaryMuscles: ["chest", "shoulders"],
      secondaryMuscles: ["triceps", "abs"],
      description: "Chest descends toward floor under control",
    },
    {
      name: "Concentric (Push)",
      primaryMuscles: ["chest", "triceps"],
      secondaryMuscles: ["shoulders", "abs"],
      description: "Press through hands back to start",
    },
    {
      name: "Lock-Out",
      primaryMuscles: ["triceps"],
      secondaryMuscles: ["chest", "shoulders"],
      description: "Arms extended, squeeze chest",
    },
  ],
  "decline-push-up": [
    {
      name: "Setup",
      primaryMuscles: ["chest", "shoulders"],
      secondaryMuscles: ["triceps", "abs"],
      description: "Feet elevated, hands on floor, body angled",
    },
    {
      name: "Eccentric (Lower)",
      primaryMuscles: ["chest", "shoulders"],
      secondaryMuscles: ["triceps", "abs"],
      description: "Upper chest descends toward floor",
    },
    {
      name: "Concentric (Push)",
      primaryMuscles: ["chest", "triceps"],
      secondaryMuscles: ["shoulders", "abs"],
      description: "Explosive press back to top",
    },
    {
      name: "Peak",
      primaryMuscles: ["triceps", "shoulders"],
      secondaryMuscles: ["chest", "abs"],
      description: "Full extension, upper chest peak squeeze",
    },
  ],
  "pike-push-up": [
    {
      name: "Pike Position",
      primaryMuscles: ["shoulders", "traps"],
      secondaryMuscles: ["abs", "lats"],
      description: "Inverted V, hips high, weight in hands",
    },
    {
      name: "Eccentric (Lower)",
      primaryMuscles: ["shoulders", "triceps"],
      secondaryMuscles: ["traps", "abs"],
      description: "Head descends toward floor, elbows bend",
    },
    {
      name: "Concentric (Press)",
      primaryMuscles: ["shoulders", "triceps"],
      secondaryMuscles: ["traps", "abs"],
      description: "Press back up to pike through shoulders",
    },
    {
      name: "Lock-Out",
      primaryMuscles: ["triceps", "shoulders"],
      secondaryMuscles: ["traps", "abs"],
      description: "Arms locked, return to high pike",
    },
  ],
  "archer-push-up": [
    {
      name: "Wide Plank",
      primaryMuscles: ["chest", "shoulders"],
      secondaryMuscles: ["triceps", "abs"],
      description: "Wide hand stance, body in line",
    },
    {
      name: "Shift & Lower",
      primaryMuscles: ["chest", "triceps"],
      secondaryMuscles: ["shoulders", "abs"],
      description: "Weight shifts to one side, other arm extends",
    },
    {
      name: "Bottom Position",
      primaryMuscles: ["chest", "shoulders"],
      secondaryMuscles: ["triceps", "abs"],
      description: "One arm loaded fully, other straight",
    },
    {
      name: "Press & Return",
      primaryMuscles: ["chest", "triceps"],
      secondaryMuscles: ["shoulders", "abs"],
      description: "Drive through loaded arm back to center",
    },
  ],

  // ── PULL-UP VARIANTS ─────────────────────────────────────────
  "dead-hang": [
    {
      name: "Grip Setup",
      primaryMuscles: ["forearms", "lats"],
      secondaryMuscles: ["traps", "abs"],
      description: "Hands on bar, palms away, shoulder-width",
    },
    {
      name: "Full Hang",
      primaryMuscles: ["lats", "forearms"],
      secondaryMuscles: ["traps", "abs"],
      description: "Body fully relaxed, spine decompressing",
    },
    {
      name: "Active Hang",
      primaryMuscles: ["lats", "traps"],
      secondaryMuscles: ["forearms", "abs"],
      description: "Shoulder blades depressed, core light",
    },
    {
      name: "Hold",
      primaryMuscles: ["forearms", "lats"],
      secondaryMuscles: ["traps", "abs"],
      description: "Sustained grip, breathing steady",
    },
  ],
  "inverted-row": [
    {
      name: "Starting Position",
      primaryMuscles: ["lats", "traps"],
      secondaryMuscles: ["biceps", "abs"],
      description: "Arms extended, body straight under bar",
    },
    {
      name: "Retract",
      primaryMuscles: ["traps", "lats"],
      secondaryMuscles: ["biceps", "forearms"],
      description: "Shoulder blades draw together first",
    },
    {
      name: "Pull",
      primaryMuscles: ["lats", "biceps"],
      secondaryMuscles: ["traps", "forearms"],
      description: "Chest rises toward bar, elbows drive back",
    },
    {
      name: "Peak Row",
      primaryMuscles: ["lats", "traps"],
      secondaryMuscles: ["biceps", "forearms"],
      description: "Chest touches bar, full back contraction",
    },
  ],
  "band-assisted-pull-up": [
    {
      name: "Hanging Start",
      primaryMuscles: ["lats", "forearms"],
      secondaryMuscles: ["traps", "abs"],
      description: "Full hang with band support, core light",
    },
    {
      name: "Initiation",
      primaryMuscles: ["lats", "traps"],
      secondaryMuscles: ["biceps", "abs"],
      description: "Scapula depresses, pull begins",
    },
    {
      name: "Pull Phase",
      primaryMuscles: ["lats", "biceps"],
      secondaryMuscles: ["traps", "forearms"],
      description: "Elbows drive toward hips",
    },
    {
      name: "Chin Over Bar",
      primaryMuscles: ["lats", "biceps"],
      secondaryMuscles: ["traps", "forearms"],
      description: "Chin clears the bar, full contraction",
    },
  ],
  "chin-up": [
    {
      name: "Dead Hang",
      primaryMuscles: ["lats", "forearms"],
      secondaryMuscles: ["biceps", "abs"],
      description: "Supinated grip, full hang, scapula set",
    },
    {
      name: "Initiation",
      primaryMuscles: ["lats", "biceps"],
      secondaryMuscles: ["traps", "abs"],
      description: "Elbows drive down and back",
    },
    {
      name: "Pull",
      primaryMuscles: ["lats", "biceps"],
      secondaryMuscles: ["traps", "forearms"],
      description: "Chest rises, arms fully engage",
    },
    {
      name: "Peak",
      primaryMuscles: ["lats", "biceps"],
      secondaryMuscles: ["traps", "forearms"],
      description: "Chin above bar, maximum contraction",
    },
  ],
  "weighted-pull-up": [
    {
      name: "Loaded Hang",
      primaryMuscles: ["lats", "forearms"],
      secondaryMuscles: ["traps", "abs"],
      description: "Extra load hanging, full dead hang",
    },
    {
      name: "Drive",
      primaryMuscles: ["lats", "traps"],
      secondaryMuscles: ["biceps", "abs"],
      description: "Explosive pull initiation against load",
    },
    {
      name: "Pull Through",
      primaryMuscles: ["lats", "biceps"],
      secondaryMuscles: ["traps", "forearms"],
      description: "Full pull despite extra weight",
    },
    {
      name: "Peak & Control",
      primaryMuscles: ["lats", "biceps"],
      secondaryMuscles: ["traps", "forearms"],
      description: "Chin over bar, then slow eccentric descent",
    },
  ],
  "archer-pull-up": [
    {
      name: "Wide Hang",
      primaryMuscles: ["lats", "forearms"],
      secondaryMuscles: ["traps", "abs"],
      description: "Extra-wide grip, full hang",
    },
    {
      name: "Shift & Pull",
      primaryMuscles: ["lats", "biceps"],
      secondaryMuscles: ["traps", "abs"],
      description: "Weight shifts to one arm as pull starts",
    },
    {
      name: "One-Arm Top",
      primaryMuscles: ["lats", "biceps"],
      secondaryMuscles: ["traps", "forearms"],
      description: "One arm bent at top, other fully straight",
    },
    {
      name: "Controlled Lower",
      primaryMuscles: ["lats", "traps"],
      secondaryMuscles: ["biceps", "forearms"],
      description: "Slow eccentric back to wide hang",
    },
  ],

  // ── SQUAT VARIANTS ───────────────────────────────────────────
  "goblet-squat": [
    {
      name: "Goblet Hold",
      primaryMuscles: ["quads", "glutes"],
      secondaryMuscles: ["traps", "abs"],
      description: "Weight at chest, feet wide, toes out",
    },
    {
      name: "Descent",
      primaryMuscles: ["quads", "glutes"],
      secondaryMuscles: ["hamstrings", "adductors"],
      description: "Elbows track inside knees on the way down",
    },
    {
      name: "Deep Squat",
      primaryMuscles: ["quads", "glutes"],
      secondaryMuscles: ["adductors", "calves"],
      description: "Elbows inside knees, full depth",
    },
    {
      name: "Drive Up",
      primaryMuscles: ["quads", "glutes"],
      secondaryMuscles: ["hamstrings", "abs"],
      description: "Drive through full foot, hips and chest rise",
    },
  ],
  "bulgarian-split-squat": [
    {
      name: "Setup",
      primaryMuscles: ["quads", "hip_flexors"],
      secondaryMuscles: ["glutes", "abs"],
      description: "Rear foot elevated, front foot forward",
    },
    {
      name: "Descent",
      primaryMuscles: ["quads", "glutes"],
      secondaryMuscles: ["hamstrings", "hip_flexors"],
      description: "Rear knee descends toward floor",
    },
    {
      name: "Bottom Position",
      primaryMuscles: ["quads", "glutes"],
      secondaryMuscles: ["hamstrings", "adductors"],
      description: "Front thigh parallel, deep stretch",
    },
    {
      name: "Drive Up",
      primaryMuscles: ["quads", "glutes"],
      secondaryMuscles: ["hamstrings", "calves"],
      description: "Press through front heel to standing",
    },
  ],
  "pistol-squat-progression": [
    {
      name: "Single Leg Balance",
      primaryMuscles: ["quads", "glutes"],
      secondaryMuscles: ["abs", "calves"],
      description: "Weight on one leg, other extended forward",
    },
    {
      name: "Controlled Descent",
      primaryMuscles: ["quads", "glutes"],
      secondaryMuscles: ["hamstrings", "abs"],
      description: "Single-leg squat with free leg hovering",
    },
    {
      name: "Full Depth",
      primaryMuscles: ["quads", "glutes"],
      secondaryMuscles: ["hamstrings", "calves", "adductors"],
      description: "Glute nearly at heel, maximum depth",
    },
    {
      name: "Press Up",
      primaryMuscles: ["quads", "glutes"],
      secondaryMuscles: ["abs", "calves"],
      description: "Single-leg drive back to standing",
    },
  ],

  // ── WARMUP EXERCISES ─────────────────────────────────────────
  "warmup-arm-circles": [
    {
      name: "Small Circles",
      primaryMuscles: ["shoulders"],
      secondaryMuscles: ["traps", "forearms"],
      description: "Arms extended, small forward circles",
    },
    {
      name: "Large Forward Circles",
      primaryMuscles: ["shoulders", "traps"],
      secondaryMuscles: ["chest", "lats"],
      description: "Full range forward circle sweeps",
    },
    {
      name: "Large Backward Circles",
      primaryMuscles: ["shoulders", "traps"],
      secondaryMuscles: ["lats", "chest"],
      description: "Reversed direction, rear deltoid emphasis",
    },
    {
      name: "Shoulder Activation",
      primaryMuscles: ["shoulders"],
      secondaryMuscles: ["traps", "lats"],
      description: "Feel warmth in shoulder joint throughout",
    },
  ],
  "warmup-leg-swings": [
    {
      name: "Front-Back Swing",
      primaryMuscles: ["hip_flexors", "hamstrings"],
      secondaryMuscles: ["glutes", "calves"],
      description: "Leg swings forward and back, momentum-driven",
    },
    {
      name: "Hip Flexor Extension",
      primaryMuscles: ["hip_flexors"],
      secondaryMuscles: ["quads", "abs"],
      description: "Leg swings behind, hip flexor stretches",
    },
    {
      name: "Lateral Swing",
      primaryMuscles: ["adductors", "glutes"],
      secondaryMuscles: ["hip_flexors", "abs"],
      description: "Cross-body swing opens hip rotators",
    },
    {
      name: "Full Range",
      primaryMuscles: ["hamstrings", "glutes"],
      secondaryMuscles: ["hip_flexors", "calves"],
      description: "Maximum range, all hip angles covered",
    },
  ],
  "warmup-hip-flexor-mobilization": [
    {
      name: "Deep Lunge",
      primaryMuscles: ["hip_flexors", "quads"],
      secondaryMuscles: ["glutes", "adductors"],
      description: "Front foot forward, rear knee on floor",
    },
    {
      name: "Knee Drive",
      primaryMuscles: ["hip_flexors", "quads"],
      secondaryMuscles: ["calves", "abs"],
      description: "Knee drives forward over toes",
    },
    {
      name: "Hip Flexor Stretch",
      primaryMuscles: ["hip_flexors"],
      secondaryMuscles: ["quads", "glutes"],
      description: "Weight shifts back, rear hip opens",
    },
    {
      name: "Thoracic Rotation",
      primaryMuscles: ["obliques", "shoulders"],
      secondaryMuscles: ["traps", "hip_flexors"],
      description: "Arm reaches toward ceiling, spine rotates",
    },
  ],
  "warmup-glute-bridge": [
    {
      name: "Flat Setup",
      primaryMuscles: ["glutes", "hamstrings"],
      secondaryMuscles: ["abs", "lower_back"],
      description: "Lying, knees bent, feet flat",
    },
    {
      name: "Bridge Up",
      primaryMuscles: ["glutes"],
      secondaryMuscles: ["hamstrings", "abs"],
      description: "Hips lift, glutes engage fully",
    },
    {
      name: "Squeeze Hold",
      primaryMuscles: ["glutes"],
      secondaryMuscles: ["hamstrings", "lower_back"],
      description: "2–3 second hold, maximum glute contraction",
    },
    {
      name: "Controlled Lower",
      primaryMuscles: ["glutes", "hamstrings"],
      secondaryMuscles: ["abs", "lower_back"],
      description: "Slow return to floor, ready to repeat",
    },
  ],
  "warmup-inchworm": [
    {
      name: "Standing Hinge",
      primaryMuscles: ["hamstrings", "lower_back"],
      secondaryMuscles: ["glutes", "calves"],
      description: "Hip hinge, hands reach floor",
    },
    {
      name: "Hand Walk Out",
      primaryMuscles: ["shoulders", "abs"],
      secondaryMuscles: ["chest", "lats"],
      description: "Hands walk forward to plank",
    },
    {
      name: "Plank Hold",
      primaryMuscles: ["abs", "shoulders"],
      secondaryMuscles: ["traps", "glutes"],
      description: "2-second plank, core braced",
    },
    {
      name: "Walk Feet In",
      primaryMuscles: ["hamstrings", "calves"],
      secondaryMuscles: ["hip_flexors", "abs"],
      description: "Feet walk toward hands, hamstrings stretch",
    },
  ],
  "warmup-walking-lunges": [
    {
      name: "Step Forward",
      primaryMuscles: ["quads", "hip_flexors"],
      secondaryMuscles: ["glutes", "calves"],
      description: "Controlled step, front foot lands",
    },
    {
      name: "Descent",
      primaryMuscles: ["quads", "glutes"],
      secondaryMuscles: ["hamstrings", "abs"],
      description: "Rear knee descends slowly",
    },
    {
      name: "Drive Forward",
      primaryMuscles: ["quads", "glutes"],
      secondaryMuscles: ["calves", "hip_flexors"],
      description: "Push off front foot into next lunge",
    },
    {
      name: "Balance Transition",
      primaryMuscles: ["abs", "glutes"],
      secondaryMuscles: ["calves", "quads"],
      description: "Momentary single-leg balance between reps",
    },
  ],
  "warmup-shoulder-rolls": [
    {
      name: "Forward Roll",
      primaryMuscles: ["traps", "shoulders"],
      secondaryMuscles: ["chest", "lats"],
      description: "Shoulders roll up, forward, down",
    },
    {
      name: "Backward Roll",
      primaryMuscles: ["traps", "shoulders"],
      secondaryMuscles: ["lats", "chest"],
      description: "Shoulders roll up, back, down, open chest",
    },
    {
      name: "Retraction Squeeze",
      primaryMuscles: ["traps"],
      secondaryMuscles: ["shoulders", "lats"],
      description: "Shoulder blades drawn together and held",
    },
    {
      name: "Full Release",
      primaryMuscles: ["shoulders", "traps"],
      secondaryMuscles: ["chest", "lats"],
      description: "Complete the sequence, tension released",
    },
  ],
  "warmup-jumping-jacks": [
    {
      name: "Feet Together",
      primaryMuscles: ["calves", "adductors"],
      secondaryMuscles: ["abs", "shoulders"],
      description: "Starting position, weight on balls of feet",
    },
    {
      name: "Jump Out & Raise",
      primaryMuscles: ["adductors", "calves"],
      secondaryMuscles: ["shoulders", "abs"],
      description: "Feet jump wide, arms sweep overhead",
    },
    {
      name: "Jump In & Lower",
      primaryMuscles: ["adductors", "calves"],
      secondaryMuscles: ["shoulders", "abs"],
      description: "Feet return, arms lower to sides",
    },
    {
      name: "Rhythm Phase",
      primaryMuscles: ["calves", "shoulders"],
      secondaryMuscles: ["adductors", "abs"],
      description: "Sustained rhythm, heart rate elevated",
    },
  ],
  "warmup-mountain-climbers": [
    {
      name: "Plank Setup",
      primaryMuscles: ["abs", "shoulders"],
      secondaryMuscles: ["traps", "glutes"],
      description: "High plank, hips level, core braced",
    },
    {
      name: "Right Knee Drive",
      primaryMuscles: ["hip_flexors", "abs"],
      secondaryMuscles: ["quads", "shoulders"],
      description: "Right knee pulls slowly toward chest",
    },
    {
      name: "Left Knee Drive",
      primaryMuscles: ["hip_flexors", "abs"],
      secondaryMuscles: ["quads", "shoulders"],
      description: "Left knee follows at warm-up pace",
    },
    {
      name: "Continuous Rhythm",
      primaryMuscles: ["abs", "hip_flexors"],
      secondaryMuscles: ["shoulders", "quads"],
      description: "Slow alternating drives, warming up core",
    },
  ],
  "warmup-band-pull-aparts": [
    {
      name: "Band Extended",
      primaryMuscles: ["shoulders", "traps"],
      secondaryMuscles: ["biceps", "forearms"],
      description: "Band held at shoulder height, arms near straight",
    },
    {
      name: "Pull Apart",
      primaryMuscles: ["traps", "shoulders"],
      secondaryMuscles: ["biceps", "forearms"],
      description: "Band pulled wide, elbows drive back",
    },
    {
      name: "Peak Squeeze",
      primaryMuscles: ["traps", "shoulders"],
      secondaryMuscles: ["lats", "biceps"],
      description: "Shoulder blades maximally retracted, rear delts lit",
    },
    {
      name: "Slow Return",
      primaryMuscles: ["shoulders", "traps"],
      secondaryMuscles: ["chest", "biceps"],
      description: "Band returns to start under control",
    },
  ],
};
