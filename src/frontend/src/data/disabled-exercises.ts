export type DisabledCategory =
  | "Seated"
  | "Stretching"
  | "Breathing"
  | "Balance";
export type DisabledDifficulty = "Easy" | "Moderate";

export interface DisabledExercise {
  id: string;
  title: string;
  category: DisabledCategory;
  difficulty: DisabledDifficulty;
  description: string;
  instructions: string[];
  benefits: string[];
  videoUrl: string;
}

export const DISABLED_EXERCISES: DisabledExercise[] = [
  {
    id: "de-001",
    title: "Seated Shoulder Press",
    category: "Seated",
    difficulty: "Easy",
    description:
      "A gentle upper-body strengthening exercise performed entirely from a chair. It targets the shoulders and triceps without requiring any standing or balance. Perfect for building upper-body strength while seated.",
    instructions: [
      "Sit upright in a sturdy chair with feet flat on the floor, hip-width apart.",
      "Hold a light weight or water bottle in each hand at shoulder height, palms facing forward.",
      "Exhale and slowly press both arms straight up overhead until elbows are nearly straight.",
      "Pause briefly at the top, then inhale and lower arms back to shoulder height.",
      "Repeat for 10–12 repetitions, keeping your core gently engaged throughout.",
    ],
    benefits: [
      "Strengthens shoulder and tricep muscles without strain",
      "Improves overhead reach and daily-life arm function",
      "Can be done with or without weights for any level",
      "Boosts upper body circulation and muscle tone",
    ],
    videoUrl: "",
  },
  {
    id: "de-002",
    title: "Seated Bicep Curls",
    category: "Seated",
    difficulty: "Easy",
    description:
      "A foundational arm-strengthening exercise performed while seated, making it accessible for those with limited mobility. It targets the biceps using light resistance, building strength progressively. Ideal as a starting exercise for upper-body routines.",
    instructions: [
      "Sit tall in a chair, feet flat on the floor, shoulders relaxed.",
      "Hold a light weight, resistance band handle, or water bottle in each hand, arms at your sides with palms facing up.",
      "Exhale and curl both hands up toward your shoulders, bending at the elbows.",
      "Squeeze the biceps briefly at the top of the movement.",
      "Inhale and slowly lower back to the starting position.",
      "Complete 10–15 repetitions at a controlled, steady pace.",
    ],
    benefits: [
      "Builds bicep strength for everyday tasks like lifting and carrying",
      "Seated position removes balance demands, reducing fall risk",
      "Improves arm endurance and muscle definition",
      "Adaptable for all strength levels with adjustable resistance",
    ],
    videoUrl: "",
  },
  {
    id: "de-003",
    title: "Chair Yoga Sun Salutation",
    category: "Stretching",
    difficulty: "Moderate",
    description:
      "A gentle, chair-adapted version of the classic yoga Sun Salutation sequence. This exercise flows through multiple stretches while seated or supported by a chair back, improving flexibility and mind-body awareness. It promotes relaxation while moving every major muscle group.",
    instructions: [
      "Sit at the edge of your chair, spine tall, hands resting on knees.",
      "Inhale and raise both arms overhead, reaching toward the ceiling and gently arching your back.",
      "Exhale and fold forward, letting your torso lower toward your thighs, arms hanging loose.",
      "Inhale and lift back to seated, extending arms out to the sides like wings.",
      "Exhale and twist gently to the right, placing your right hand on the chair back for support.",
      "Return to center, then repeat the twist to the left side. Complete 3–5 full sequences.",
    ],
    benefits: [
      "Improves flexibility in the back, shoulders, and hips",
      "Encourages mindful breathing and reduces stress",
      "Activates multiple muscle groups in a safe, low-impact way",
      "Enhances spinal mobility and posture",
    ],
    videoUrl: "",
  },
  {
    id: "de-004",
    title: "Neck Rolls and Stretches",
    category: "Stretching",
    difficulty: "Easy",
    description:
      "A slow, deliberate neck mobility exercise that relieves tension and stiffness. Gentle rolls and side stretches help restore full range of motion in the cervical spine. This exercise is especially beneficial for those who spend long periods seated or in a wheelchair.",
    instructions: [
      "Sit upright with shoulders relaxed and hands resting comfortably on your lap.",
      "Slowly drop your right ear toward your right shoulder, feeling a gentle stretch on the left side of the neck. Hold for 5 seconds.",
      "Bring your head back to center, then repeat on the left side.",
      "Gently lower your chin toward your chest to stretch the back of the neck. Hold for 5 seconds.",
      "Lift your head back to neutral, then look slowly to the right and then to the left.",
      "Complete 3 slow repetitions of the full sequence, breathing deeply throughout.",
    ],
    benefits: [
      "Relieves neck and upper-shoulder tension",
      "Improves cervical spine range of motion",
      "Reduces headaches associated with neck stiffness",
      "Can be done anywhere, anytime, without any equipment",
    ],
    videoUrl: "",
  },
  {
    id: "de-005",
    title: "Seated Leg Raises",
    category: "Seated",
    difficulty: "Easy",
    description:
      "A lower-body toning exercise performed entirely in a chair, targeting the quadriceps and hip flexors. Regular practice helps maintain leg strength and circulation without any impact on joints. Suitable for individuals with limited lower-body mobility.",
    instructions: [
      "Sit near the edge of a sturdy chair with your back straight and hands gripping the seat sides for support.",
      "Straighten your right leg fully and raise it until it is parallel to the floor.",
      "Hold the raised position for 3–5 seconds, squeezing the thigh muscle.",
      "Slowly lower the leg back to the floor without letting the foot touch down.",
      "Repeat for 10 repetitions, then switch to the left leg.",
      "Perform 2–3 sets on each side, resting 30 seconds between sets.",
    ],
    benefits: [
      "Strengthens the quadriceps and hip flexors",
      "Improves leg circulation and reduces swelling",
      "Maintains knee joint health and stability",
      "Zero impact on joints — safe for all mobility levels",
    ],
    videoUrl: "",
  },
  {
    id: "de-006",
    title: "Ankle Circles and Flexes",
    category: "Seated",
    difficulty: "Easy",
    description:
      "A simple foot and ankle mobility exercise done while seated that promotes circulation and reduces stiffness. Ankle circles and flexes are especially important for wheelchair users or those with limited mobility to prevent swelling and maintain joint health.",
    instructions: [
      "Sit comfortably with your back supported, both feet lifted slightly off the floor.",
      "Point your right toes forward (plantarflex), hold for 2 seconds.",
      "Flex your right foot back (dorsiflex), pulling toes toward your shin, hold for 2 seconds.",
      "Draw 5 slow clockwise circles with your right foot, then 5 counter-clockwise.",
      "Lower the right foot and repeat the entire sequence with the left foot.",
      "Complete 3 full rounds on each foot, breathing steadily throughout.",
    ],
    benefits: [
      "Increases blood flow to the feet and lower legs",
      "Reduces ankle stiffness and risk of blood clots",
      "Improves balance-related ankle proprioception",
      "Helps prevent foot and calf swelling during long periods of sitting",
    ],
    videoUrl: "",
  },
  {
    id: "de-007",
    title: "Resistance Band Pull-Aparts (Seated)",
    category: "Seated",
    difficulty: "Moderate",
    description:
      "A targeted upper-back and shoulder exercise using a light resistance band while seated. Pull-aparts strengthen the rear deltoids and rhomboids, helping to improve posture and reduce the rounded-shoulder effect common in wheelchair users.",
    instructions: [
      "Sit tall, holding a light resistance band with both hands at shoulder width, arms extended in front of you.",
      "Keep a slight bend in the elbows and pull the band apart by moving both hands outward and backward.",
      "Squeeze your shoulder blades together at the end range of the movement.",
      "Pause for 2 seconds, then slowly return to the starting position.",
      "Maintain an upright posture throughout — avoid letting your chest collapse.",
      "Perform 12–15 repetitions for 2–3 sets.",
    ],
    benefits: [
      "Strengthens rear shoulder and upper back muscles",
      "Counteracts rounded posture from prolonged sitting",
      "Improves shoulder joint stability and mobility",
      "Light band resistance is joint-friendly and adjustable",
    ],
    videoUrl: "",
  },
  {
    id: "de-008",
    title: "Deep Breathing and Diaphragm Exercise",
    category: "Breathing",
    difficulty: "Easy",
    description:
      "A foundational breathing exercise that activates the diaphragm for full, efficient breathing. Diaphragmatic breathing improves oxygen intake, reduces stress, and supports core stability. It is especially valuable for individuals with limited physical mobility who benefit from internal strength work.",
    instructions: [
      "Sit or recline comfortably. Place one hand on your chest and the other on your belly.",
      "Breathe in slowly through your nose for 4 counts, allowing your belly to rise while your chest stays relatively still.",
      "At the top of the breath, pause for 2 counts.",
      "Exhale slowly through pursed lips for 6 counts, letting your belly fall naturally.",
      "Feel your diaphragm engage with each breath — the belly hand should move more than the chest hand.",
      "Continue for 8–10 breath cycles, gradually building duration to 5 minutes.",
    ],
    benefits: [
      "Increases lung capacity and oxygen efficiency",
      "Activates parasympathetic nervous system, reducing anxiety",
      "Supports core and postural muscles through breath engagement",
      "Can be practiced anywhere and anytime, no equipment needed",
    ],
    videoUrl: "",
  },
  {
    id: "de-009",
    title: "Seated Side Stretch",
    category: "Stretching",
    difficulty: "Easy",
    description:
      "A gentle lateral stretch performed from a seated position that opens the side body, relieving tension in the obliques and intercostal muscles. It improves flexibility and breathing capacity, making it a great warm-up or cool-down exercise.",
    instructions: [
      "Sit upright at the edge of your chair, feet flat on the floor.",
      "Place your left hand on the seat beside you for light support.",
      "Raise your right arm overhead and lean gently to the left, creating a long arc through the right side of your body.",
      "Hold the stretch for 15–20 seconds, breathing into the stretched side.",
      "Slowly return to upright and repeat on the other side.",
      "Perform 3 repetitions on each side, holding each stretch for 20 seconds.",
    ],
    benefits: [
      "Stretches the obliques, lats, and intercostal muscles",
      "Improves lateral spinal flexibility and range of motion",
      "Encourages deeper breathing by expanding the chest",
      "Relieves tension commonly felt in the sides from prolonged sitting",
    ],
    videoUrl: "",
  },
  {
    id: "de-010",
    title: "Hand and Wrist Exercises",
    category: "Seated",
    difficulty: "Easy",
    description:
      "A series of gentle hand and wrist movements designed to maintain grip strength, dexterity, and joint flexibility. These exercises are particularly beneficial for individuals with arthritis, fine motor challenges, or limited hand use.",
    instructions: [
      "Sit comfortably with forearms resting on your thighs, palms facing up.",
      "Slowly make a tight fist with both hands, hold for 5 seconds, then spread fingers wide.",
      "Rotate both wrists in slow circles — 5 clockwise, then 5 counter-clockwise.",
      "Touch each fingertip to your thumb in sequence (index, middle, ring, pinky) on both hands.",
      "Gently press palms together in front of your chest and hold for 5 seconds.",
      "Repeat the full sequence 3 times, moving slowly and mindfully.",
    ],
    benefits: [
      "Maintains grip strength and fine motor dexterity",
      "Reduces stiffness and pain in arthritic joints",
      "Improves circulation to the hands and fingers",
      "Supports independence in daily tasks like writing and gripping",
    ],
    videoUrl: "",
  },
  {
    id: "de-011",
    title: "Seated Abdominal Compressions",
    category: "Seated",
    difficulty: "Moderate",
    description:
      "A core activation exercise performed while seated that strengthens the deep abdominal muscles without any crunching or bending. Controlled compressions engage the transverse abdominis, which supports spinal stability and posture.",
    instructions: [
      "Sit upright with feet flat on the floor, hands resting on thighs.",
      "Inhale deeply through your nose to prepare.",
      "On the exhale, draw your navel gently but firmly toward your spine, as if tightening a belt.",
      "Hold the compression for 5–8 seconds without holding your breath — breathe shallowly.",
      "Release the compression slowly on an inhale.",
      "Repeat 10–15 times, gradually increasing the hold duration as you build strength.",
    ],
    benefits: [
      "Activates deep core stabilizers without spinal flexion",
      "Improves sitting posture and spinal support",
      "Reduces lower back discomfort from prolonged sitting",
      "Safe for those with hernias, prolapse, or recent abdominal surgery when cleared by a physio",
    ],
    videoUrl: "",
  },
  {
    id: "de-012",
    title: "Chair-Supported Balance Stand",
    category: "Balance",
    difficulty: "Moderate",
    description:
      "A standing balance exercise using the back of a chair as a safety support. This exercise challenges the ankles, legs, and core to maintain stability, helping to reduce fall risk and build confidence in standing posture.",
    instructions: [
      "Stand behind a sturdy chair, lightly resting both hands on the chair back for support.",
      "Stand with feet hip-width apart, gaze fixed on a point in front of you.",
      "Slowly shift your weight onto your right foot, lifting your left foot just slightly off the floor.",
      "Hold the single-leg balance for 10–20 seconds, breathing calmly.",
      "Lower the left foot and repeat on the other side.",
      "Complete 3–5 repetitions on each leg, increasing hold time as balance improves.",
    ],
    benefits: [
      "Improves single-leg stability and reduces fall risk",
      "Strengthens ankle stabilizers and lower leg muscles",
      "Builds confidence and proprioception in standing positions",
      "Chair support provides safety while still challenging balance",
    ],
    videoUrl: "",
  },
  {
    id: "de-013",
    title: "Gentle Arm Circles",
    category: "Stretching",
    difficulty: "Easy",
    description:
      "A warm-up and shoulder mobility exercise involving slow, controlled arm circles performed while seated or standing. Arm circles lubricate the shoulder joint and increase blood flow to the arms and upper back, making them an ideal first exercise in any session.",
    instructions: [
      "Sit or stand with a tall spine, arms relaxed at your sides.",
      "Raise both arms out to the sides until they are parallel to the floor.",
      "Begin making small forward circles, gradually increasing to large circles over 15 seconds.",
      "After 10 large circles forward, pause and reverse direction for 10 backward circles.",
      "Lower your arms and shake them out gently to release tension.",
      "Repeat the full sequence 2–3 times, keeping your neck and jaw relaxed throughout.",
    ],
    benefits: [
      "Warms up and lubricates the shoulder joint capsule",
      "Improves shoulder range of motion and reduces stiffness",
      "Increases circulation to the arms and upper back",
      "Serves as a gentle warm-up or active recovery movement",
    ],
    videoUrl: "",
  },
  {
    id: "de-014",
    title: "Seated Hamstring Stretch",
    category: "Stretching",
    difficulty: "Easy",
    description:
      "A gentle lower-body stretch targeting the hamstrings and lower back, performed entirely from a seated position. This stretch is essential for those who sit for extended periods, helping to prevent tightness and discomfort behind the thighs.",
    instructions: [
      "Sit near the edge of your chair, feet flat on the floor.",
      "Extend your right leg straight out in front of you, heel on the floor, toes pointing up.",
      "Sit tall and gently hinge forward from the hips — not the waist — reaching your hands toward your right shin or foot.",
      "Hold the stretch for 20–30 seconds, breathing deeply and allowing the hamstring to relax.",
      "Return to sitting and repeat with the left leg extended.",
      "Complete 2–3 repetitions on each side, holding each for up to 30 seconds.",
    ],
    benefits: [
      "Lengthens tight hamstrings from prolonged sitting",
      "Reduces lower back tension and discomfort",
      "Improves posture and pelvic alignment",
      "Seated variation eliminates fall risk versus standing hamstring stretches",
    ],
    videoUrl: "",
  },
];
