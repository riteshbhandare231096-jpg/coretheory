export type WomenSection = "basic" | "advanced";
export type WomenCategory = "Lower Body" | "Core" | "Upper Body" | "Full Body";
export type WomenDifficulty = "Beginner" | "Intermediate" | "Advanced";

export interface WomenExercise {
  id: string;
  title: string;
  section: WomenSection;
  category: WomenCategory;
  description: string;
  difficulty: WomenDifficulty;
  instructions: string[];
  benefits: string[];
  videoUrl: string;
}

export const WOMEN_EXERCISES: WomenExercise[] = [
  // ── BASIC EXERCISES ───────────────────────────────────────────────────────
  {
    id: "w-bodyweight-squat",
    title: "Bodyweight Squat",
    section: "basic",
    category: "Lower Body",
    description:
      "A foundational lower-body movement that builds strength in the quads, glutes, and hamstrings. Perfect for beginners, it requires no equipment and teaches proper squat mechanics.",
    difficulty: "Beginner",
    instructions: [
      "Stand with feet shoulder-width apart, toes pointing slightly outward.",
      "Engage your core and keep your chest tall throughout the movement.",
      "Bend your knees and push your hips back as if sitting into a chair.",
      "Lower until your thighs are parallel to the floor (or as low as comfortable).",
      "Press through your heels to return to standing, squeezing your glutes at the top.",
    ],
    benefits: [
      "Builds quad, glute, and hamstring strength",
      "Improves hip and ankle mobility",
      "Enhances core stability and posture",
      "Burns calories and boosts metabolism",
    ],
    videoUrl: "",
  },
  {
    id: "w-glute-bridge",
    title: "Glute Bridge",
    section: "basic",
    category: "Lower Body",
    description:
      "A targeted glute activation exercise performed lying on your back. It isolates and strengthens the glutes and hamstrings while relieving lower back tension.",
    difficulty: "Beginner",
    instructions: [
      "Lie on your back with knees bent and feet flat on the floor, hip-width apart.",
      "Place your arms at your sides with palms facing down.",
      "Squeeze your glutes and press your heels into the floor.",
      "Lift your hips toward the ceiling until your body forms a straight line from knees to shoulders.",
      "Hold for 2 seconds at the top, then slowly lower back down.",
    ],
    benefits: [
      "Isolates and strengthens the glutes",
      "Relieves lower back pain",
      "Improves hip extension and mobility",
      "Activates the posterior chain",
    ],
    videoUrl: "",
  },
  {
    id: "w-hip-thrust",
    title: "Hip Thrust",
    section: "basic",
    category: "Lower Body",
    description:
      "An elevated glute bridge variation that provides a greater range of motion for the hips. This movement is one of the most effective exercises for sculpting and strengthening the glutes.",
    difficulty: "Beginner",
    instructions: [
      "Sit on the floor with your upper back against a bench or sofa edge.",
      "Place your feet flat on the floor, hip-width apart, knees bent at 90 degrees.",
      "Brace your core and drive through your heels.",
      "Thrust your hips upward until your body forms a straight line from knees to shoulders.",
      "Squeeze glutes firmly at the top, hold 1–2 seconds, then lower with control.",
    ],
    benefits: [
      "Maximally activates the gluteus maximus",
      "Shapes and lifts the glutes",
      "Improves athletic performance and hip power",
      "Reduces knee and lower back strain",
    ],
    videoUrl: "",
  },
  {
    id: "w-forward-lunge",
    title: "Forward Lunge",
    section: "basic",
    category: "Lower Body",
    description:
      "A classic unilateral leg exercise that trains each leg independently, improving balance and correcting muscle imbalances. It targets the quads, glutes, and hamstrings simultaneously.",
    difficulty: "Beginner",
    instructions: [
      "Stand tall with feet hip-width apart and hands on your hips.",
      "Take a controlled step forward with your right foot.",
      "Lower your body until both knees form approximately 90-degree angles.",
      "Ensure your front knee stays above (not past) your front ankle.",
      "Push through your front heel to return to standing, then repeat on the other side.",
    ],
    benefits: [
      "Develops quad and glute strength unilaterally",
      "Improves balance and coordination",
      "Enhances hip flexor flexibility",
      "Increases lower body muscular endurance",
    ],
    videoUrl: "",
  },
  {
    id: "w-calf-raises",
    title: "Calf Raises",
    section: "basic",
    category: "Lower Body",
    description:
      "A simple yet effective exercise for toning and strengthening the calf muscles. Regular calf raises improve ankle stability and give legs a lean, sculpted appearance.",
    difficulty: "Beginner",
    instructions: [
      "Stand with feet hip-width apart near a wall or chair for light balance support.",
      "Keep your core engaged and spine tall.",
      "Slowly rise onto the balls of your feet, lifting your heels as high as possible.",
      "Pause at the top for 1 second and feel the contraction in your calves.",
      "Slowly lower your heels back to the floor and repeat.",
    ],
    benefits: [
      "Strengthens and tones the calf muscles",
      "Improves ankle stability and balance",
      "Enhances circulation in the lower legs",
      "Supports knee health and injury prevention",
    ],
    videoUrl: "",
  },
  {
    id: "w-wall-push-up",
    title: "Wall Push-Up",
    section: "basic",
    category: "Upper Body",
    description:
      "A beginner-friendly upper body exercise performed against a wall. It builds pushing strength in the chest, shoulders, and triceps with minimal joint stress.",
    difficulty: "Beginner",
    instructions: [
      "Stand about arm's length from a wall, feet shoulder-width apart.",
      "Place your palms flat on the wall at chest height, slightly wider than shoulder-width.",
      "Keep your body in a straight line from head to heels.",
      "Bend your elbows to lower your chest toward the wall in a controlled motion.",
      "Push back to the starting position, fully extending your arms without locking elbows.",
    ],
    benefits: [
      "Builds chest, shoulder, and tricep strength",
      "Low-impact and joint-friendly for beginners",
      "Improves upper body pushing mechanics",
      "Strengthens the core as a stabiliser",
    ],
    videoUrl: "",
  },
  {
    id: "w-plank-hold",
    title: "Plank Hold",
    section: "basic",
    category: "Core",
    description:
      "An isometric core exercise that builds endurance and stability throughout the entire midsection. It engages the abs, obliques, and lower back simultaneously.",
    difficulty: "Beginner",
    instructions: [
      "Start in a forearm plank position with elbows directly beneath shoulders.",
      "Extend your legs behind you with toes on the floor.",
      "Squeeze your glutes, brace your abs, and keep your body in a straight line.",
      "Avoid letting your hips sag toward the floor or pike upward.",
      "Hold for 20–60 seconds while breathing steadily, then rest and repeat.",
    ],
    benefits: [
      "Builds core endurance and full midsection strength",
      "Improves posture and spinal alignment",
      "Engages glutes and shoulder stabilisers",
      "Reduces risk of lower back pain",
    ],
    videoUrl: "",
  },
  {
    id: "w-bird-dog",
    title: "Bird-Dog",
    section: "basic",
    category: "Core",
    description:
      "A stability and balance exercise performed on all fours that challenges the core and back extensors. It's excellent for improving coordination and spinal stability.",
    difficulty: "Beginner",
    instructions: [
      "Start on your hands and knees with wrists under shoulders and knees under hips.",
      "Engage your core and keep your spine neutral (flat back).",
      "Slowly extend your right arm forward and left leg back simultaneously.",
      "Hold the extended position for 2–3 seconds, keeping your hips level.",
      "Return to the starting position and switch sides — left arm and right leg.",
    ],
    benefits: [
      "Improves core stability and balance",
      "Strengthens the lower back and glutes",
      "Develops coordination and motor control",
      "Reduces lower back discomfort",
    ],
    videoUrl: "",
  },
  {
    id: "w-lateral-leg-raise",
    title: "Lateral Leg Raise",
    section: "basic",
    category: "Lower Body",
    description:
      "A targeted hip abductor exercise performed lying on your side. It tones and strengthens the outer thighs and hips for a more sculpted silhouette.",
    difficulty: "Beginner",
    instructions: [
      "Lie on your side with your body in a straight line, legs stacked.",
      "Rest your head on your lower arm and place your top hand on the floor for stability.",
      "Keep your top leg straight and flex the foot.",
      "Raise your top leg toward the ceiling as high as comfortable without rotating your hip.",
      "Slowly lower it back down, stopping just before it touches the bottom leg.",
    ],
    benefits: [
      "Tones and strengthens the hip abductors and outer thighs",
      "Improves hip stability and knee alignment",
      "Shapes the outer glutes for a lifted appearance",
      "Can be done anywhere without equipment",
    ],
    videoUrl: "",
  },
  {
    id: "w-donkey-kick",
    title: "Donkey Kick",
    section: "basic",
    category: "Lower Body",
    description:
      "A popular glute-isolation exercise performed on all fours. It directly targets the gluteus maximus to lift, tone, and strengthen the backside.",
    difficulty: "Beginner",
    instructions: [
      "Start on all fours with wrists under shoulders and knees under hips.",
      "Keep your core braced and your back flat throughout the movement.",
      "Keeping the knee bent at 90 degrees, drive one heel up toward the ceiling.",
      "Squeeze your glute hard at the top, ensuring your hip doesn't rotate.",
      "Lower the knee back to just above the floor and repeat, then switch sides.",
    ],
    benefits: [
      "Isolates the gluteus maximus effectively",
      "Lifts and shapes the glutes",
      "Improves hip extension strength",
      "Low-impact and safe for all fitness levels",
    ],
    videoUrl: "",
  },
  {
    id: "w-inner-thigh-squeeze",
    title: "Inner Thigh Squeeze",
    section: "basic",
    category: "Lower Body",
    description:
      "A focused adductor exercise that tones the inner thighs. Using a small pillow or ball, this exercise activates the often-neglected hip adductor muscles.",
    difficulty: "Beginner",
    instructions: [
      "Sit upright in a chair or lie on your back with knees bent.",
      "Place a small pillow, ball, or folded towel between your knees.",
      "Squeeze your knees together firmly, engaging the inner thigh muscles.",
      "Hold the squeeze for 5–10 seconds, breathing normally.",
      "Release slowly and repeat for the desired number of reps.",
    ],
    benefits: [
      "Tones and firms the inner thigh (adductor) muscles",
      "Improves hip and knee stability",
      "Helps with posture and alignment",
      "Gentle and accessible for beginners or rehabilitation",
    ],
    videoUrl: "",
  },
  {
    id: "w-seated-hamstring-stretch",
    title: "Seated Hamstring Stretch",
    section: "basic",
    category: "Full Body",
    description:
      "A foundational flexibility exercise that lengthens the hamstrings and improves lower body mobility. Regular stretching reduces tightness and supports better posture.",
    difficulty: "Beginner",
    instructions: [
      "Sit on the floor with both legs extended straight in front of you.",
      "Sit tall with a straight spine — avoid rounding your lower back.",
      "Inhale, and on the exhale, hinge forward at the hips reaching toward your feet.",
      "Go only as far as you can while keeping your back straight; hold for 20–30 seconds.",
      "Breathe steadily throughout and deepen the stretch on each exhale.",
    ],
    benefits: [
      "Lengthens and releases tight hamstrings",
      "Improves overall lower body flexibility",
      "Reduces risk of hamstring strains",
      "Promotes relaxation and recovery",
    ],
    videoUrl: "",
  },

  // ── ADVANCED EXERCISES ────────────────────────────────────────────────────
  {
    id: "w-bulgarian-split-squat",
    title: "Bulgarian Split Squat",
    section: "advanced",
    category: "Lower Body",
    description:
      "A challenging unilateral squat variation that places intense demand on the quads, glutes, and hip flexors. This exercise is exceptional for building lower body strength and symmetry.",
    difficulty: "Advanced",
    instructions: [
      "Stand about two feet in front of a bench, facing away from it.",
      "Place the top of your back foot on the bench behind you.",
      "Lower your body by bending your front knee, keeping your torso upright.",
      "Descend until your front thigh is parallel to the floor and back knee nearly touches the ground.",
      "Drive through your front heel to return to the start, maintaining balance throughout.",
    ],
    benefits: [
      "Builds superior single-leg strength and balance",
      "Targets quads and glutes with high intensity",
      "Corrects left-right strength imbalances",
      "Improves hip flexor flexibility and mobility",
    ],
    videoUrl: "",
  },
  {
    id: "w-sumo-deadlift",
    title: "Sumo Deadlift",
    section: "advanced",
    category: "Lower Body",
    description:
      "A wide-stance deadlift variation that heavily targets the inner thighs, glutes, and hamstrings. It's one of the most powerful compound movements for total posterior chain development.",
    difficulty: "Advanced",
    instructions: [
      "Stand with feet wider than shoulder-width, toes pointing outward at 45 degrees.",
      "Hinge at the hips and bend your knees to grip the weight (or clasp your hands) between your legs.",
      "Keep your chest up, spine neutral, and core braced tight.",
      "Drive through your heels and extend your hips and knees simultaneously to stand.",
      "Lock out at the top by squeezing glutes, then reverse the motion to lower with control.",
    ],
    benefits: [
      "Develops glutes, hamstrings, and inner thighs powerfully",
      "Builds full posterior chain strength",
      "Improves hip mobility and functional movement",
      "Burns high calories through full-body engagement",
    ],
    videoUrl: "",
  },
  {
    id: "w-jump-squat",
    title: "Jump Squat",
    section: "advanced",
    category: "Full Body",
    description:
      "An explosive plyometric exercise that builds lower body power and elevates heart rate rapidly. Jump squats develop athletic performance while burning significant calories.",
    difficulty: "Advanced",
    instructions: [
      "Stand with feet shoulder-width apart, arms at your sides.",
      "Perform a squat by bending your knees and pushing your hips back.",
      "At the bottom of the squat, explosively jump upward, swinging your arms for momentum.",
      "Reach full extension at the peak of the jump.",
      "Land softly with bent knees to absorb impact, then immediately go into the next squat.",
    ],
    benefits: [
      "Builds explosive power in the lower body",
      "Burns high calories in a short time",
      "Increases cardiovascular fitness",
      "Improves athletic speed and reactivity",
    ],
    videoUrl: "",
  },
  {
    id: "w-box-step-up",
    title: "Box Step-Up",
    section: "advanced",
    category: "Lower Body",
    description:
      "A functional strength exercise using a box or step that trains each leg independently with a full range of motion. It develops glute and quad strength while improving balance.",
    difficulty: "Advanced",
    instructions: [
      "Stand in front of a sturdy box or bench at knee height.",
      "Place your right foot firmly on top of the box.",
      "Drive through your right heel and squeeze your glute to step up, bringing your left foot up to meet the right.",
      "Stand fully upright on the box, then step back down with your left foot first.",
      "Complete all reps on one side before switching, or alternate sides each rep.",
    ],
    benefits: [
      "Strengthens quads and glutes unilaterally",
      "Improves balance and functional leg strength",
      "Mimics real-life movement patterns",
      "Easily scaled by adjusting box height",
    ],
    videoUrl: "",
  },
  {
    id: "w-tricep-dip",
    title: "Tricep Dip",
    section: "advanced",
    category: "Upper Body",
    description:
      "A highly effective upper body exercise targeting the triceps, shoulders, and chest. Using a chair or bench, dips develop arm definition and pushing strength.",
    difficulty: "Advanced",
    instructions: [
      "Sit on the edge of a stable chair or bench with hands gripping the edge beside your hips.",
      "Slide your body off the edge, supporting your weight on your hands.",
      "Keep your feet flat on the floor with knees bent at 90 degrees for modified version.",
      "Lower your body by bending your elbows to approximately 90 degrees, keeping elbows pointing backward.",
      "Press back up by straightening your arms, fully engaging the triceps at the top.",
    ],
    benefits: [
      "Defines and strengthens the triceps",
      "Builds shoulder and chest pressing strength",
      "Improves arm tone and upper body muscular endurance",
      "Requires only a chair or bench",
    ],
    videoUrl: "",
  },
  {
    id: "w-pike-push-up",
    title: "Pike Push-Up",
    section: "advanced",
    category: "Upper Body",
    description:
      "An advanced push-up variation that shifts the load to the shoulders and upper arms. It's an excellent progression toward handstand push-ups and builds serious shoulder strength.",
    difficulty: "Advanced",
    instructions: [
      "Start in a downward-dog position with hips raised high and body forming an inverted V.",
      "Place hands slightly wider than shoulder-width, fingers spread for stability.",
      "Keep your legs as straight as possible throughout the movement.",
      "Bend your elbows to lower the top of your head toward the floor between your hands.",
      "Press back up by straightening your arms, driving your hips back up to the start position.",
    ],
    benefits: [
      "Builds significant shoulder and upper arm strength",
      "Develops the deltoids and triceps",
      "Progression toward handstand and overhead pressing",
      "Improves core stability under load",
    ],
    videoUrl: "",
  },
  {
    id: "w-single-leg-deadlift",
    title: "Single-Leg Deadlift",
    section: "advanced",
    category: "Lower Body",
    description:
      "A balance-intensive hip hinge movement that targets the hamstrings, glutes, and core on each side independently. This exercise is powerful for building posterior chain strength and stability.",
    difficulty: "Advanced",
    instructions: [
      "Stand on your right foot with a soft bend in the knee.",
      "Engage your core and hinge forward at the hip, extending your left leg behind you.",
      "Lower your torso toward the floor while your left leg rises, keeping your back straight.",
      "Continue until your body forms a straight line from head to left heel (T-position).",
      "Reverse the motion by driving your hips forward and returning to standing.",
    ],
    benefits: [
      "Targets hamstrings and glutes with precision",
      "Develops balance, coordination, and proprioception",
      "Corrects left-right imbalances in the posterior chain",
      "Improves hip hinge mechanics",
    ],
    videoUrl: "",
  },
  {
    id: "w-curtsy-lunge",
    title: "Curtsy Lunge",
    section: "advanced",
    category: "Lower Body",
    description:
      "A dynamic lunge variation that emphasises the gluteus medius and inner thighs, creating a more complete glute shape. The cross-behind step adds a rotational challenge to the hips.",
    difficulty: "Advanced",
    instructions: [
      "Stand with feet hip-width apart and hands on your hips.",
      "Step your right foot diagonally behind your left leg, crossing behind like a curtsy.",
      "Bend both knees to lower your body toward the floor.",
      "Keep your front knee tracking over your toes and your torso upright.",
      "Push through your front heel to return to standing, then repeat on the other side.",
    ],
    benefits: [
      "Targets the gluteus medius for outer glute shaping",
      "Strengthens inner thighs and adductors",
      "Improves hip mobility and rotational stability",
      "Adds variety and challenge to standard lunge patterns",
    ],
    videoUrl: "",
  },
  {
    id: "w-resistance-band-kickback",
    title: "Resistance Band Kickback",
    section: "advanced",
    category: "Lower Body",
    description:
      "A glute isolation exercise using a resistance band for added tension throughout the full range of motion. The band increases the challenge at every point of the movement for superior glute activation.",
    difficulty: "Advanced",
    instructions: [
      "Anchor a resistance band around your ankles or loop it above your knees.",
      "Start on all fours with a flat back or stand holding a surface for balance.",
      "With a slight knee bend, kick one leg directly behind you against the band resistance.",
      "Squeeze the glute firmly at full extension and hold for 1–2 seconds.",
      "Lower the leg slowly under control, resisting the band on the way down.",
    ],
    benefits: [
      "Provides constant tension on the glutes throughout the movement",
      "Maximally activates the gluteus maximus for sculpting",
      "Low-impact and joint-friendly",
      "Scalable by adjusting band resistance",
    ],
    videoUrl: "",
  },
  {
    id: "w-romanian-deadlift",
    title: "Romanian Deadlift",
    section: "advanced",
    category: "Full Body",
    description:
      "A hip-hinge compound exercise that targets the hamstrings and glutes through a long range of motion. The Romanian deadlift is one of the best movements for building a strong, shaped posterior chain.",
    difficulty: "Advanced",
    instructions: [
      "Stand with feet hip-width apart, holding weights in front of your thighs (or use bodyweight).",
      "Keep a slight bend in your knees as you hinge at the hips, pushing them backward.",
      "Lower the weights along your legs, keeping the bar close to your body.",
      "Continue lowering until you feel a deep stretch in your hamstrings (typically mid-shin level).",
      "Drive your hips forward to return to standing, squeezing glutes hard at the top.",
    ],
    benefits: [
      "Builds hamstring and glute length and strength",
      "Develops the posterior chain comprehensively",
      "Improves hip hinge mechanics and flexibility",
      "Foundational movement for athletic performance",
    ],
    videoUrl: "",
  },
];
