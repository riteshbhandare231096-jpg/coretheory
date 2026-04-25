import Types "../types/subscription";
import Map "mo:core/Map";

/// Domain logic for user profiles and subscription management.
module {

  // ── Profile helpers ────────────────────────────────────────────────────────

  /// Create a new free-tier profile for a user.
  public func newProfile(userId : Types.UserId) : Types.UserProfile {
    {
      userId;
      var tier                 = #free;
      var plan                 = null;
      var startedAt            = null;
      var expiresAt            = null;
      var stripeCustomerId     = null;
      var stripeSubscriptionId = null;
      var isDisabled           = false;
      var udidVerified         = false;
      var udidUploadPath       = "";
      var udidUploadTime       = null;
    }
  };

  /// Convert a mutable UserProfile to its immutable public form.
  public func toPublic(profile : Types.UserProfile) : Types.UserProfilePublic {
    {
      userId               = profile.userId;
      tier                 = profile.tier;
      plan                 = profile.plan;
      startedAt            = profile.startedAt;
      expiresAt            = profile.expiresAt;
      stripeCustomerId     = profile.stripeCustomerId;
      stripeSubscriptionId = profile.stripeSubscriptionId;
      isDisabled           = profile.isDisabled;
      udidVerified         = profile.udidVerified;
      udidUploadPath       = profile.udidUploadPath;
      udidUploadTime       = profile.udidUploadTime;
    }
  };

  /// Return the curated list of exercises for disabled users.
  public func getDisabledExercises() : [Types.DisabledExercise] {
    [
      {
        id = 1;
        title = "Seated Upper Body Strength";
        category = "Strength";
        description = "Build upper body strength from a seated position using your own bodyweight.";
        difficulty = "Beginner";
        videoUrl = "";
        instructions = [
          "Sit tall in a sturdy chair with feet flat on the floor.",
          "Extend both arms forward at shoulder height.",
          "Slowly pull elbows back, squeezing shoulder blades together.",
          "Return to start and repeat for 10-15 reps.",
        ];
        benefits = [
          "Improves posture and shoulder stability.",
          "Strengthens back and arm muscles.",
          "Can be done anywhere with a chair.",
        ];
      },
      {
        id = 2;
        title = "Chair Yoga";
        category = "Flexibility";
        description = "Gentle yoga poses adapted for a chair to improve flexibility and reduce stress.";
        difficulty = "Beginner";
        videoUrl = "";
        instructions = [
          "Sit with spine tall and feet flat on the floor.",
          "Inhale and raise arms overhead, stretching upward.",
          "Exhale and twist gently to the right, holding for 3 breaths.",
          "Return to center and repeat on the left side.",
        ];
        benefits = [
          "Increases flexibility and range of motion.",
          "Reduces stress and improves mental clarity.",
          "Accessible for all mobility levels.",
        ];
      },
      {
        id = 3;
        title = "Neck and Shoulder Stretches";
        category = "Flexibility";
        description = "Relieve tension in the neck and shoulders with gentle guided stretches.";
        difficulty = "Beginner";
        videoUrl = "";
        instructions = [
          "Sit upright and slowly tilt your right ear toward your right shoulder.",
          "Hold for 15-20 seconds, feeling the stretch on the left side.",
          "Return to center and repeat on the opposite side.",
          "Follow with gentle shoulder rolls forward and backward.",
        ];
        benefits = [
          "Releases neck and shoulder tension.",
          "Improves cervical range of motion.",
          "Reduces headaches caused by muscle tightness.",
        ];
      },
      {
        id = 4;
        title = "Gentle Arm Circles";
        category = "Mobility";
        description = "Loosen shoulder joints and warm up the upper body with seated arm circles.";
        difficulty = "Beginner";
        videoUrl = "";
        instructions = [
          "Sit tall and extend both arms out to your sides at shoulder height.",
          "Make small circles forward for 15 seconds.",
          "Gradually increase the circle size.",
          "Reverse direction and repeat.",
        ];
        benefits = [
          "Increases shoulder joint mobility.",
          "Warms up the upper body muscles.",
          "Improves circulation in arms and shoulders.",
        ];
      },
      {
        id = 5;
        title = "Seated Leg Raises";
        category = "Strength";
        description = "Strengthen your quads and hip flexors with controlled seated leg raises.";
        difficulty = "Beginner";
        videoUrl = "";
        instructions = [
          "Sit at the edge of a chair with back straight.",
          "Slowly straighten and raise your right leg parallel to the floor.",
          "Hold for 2-3 seconds, then lower slowly.",
          "Complete 10 reps per leg.",
        ];
        benefits = [
          "Strengthens quadriceps and hip flexors.",
          "Supports knee joint health.",
          "Improves leg circulation.",
        ];
      },
      {
        id = 6;
        title = "Ankle and Foot Exercises";
        category = "Mobility";
        description = "Improve ankle mobility and foot circulation with simple seated movements.";
        difficulty = "Beginner";
        videoUrl = "";
        instructions = [
          "Sit in a chair and lift one foot slightly off the floor.",
          "Rotate the ankle clockwise 10 times, then counterclockwise 10 times.",
          "Point and flex the foot 10 times.",
          "Repeat with the other foot.",
        ];
        benefits = [
          "Reduces ankle stiffness and swelling.",
          "Improves balance and proprioception.",
          "Helps prevent blood clots in sedentary individuals.",
        ];
      },
      {
        id = 7;
        title = "Resistance Band Pull-Aparts (Seated)";
        category = "Strength";
        description = "Use a light resistance band to strengthen the upper back and improve posture.";
        difficulty = "Intermediate";
        videoUrl = "";
        instructions = [
          "Sit tall and hold a resistance band at shoulder width with both hands.",
          "Keep arms straight and pull the band apart by squeezing shoulder blades.",
          "Hold the stretched position for 1-2 seconds.",
          "Return slowly and repeat for 12-15 reps.",
        ];
        benefits = [
          "Strengthens rear deltoids and rhomboids.",
          "Corrects rounded shoulder posture.",
          "Improves overall shoulder stability.",
        ];
      },
      {
        id = 8;
        title = "Deep Breathing Exercises";
        category = "Wellness";
        description = "Diaphragmatic breathing techniques to reduce stress and improve lung capacity.";
        difficulty = "Beginner";
        videoUrl = "";
        instructions = [
          "Sit or lie in a comfortable position.",
          "Place one hand on your chest and one on your belly.",
          "Inhale slowly through the nose for 4 counts, letting your belly rise.",
          "Exhale through pursed lips for 6 counts. Repeat 8-10 times.",
        ];
        benefits = [
          "Reduces anxiety and stress hormones.",
          "Improves oxygen exchange and lung capacity.",
          "Activates the parasympathetic nervous system.",
        ];
      },
      {
        id = 9;
        title = "Seated Side Stretches";
        category = "Flexibility";
        description = "Stretch the lateral trunk muscles to improve torso mobility.";
        difficulty = "Beginner";
        videoUrl = "";
        instructions = [
          "Sit tall with feet flat on the floor.",
          "Raise your right arm overhead and lean gently to the left.",
          "Hold for 15-20 seconds, breathing deeply.",
          "Return upright and repeat on the other side.",
        ];
        benefits = [
          "Stretches the obliques and intercostal muscles.",
          "Improves lateral spinal mobility.",
          "Relieves side body tension.",
        ];
      },
      {
        id = 10;
        title = "Hand and Wrist Exercises";
        category = "Mobility";
        description = "Maintain hand dexterity and wrist mobility with gentle targeted movements.";
        difficulty = "Beginner";
        videoUrl = "";
        instructions = [
          "Extend one arm with palm facing down.",
          "Gently pull fingers back with the other hand for a wrist stretch. Hold 15 seconds.",
          "Make a fist, then spread fingers wide. Repeat 10 times.",
          "Rotate wrists in circles clockwise and counterclockwise.",
        ];
        benefits = [
          "Reduces stiffness from arthritis or repetitive strain.",
          "Maintains fine motor control.",
          "Improves grip strength.",
        ];
      },
      {
        id = 11;
        title = "Gentle Seated Core Work";
        category = "Core";
        description = "Activate and strengthen your core muscles safely from a seated position.";
        difficulty = "Beginner";
        videoUrl = "";
        instructions = [
          "Sit at the edge of a chair with hands on your thighs.",
          "Engage your abdominal muscles by drawing your navel toward your spine.",
          "Hold the contraction for 5-10 seconds while breathing normally.",
          "Release and repeat 10-15 times.",
        ];
        benefits = [
          "Strengthens deep core stabilisers.",
          "Supports a healthy lower back.",
          "Improves seated posture and balance.",
        ];
      },
      {
        id = 12;
        title = "Chair-Supported Balance Exercises";
        category = "Balance";
        description = "Build balance and stability using a chair for safe support.";
        difficulty = "Beginner";
        videoUrl = "";
        instructions = [
          "Stand behind a sturdy chair and hold the back with both hands.",
          "Slowly lift one foot off the floor and hold for 10 seconds.",
          "Lower and repeat with the other foot.",
          "Progress to using only one finger on the chair as balance improves.",
        ];
        benefits = [
          "Improves proprioception and balance.",
          "Strengthens ankle and hip stabilisers.",
          "Reduces fall risk.",
        ];
      },
      {
        id = 13;
        title = "Seated Marching";
        category = "Cardio";
        description = "A low-impact cardio exercise that improves circulation and hip flexor strength.";
        difficulty = "Beginner";
        videoUrl = "";
        instructions = [
          "Sit tall with feet flat on the floor.",
          "Lift your right knee toward your chest as high as comfortable.",
          "Lower and lift the left knee alternately in a marching rhythm.",
          "Continue for 1-2 minutes at a comfortable pace.",
        ];
        benefits = [
          "Elevates heart rate gently without joint stress.",
          "Strengthens hip flexors and core.",
          "Improves circulation in the lower body.",
        ];
      },
    ]
  };

  /// Return the curated women's exercises split into basic and advanced sections.
  public func getWomenExercises() : { basic : [Types.WomenExercise]; advanced : [Types.WomenExercise] } {
    let basic : [Types.WomenExercise] = [
      {
        id = 101;
        title = "Bodyweight Squats";
        category = "Lower Body";
        description = "A foundational lower-body movement that builds strength in the quads, glutes, and hamstrings.";
        section = #basic;
        difficulty = "Beginner";
        videoUrl = "";
        instructions = [
          "Stand with feet shoulder-width apart, toes slightly turned out.",
          "Push hips back and bend knees until thighs are parallel to the floor.",
          "Keep chest up and knees tracking over toes.",
          "Press through heels to return to standing. Do 3 sets of 15 reps.",
        ];
        benefits = [
          "Builds quad, glute, and hamstring strength.",
          "Improves functional lower-body mobility.",
          "Supports healthy knees and hips.",
        ];
      },
      {
        id = 102;
        title = "Glute Bridges";
        category = "Lower Body";
        description = "Activate and strengthen the glutes and hamstrings while protecting the lower back.";
        section = #basic;
        difficulty = "Beginner";
        videoUrl = "";
        instructions = [
          "Lie on your back with knees bent and feet flat on the floor, hip-width apart.",
          "Press your feet into the floor and lift your hips toward the ceiling.",
          "Squeeze your glutes at the top and hold for 2 seconds.",
          "Lower slowly and repeat for 15-20 reps.",
        ];
        benefits = [
          "Targets glutes and hamstrings effectively.",
          "Relieves lower back tension.",
          "Easy entry point for hip hinge patterns.",
        ];
      },
      {
        id = 103;
        title = "Hip Thrusts";
        category = "Lower Body";
        description = "A powerful glute-focused exercise using a bench for increased range of motion.";
        section = #basic;
        difficulty = "Beginner";
        videoUrl = "";
        instructions = [
          "Sit on the floor with your upper back resting against a bench edge.",
          "Place feet flat, hip-width apart, and drive hips upward.",
          "Squeeze glutes hard at the top, keeping a neutral spine.",
          "Lower under control and repeat for 12-15 reps.",
        ];
        benefits = [
          "Maximum glute activation and growth.",
          "Improves posture and pelvic stability.",
          "Reduces lower back strain.",
        ];
      },
      {
        id = 104;
        title = "Lunges";
        category = "Lower Body";
        description = "Improve leg strength, balance, and coordination with forward lunges.";
        section = #basic;
        difficulty = "Beginner";
        videoUrl = "";
        instructions = [
          "Stand tall with feet together.",
          "Step forward with your right foot and lower your back knee toward the floor.",
          "Keep your front knee over your ankle.",
          "Push back to start and alternate legs for 10 reps per side.",
        ];
        benefits = [
          "Builds unilateral leg strength.",
          "Improves balance and coordination.",
          "Targets quads, glutes, and hip flexors.",
        ];
      },
      {
        id = 105;
        title = "Calf Raises";
        category = "Lower Body";
        description = "Tone and strengthen the calf muscles with a simple standing movement.";
        section = #basic;
        difficulty = "Beginner";
        videoUrl = "";
        instructions = [
          "Stand with feet hip-width apart, holding a wall for balance if needed.",
          "Rise up onto your toes as high as possible.",
          "Hold for 1 second at the top.",
          "Lower slowly and repeat for 20 reps.",
        ];
        benefits = [
          "Strengthens gastrocnemius and soleus muscles.",
          "Improves ankle stability.",
          "Supports circulation in the lower legs.",
        ];
      },
      {
        id = 106;
        title = "Wall Push-Ups";
        category = "Upper Body";
        description = "A gentle but effective push-up variation suitable for all fitness levels.";
        section = #basic;
        difficulty = "Beginner";
        videoUrl = "";
        instructions = [
          "Stand arm's length from a wall and place palms flat against it.",
          "Bend elbows to bring chest toward the wall.",
          "Keep your body straight as a plank.",
          "Push back to start and repeat for 15 reps.",
        ];
        benefits = [
          "Strengthens chest, shoulders, and triceps.",
          "Beginner-friendly with minimal joint stress.",
          "Improves upper body pushing strength.",
        ];
      },
      {
        id = 107;
        title = "Plank Holds";
        category = "Core";
        description = "Build core stability and endurance with a full-body isometric hold.";
        section = #basic;
        difficulty = "Beginner";
        videoUrl = "";
        instructions = [
          "Start in a push-up position on hands or forearms.",
          "Keep your body in a straight line from head to heels.",
          "Engage your core and hold for 20-45 seconds.",
          "Rest and repeat 3 times, increasing duration over time.",
        ];
        benefits = [
          "Builds deep core and spinal stability.",
          "Engages shoulders, glutes, and legs simultaneously.",
          "Improves posture and reduces back pain.",
        ];
      },
      {
        id = 108;
        title = "Bird-Dogs";
        category = "Core";
        description = "Improve core stability and balance with this low-back-friendly exercise.";
        section = #basic;
        difficulty = "Beginner";
        videoUrl = "";
        instructions = [
          "Start on all fours with wrists under shoulders and knees under hips.",
          "Extend your right arm and left leg simultaneously.",
          "Hold for 2-3 seconds, keeping hips level.",
          "Return and repeat on the opposite side. Do 10 reps each side.",
        ];
        benefits = [
          "Strengthens the erector spinae and glutes.",
          "Improves balance and proprioception.",
          "Protects and stabilises the lower back.",
        ];
      },
      {
        id = 109;
        title = "Lateral Leg Raises";
        category = "Lower Body";
        description = "Target the outer hip and glute medius for a more toned lower body.";
        section = #basic;
        difficulty = "Beginner";
        videoUrl = "";
        instructions = [
          "Lie on your side with legs stacked straight.",
          "Keeping toes pointed forward, lift the top leg to about 45 degrees.",
          "Hold for 1 second, then lower slowly.",
          "Complete 15 reps then switch sides.",
        ];
        benefits = [
          "Activates and tones the glute medius.",
          "Improves hip abductor strength.",
          "Reduces knee valgus and supports knee health.",
        ];
      },
      {
        id = 110;
        title = "Donkey Kicks";
        category = "Lower Body";
        description = "Isolate the glutes with this classic bodyweight exercise.";
        section = #basic;
        difficulty = "Beginner";
        videoUrl = "";
        instructions = [
          "Start on all fours with knees under hips.",
          "Keeping your right knee bent at 90 degrees, press your foot up toward the ceiling.",
          "Squeeze the glute at the top, keeping hips level.",
          "Lower and repeat 15 reps per side.",
        ];
        benefits = [
          "Directly targets the gluteus maximus.",
          "Improves glute-mind-muscle connection.",
          "Supports hip extension strength.",
        ];
      },
      {
        id = 111;
        title = "Inner Thigh Squeezes";
        category = "Lower Body";
        description = "Tone the inner thigh adductors with a simple squeeze exercise.";
        section = #basic;
        difficulty = "Beginner";
        videoUrl = "";
        instructions = [
          "Lie on your back with knees bent and a pillow or small ball between your knees.",
          "Squeeze the pillow firmly with both knees.",
          "Hold for 5 seconds, then release.",
          "Repeat for 15-20 reps.",
        ];
        benefits = [
          "Activates hip adductors.",
          "Improves inner thigh tone.",
          "Supports pelvic floor engagement.",
        ];
      },
      {
        id = 112;
        title = "Seated Hamstring Stretches";
        category = "Flexibility";
        description = "Release hamstring tightness to improve posture and lower back comfort.";
        section = #basic;
        difficulty = "Beginner";
        videoUrl = "";
        instructions = [
          "Sit on the edge of a chair with one leg extended straight.",
          "Keep your back tall and gently hinge forward from the hips until you feel a stretch.",
          "Hold for 20-30 seconds per leg.",
          "Breathe deeply throughout the stretch.",
        ];
        benefits = [
          "Lengthens tight hamstrings.",
          "Relieves lower back tension.",
          "Improves hip flexion range of motion.",
        ];
      },
    ];

    let advanced : [Types.WomenExercise] = [
      {
        id = 201;
        title = "Bulgarian Split Squats";
        category = "Lower Body";
        description = "An intense single-leg exercise for maximum quad and glute development.";
        section = #advanced;
        difficulty = "Advanced";
        videoUrl = "";
        instructions = [
          "Stand a few feet in front of a bench and place one foot behind you on it.",
          "Lower your front knee until your thigh is parallel to the floor.",
          "Keep your torso upright and front knee over your ankle.",
          "Push through the front heel to stand. Do 3 sets of 10 per leg.",
        ];
        benefits = [
          "Builds significant quad and glute mass.",
          "Corrects leg strength imbalances.",
          "Improves hip flexor flexibility.",
        ];
      },
      {
        id = 202;
        title = "Sumo Deadlifts";
        category = "Lower Body";
        description = "A wide-stance deadlift variation that targets the inner thighs and glutes.";
        section = #advanced;
        difficulty = "Advanced";
        videoUrl = "";
        instructions = [
          "Stand with feet wider than hip-width and toes pointed out at 45 degrees.",
          "Hinge at the hips and bend knees to grasp the barbell or dumbbells.",
          "Keep chest up and drive through the heels to stand tall.",
          "Lower under control and repeat for 8-10 reps.",
        ];
        benefits = [
          "Targets inner thighs, glutes, and hamstrings.",
          "Builds full posterior chain strength.",
          "Improves hip mobility under load.",
        ];
      },
      {
        id = 203;
        title = "Jump Squats";
        category = "Cardio";
        description = "A plyometric squat variation for lower body power and cardiovascular conditioning.";
        section = #advanced;
        difficulty = "Advanced";
        videoUrl = "";
        instructions = [
          "Perform a regular squat, lowering until thighs are parallel.",
          "Explosively jump upward, extending hips and knees fully.",
          "Land softly with knees slightly bent to absorb impact.",
          "Immediately lower into the next squat. Do 3 sets of 12.",
        ];
        benefits = [
          "Develops explosive lower body power.",
          "Burns significantly more calories than regular squats.",
          "Improves athletic performance.",
        ];
      },
      {
        id = 204;
        title = "Box Step-Ups";
        category = "Lower Body";
        description = "Unilateral leg training to build glute and quad strength with a box or step.";
        section = #advanced;
        difficulty = "Intermediate";
        videoUrl = "";
        instructions = [
          "Stand in front of a sturdy box or step (30-40 cm height).",
          "Step up with your right foot and drive your left knee upward.",
          "Stand fully on the box, then lower back down with control.",
          "Complete 12 reps per leg for 3 sets.",
        ];
        benefits = [
          "Builds single-leg strength and stability.",
          "Targets glutes and quads effectively.",
          "Improves step and stair function.",
        ];
      },
      {
        id = 205;
        title = "Tricep Dips";
        category = "Upper Body";
        description = "A bodyweight exercise to strengthen the triceps using a bench or chair.";
        section = #advanced;
        difficulty = "Intermediate";
        videoUrl = "";
        instructions = [
          "Sit on the edge of a bench and place hands beside your hips.",
          "Slide off the bench and lower your body by bending elbows to 90 degrees.",
          "Keep elbows pointing straight back and back close to the bench.",
          "Press back up to start. Do 3 sets of 12 reps.",
        ];
        benefits = [
          "Strengthens and tones the triceps.",
          "Improves pushing strength for upper body exercises.",
          "Can be scaled by bending or straightening the legs.",
        ];
      },
      {
        id = 206;
        title = "Pike Push-Ups";
        category = "Upper Body";
        description = "Build shoulder strength and stability with this overhead pressing variation.";
        section = #advanced;
        difficulty = "Intermediate";
        videoUrl = "";
        instructions = [
          "Start in a downward dog position with hips high and arms straight.",
          "Bend elbows outward to lower the top of your head toward the floor.",
          "Push back up to the starting position.",
          "Do 3 sets of 8-10 reps.",
        ];
        benefits = [
          "Develops shoulder and upper chest strength.",
          "Progresses toward handstand push-up strength.",
          "Improves shoulder joint stability.",
        ];
      },
      {
        id = 207;
        title = "Single-Leg Deadlifts";
        category = "Lower Body";
        description = "A balance-intensive deadlift variation for hamstring strength and body control.";
        section = #advanced;
        difficulty = "Advanced";
        videoUrl = "";
        instructions = [
          "Stand on one leg with a slight bend in the knee.",
          "Hinge at the hips and extend the free leg behind you as you lower.",
          "Keep your back flat and reach toward the floor with both hands.",
          "Return to standing by squeezing the glute. Do 10 reps per side.",
        ];
        benefits = [
          "Builds hamstring and glute strength unilaterally.",
          "Dramatically improves balance and proprioception.",
          "Corrects side-to-side strength imbalances.",
        ];
      },
      {
        id = 208;
        title = "Curtsy Lunges";
        category = "Lower Body";
        description = "A lateral lunge variation that targets the glute medius and outer hip.";
        section = #advanced;
        difficulty = "Intermediate";
        videoUrl = "";
        instructions = [
          "Stand with feet hip-width apart.",
          "Step your right foot diagonally behind and to the left, bending both knees.",
          "Keep your front knee over your ankle and torso upright.",
          "Return to start and alternate sides for 12 reps each.",
        ];
        benefits = [
          "Targets glute medius and minimus for outer hip shaping.",
          "Improves hip abductor and adductor balance.",
          "Enhances movement in multiple planes.",
        ];
      },
      {
        id = 209;
        title = "Resistance Band Kickbacks";
        category = "Lower Body";
        description = "Isolate the glutes with a resistance band for targeted toning.";
        section = #advanced;
        difficulty = "Intermediate";
        videoUrl = "";
        instructions = [
          "Attach a resistance band around both ankles and stand near a wall for support.",
          "Shift weight to one leg and kick the other leg straight back.",
          "Squeeze the glute hard at peak extension.",
          "Lower slowly and repeat 15 reps per side.",
        ];
        benefits = [
          "Targets the gluteus maximus with constant resistance.",
          "Improves hip extension strength.",
          "Adds variety to glute isolation training.",
        ];
      },
      {
        id = 210;
        title = "Cable Pull-Throughs";
        category = "Lower Body";
        description = "A hip hinge exercise using a cable machine to target the posterior chain.";
        section = #advanced;
        difficulty = "Advanced";
        videoUrl = "";
        instructions = [
          "Face away from a cable machine set to the lowest position.",
          "Reach between your legs to grab the rope attachment.",
          "Hinge forward at the hips, then drive hips forward to stand.",
          "Complete 12-15 reps with a controlled hip hinge.",
        ];
        benefits = [
          "Develops glutes and hamstrings under constant tension.",
          "Reinforces proper hip hinge mechanics.",
          "Low spinal load compared to barbell deadlifts.",
        ];
      },
      {
        id = 211;
        title = "Barbell Hip Thrusts";
        category = "Lower Body";
        description = "The gold standard for glute hypertrophy using a barbell for resistance.";
        section = #advanced;
        difficulty = "Advanced";
        videoUrl = "";
        instructions = [
          "Position upper back against a bench and a padded barbell across your hips.",
          "Plant feet firmly and drive hips up until your body forms a straight line.",
          "Squeeze glutes maximally at the top for 1-2 seconds.",
          "Lower under control and repeat for 8-12 reps.",
        ];
        benefits = [
          "Produces the highest glute EMG activation of any exercise.",
          "Builds significant glute mass and strength.",
          "Improves athletic performance and posture.",
        ];
      },
      {
        id = 212;
        title = "Romanian Deadlifts";
        category = "Lower Body";
        description = "A hip-hinge movement that develops hamstring length and posterior chain strength.";
        section = #advanced;
        difficulty = "Advanced";
        videoUrl = "";
        instructions = [
          "Stand with feet hip-width apart, holding a barbell or dumbbells in front of your thighs.",
          "Hinge at the hips and push them back, lowering the weight along your shins.",
          "Feel a deep stretch in your hamstrings at the bottom.",
          "Drive hips forward to return to standing. Do 3 sets of 10 reps.",
        ];
        benefits = [
          "Strengthens hamstrings and glutes through a long range of motion.",
          "Improves hip hinge mechanics for daily and athletic movements.",
          "Builds a strong, defined posterior chain.",
        ];
      },
    ];

    { basic; advanced }
  };

  /// Return whether a profile's premium subscription is still active at `now`.
  public func isActive(profile : Types.UserProfile, now : Types.Timestamp) : Bool {
    switch (profile.tier, profile.expiresAt) {
      case (#premium, ?exp) { now < exp };
      case _                { false };
    }
  };

  /// Expire a profile if its premium has lapsed; demote tier to #free.
  public func maybeExpire(profile : Types.UserProfile, now : Types.Timestamp) {
    switch (profile.tier, profile.expiresAt) {
      case (#premium, ?exp) {
        if (now >= exp) {
          profile.tier                 := #free;
          profile.plan                 := null;
          profile.startedAt            := null;
          profile.expiresAt            := null;
          profile.stripeSubscriptionId := null;
        };
      };
      case _ {};
    };
  };

  // ── Plan catalogue ─────────────────────────────────────────────────────────

  /// Return all available subscription plans with their prices and Stripe IDs.
  public func getPlans() : [Types.SubscriptionPlan] {
    [
      {
        duration      = #months3;
        priceUsdCents = 2900;
        displayLabel  = "3 Months";
        stripePriceId = "price_3months_placeholder";
      },
      {
        duration      = #months6;
        priceUsdCents = 4900;
        displayLabel  = "6 Months";
        stripePriceId = "price_6months_placeholder";
      },
      {
        duration      = #months9;
        priceUsdCents = 6900;
        displayLabel  = "9 Months";
        stripePriceId = "price_9months_placeholder";
      },
      {
        duration      = #months12;
        priceUsdCents = 8900;
        displayLabel  = "12 Months";
        stripePriceId = "price_12months_placeholder";
      },
    ]
  };

  /// Look up a plan by duration; returns null if not found.
  public func findPlan(duration : Types.PlanDuration) : ?Types.SubscriptionPlan {
    let plans = getPlans();
    plans.find(func(p) { p.duration == duration })
  };

  // ── Subscription mutations ─────────────────────────────────────────────────

  /// Activate premium on a profile for the given duration starting at `now`.
  public func activatePremium(
    profile               : Types.UserProfile,
    duration              : Types.PlanDuration,
    now                   : Types.Timestamp,
    stripeSubscriptionId  : Text,
  ) {
    let nanos = durationNanos(duration);
    profile.tier                 := #premium;
    profile.plan                 := ?duration;
    profile.startedAt            := ?now;
    profile.expiresAt            := ?(now + nanos);
    profile.stripeSubscriptionId := ?stripeSubscriptionId;
  };

  /// Cancel premium on a profile immediately (demote to free).
  public func cancelPremium(profile : Types.UserProfile) {
    profile.tier                 := #free;
    profile.plan                 := null;
    profile.startedAt            := null;
    profile.expiresAt            := null;
    profile.stripeSubscriptionId := null;
  };

  /// Store a Stripe customer ID on a profile.
  public func setStripeCustomerId(profile : Types.UserProfile, customerId : Text) {
    profile.stripeCustomerId := ?customerId;
  };

  // ── AI message counting ────────────────────────────────────────────────────

  /// Free-tier message limit per session.
  public let freeMessageLimit : Nat = 5;

  /// Returns the number of messages remaining for a free-tier user given
  /// how many they have already sent this session.
  public func messagesRemaining(sentCount : Nat) : Nat {
    if (sentCount >= freeMessageLimit) 0
    else freeMessageLimit - sentCount
  };

  /// Return true when a free user has exceeded their message cap.
  public func isLimitExceeded(tier : Types.Tier, sentCount : Nat) : Bool {
    switch (tier) {
      case (#premium) { false };
      case (#free)    { sentCount >= freeMessageLimit };
    }
  };

  // ── Duration helpers ───────────────────────────────────────────────────────

  /// Convert a PlanDuration to the number of nanoseconds it represents.
  public func durationNanos(duration : Types.PlanDuration) : Int {
    // 1 month ≈ 30 days; 1 day = 86_400 seconds; 1 second = 1_000_000_000 ns
    let dayNs : Int = 86_400 * 1_000_000_000;
    switch (duration) {
      case (#months3)  {  90 * dayNs };
      case (#months6)  { 180 * dayNs };
      case (#months9)  { 270 * dayNs };
      case (#months12) { 365 * dayNs };
    }
  };
};
