import Types "../types/metrics";

/// Static curated science articles library.
/// All articles are accessible to any authenticated user.
module {

  /// Return all curated science articles.
  public func getArticles() : [Types.ScienceArticle] {
    [
      {
        id = 1;
        title = "The Science of Muscle Hypertrophy: How Muscles Grow";
        category = #hypertrophy;
        summary = "A deep dive into the three primary mechanisms that drive muscle protein synthesis and long-term hypertrophy.";
        content = "Muscle hypertrophy occurs through three primary mechanisms: mechanical tension, metabolic stress, and muscle damage. Mechanical tension is produced when a muscle is loaded and stretched under force — this is the dominant driver of growth. Metabolic stress refers to the metabolite accumulation (lactate, hydrogen ions) that occurs during high-rep training, contributing to the 'pump' and anabolic signalling. Muscle damage, while not required for growth, can trigger a repair response that leads to hypertrophy.\n\nFor optimal hypertrophy, research supports training in the 6–20 rep range across 10–20 weekly sets per muscle group. Progressive overload — gradually increasing load, reps, or sets over time — is non-negotiable for continued adaptation. Rest periods of 60–180 seconds between sets preserve metabolic stress while allowing partial recovery for mechanical loading.\n\nProtein synthesis peaks within 24–48 hours post-training, making recovery nutrition critical. Consuming 0.4–0.55 g/kg of protein per meal, 3–5 times daily, maximises muscle protein synthesis throughout the day.";
        readingMinutes = 6;
        publishedDate = "2024-01-15";
      },
      {
        id = 2;
        title = "Progressive Overload: The Fundamental Principle of Strength Training";
        category = #hypertrophy;
        summary = "Why progressive overload is the single most important variable in any resistance training programme and how to apply it intelligently.";
        content = "Progressive overload is the systematic increase of stress placed upon the musculoskeletal system during training. Without it, adaptation plateaus and strength gains stall. The body adapts to a stimulus within 4–8 weeks — if that stimulus does not increase, adaptation stops.\n\nThere are multiple vectors for progression: load (adding weight), volume (more sets or reps), frequency (training a muscle more often), density (more work in the same time), and range of motion. Beginners respond best to load progression; intermediate lifters must rotate through multiple vectors.\n\nA practical approach is the double progression method: work within a rep range (e.g., 8–12). Once you reach the top of the range with good form across all sets, increase the load by the smallest increment. This method prevents ego lifting and ensures joint-friendly progression.\n\nDeload weeks every 4–8 weeks reduce accumulated fatigue and allow supercompensation, meaning you often lift heavier after a planned reduction in volume.";
        readingMinutes = 5;
        publishedDate = "2024-02-01";
      },
      {
        id = 3;
        title = "EPOC and Fat Loss: The Afterburn Effect Explained";
        category = #fatLoss;
        summary = "Does exercise keep burning calories after your workout ends? A scientific look at excess post-exercise oxygen consumption.";
        content = "Excess Post-exercise Oxygen Consumption (EPOC) refers to the elevated rate of oxygen intake that occurs after strenuous exercise as the body returns to its resting state. During this period, caloric expenditure is elevated above baseline.\n\nHigh-intensity interval training (HIIT) and heavy compound resistance training produce the greatest EPOC responses — studies show EPOC from a 45-minute vigorous session can contribute an additional 50–150 kcal over 12–24 hours. While this is significant, it is not the primary driver of fat loss from exercise.\n\nThe greater value of HIIT and resistance training for fat loss lies in: (1) preserving or building muscle mass, which increases resting metabolic rate; (2) improving insulin sensitivity; and (3) the direct caloric expenditure during the session. A caloric deficit remains the non-negotiable foundation of fat loss — EPOC is a helpful addition, not a replacement for dietary control.";
        readingMinutes = 4;
        publishedDate = "2024-02-20";
      },
      {
        id = 4;
        title = "NEAT: The Most Underestimated Fat Loss Tool";
        category = #fatLoss;
        summary = "Non-Exercise Activity Thermogenesis can account for hundreds of calories per day — here is how to maximise it.";
        content = "Non-Exercise Activity Thermogenesis (NEAT) encompasses all movement outside of formal exercise: walking, fidgeting, standing, cleaning, and any spontaneous physical activity. Research shows NEAT can vary by up to 2,000 kcal/day between individuals at the same body weight — making it the most variable component of total daily energy expenditure.\n\nDuring caloric restriction, NEAT naturally decreases as the body conserves energy. This 'adaptive thermogenesis' is a primary reason fat loss plateaus occur. Consciously maintaining NEAT through daily step targets (8,000–12,000 steps) can offset much of this adaptation.\n\nPractical strategies: use a standing desk, take walking meetings, park further away, take stairs, and set hourly movement reminders. A 10,000-step day burns approximately 300–500 kcal more than a sedentary day — without a single gym session.";
        readingMinutes = 5;
        publishedDate = "2024-03-05";
      },
      {
        id = 5;
        title = "Caloric Deficit: How Large Should It Be for Fat Loss?";
        category = #fatLoss;
        summary = "The science behind choosing the right caloric deficit to lose fat while preserving muscle mass.";
        content = "A caloric deficit is the only proven mechanism for fat loss. The question is not whether to create one, but how large to make it. Too aggressive a deficit (greater than 1,000 kcal/day) accelerates muscle loss, hormonal disruption, and metabolic adaptation. Too small a deficit produces slow progress that is difficult to maintain psychologically.\n\nResearch supports a moderate deficit of 300–500 kcal/day, targeting 0.5–1.0% body weight loss per week. For those with higher body fat percentages, slightly larger deficits (500–750 kcal/day) can be used without significant muscle loss, particularly when combined with sufficient protein intake and resistance training.\n\nThe '500 kcal deficit = 1 lb/week loss' rule is a rough approximation. Actual fat loss is non-linear due to water retention fluctuations, hormonal changes, and adaptive thermogenesis. Use a 2–4 week moving average of body weight to assess true trends, not daily fluctuations.";
        readingMinutes = 5;
        publishedDate = "2024-03-18";
      },
      {
        id = 6;
        title = "Protein: The Most Important Macronutrient for Body Composition";
        category = #nutrition;
        summary = "Why protein is essential for both fat loss and muscle gain, and the evidence-based daily intake recommendations.";
        content = "Protein's role in body composition is unmatched by any other macronutrient. It provides the amino acid building blocks for muscle protein synthesis, has the highest thermic effect of food (20–30% of its calories are burned in digestion), and is the most satiating macronutrient — reducing hunger and supporting dietary adherence.\n\nFor individuals engaged in resistance training, current evidence supports 1.6–2.2 g/kg of body weight per day for muscle gain and preservation during fat loss. Spreading intake across 3–5 meals of 0.4–0.55 g/kg maximises muscle protein synthesis rates throughout the day, as single meals cannot stimulate limitless synthesis.\n\nHigh-quality protein sources provide all essential amino acids. Animal sources (chicken, eggs, fish, Greek yoghurt, cottage cheese) are generally higher quality, but plant-based athletes can meet requirements by combining sources and consuming slightly higher total amounts (10–20% more) to account for lower bioavailability.";
        readingMinutes = 6;
        publishedDate = "2024-04-02";
      },
      {
        id = 7;
        title = "Carbohydrate Timing: Do Carbs at Night Make You Fat?";
        category = #nutrition;
        summary = "Dismantling the myth that carbohydrate timing causes fat gain, and the evidence on when carbs actually matter.";
        content = "The idea that eating carbohydrates at night causes fat gain is a persistent myth unsupported by current evidence. Fat storage is determined by total caloric intake relative to expenditure over time — not by the hour of consumption. Multiple studies directly comparing daytime versus evening carbohydrate intake show no difference in body composition outcomes when total calories and macros are matched.\n\nCarbohydrate timing does matter in specific athletic contexts. Consuming carbohydrates within 30–60 minutes post-training replenishes muscle glycogen faster, supporting recovery for individuals training twice per day or in endurance sports. Pre-workout carbohydrates (1–4 g/kg, 1–4 hours before) improve performance in high-intensity exercise.\n\nFor general fitness and fat loss, total carbohydrate quality and quantity matters far more than timing. Prioritise whole food carbohydrate sources (oats, rice, potatoes, fruit) and align intake with activity levels.";
        readingMinutes = 4;
        publishedDate = "2024-04-15";
      },
      {
        id = 8;
        title = "Creatine: The Most Researched Supplement in Sports Science";
        category = #nutrition;
        summary = "What creatine does, who it benefits, and the optimal way to supplement based on decades of research.";
        content = "Creatine monohydrate is the most extensively studied sports supplement in history, with over 500 peer-reviewed studies demonstrating safety and efficacy. It works by increasing phosphocreatine stores in muscle, enabling faster ATP regeneration during short, high-intensity efforts — improving performance in resistance training, HIIT, and explosive sports.\n\nAverage strength gains in studies using creatine are 5–10% greater than placebo over 4–8 weeks. Lean mass gains are typically 1–2 kg higher, though a portion of this reflects water retention within muscle cells (intracellular, not subcutaneous — it does not cause a 'bloated' look).\n\nOptimal dosing: 3–5 g/day of creatine monohydrate consistently. Loading phases (20 g/day for 5–7 days) saturate stores faster but are not necessary — steady-state is reached in 3–4 weeks at 3–5 g/day. Timing is irrelevant; take it consistently. It is safe for healthy individuals across all ages.";
        readingMinutes = 5;
        publishedDate = "2024-05-01";
      },
      {
        id = 9;
        title = "Sleep and Muscle Recovery: Why 8 Hours Is Non-Negotiable";
        category = #recovery;
        summary = "The physiological processes that occur during sleep and how sleep deprivation directly undermines training adaptations.";
        content = "Sleep is the most powerful recovery tool available — no supplement, protocol, or technique comes close. During deep sleep (stages 3–4), growth hormone secretion peaks, driving muscle protein synthesis and tissue repair. Testosterone, critical for anabolic signalling, is predominantly produced during REM sleep.\n\nSleep deprivation (less than 6 hours per night) elevates cortisol, suppresses testosterone and growth hormone, increases muscle protein breakdown, impairs glycogen resynthesis, and reduces training performance by 10–30%. Even one night of poor sleep measurably increases perceived exertion and reduces maximal strength.\n\nFor individuals engaged in regular resistance training, 7–9 hours of quality sleep per night is the recommendation. Sleep hygiene practices that improve quality: consistent sleep and wake times (even on weekends), a cool bedroom (16–19°C), eliminating blue light 60–90 minutes before bed, and avoiding caffeine after 2 PM.";
        readingMinutes = 5;
        publishedDate = "2024-05-20";
      },
      {
        id = 10;
        title = "Active Recovery: How Light Exercise Speeds Up Muscle Repair";
        category = #recovery;
        summary = "Why complete rest is not always optimal and how strategic low-intensity movement accelerates recovery between hard sessions.";
        content = "Delayed Onset Muscle Soreness (DOMS) peaks 24–72 hours after unaccustomed exercise, caused by micro-tears in muscle fibres and the subsequent inflammatory response. While rest is important, complete inactivity can actually prolong recovery by reducing blood flow and metabolite clearance from damaged tissue.\n\nActive recovery — low-intensity movement at 20–40% of maximum heart rate — increases blood circulation to sore muscles without adding additional stress, accelerating the delivery of nutrients and removal of inflammatory by-products. Examples include: light walking, swimming, cycling, yoga, or mobility work.\n\nPractical application: on recovery days, aim for 20–40 minutes of light activity. Foam rolling (self-myofascial release) combined with gentle stretching reduces perceived soreness, though evidence on actual performance recovery is mixed. The primary mechanism is increased parasympathetic activity and improved psychological readiness for the next session.";
        readingMinutes = 4;
        publishedDate = "2024-06-03";
      },
      {
        id = 11;
        title = "Deload Weeks: When to Reduce Training Load for Maximum Progress";
        category = #recovery;
        summary = "The evidence behind planned deload weeks and why backing off periodically leads to greater long-term gains.";
        content = "Fatigue management is an often-overlooked component of training programme design. Accumulated fatigue — from training volume, life stress, sleep debt, and caloric deficit — masks fitness. A deload is a planned, temporary reduction in training volume or intensity, allowing the body to recover while retaining all adaptations.\n\nSigns that a deload is needed: persistent joint aches, declining performance despite adequate sleep and nutrition, elevated resting heart rate, reduced motivation, and excessive soreness that does not resolve between sessions.\n\nDeload protocols vary: volume deloads (reduce sets by 40–50%, maintain load), intensity deloads (reduce load by 20–30%, maintain volume), or complete deload weeks (light movement only). Most evidence supports deloading every 4–8 weeks for intermediate and advanced trainees. Beginners typically do not require planned deloads as their training volume is lower.\n\nPost-deload, supercompensation occurs — the body rebuilds beyond its previous baseline. Many lifters report personal bests in the week after a well-executed deload.";
        readingMinutes = 5;
        publishedDate = "2024-06-20";
      },
      {
        id = 12;
        title = "Insulin Sensitivity: Why It Matters for Fat Loss and Muscle Gain";
        category = #nutrition;
        summary = "How improving insulin sensitivity simultaneously enhances fat burning capacity and nutrient partitioning into muscle tissue.";
        content = "Insulin is a storage hormone released in response to rising blood glucose. When cells are insulin sensitive, glucose is efficiently shuttled into muscle and liver glycogen stores. When cells become insulin resistant, glucose is more readily stored as fat and muscle protein synthesis is impaired.\n\nResistance training is one of the most potent improvers of insulin sensitivity — a single session increases muscle glucose uptake for 24–48 hours via GLUT4 translocation, independent of insulin. Long-term resistance training increases mitochondrial density and improves the muscle's capacity to use both glucose and fatty acids as fuel.\n\nNutritional strategies that improve insulin sensitivity: reducing refined carbohydrate and added sugar intake, increasing fibre consumption (25–35 g/day), distributing carbohydrate intake around exercise, and consuming omega-3 fatty acids (2–3 g EPA+DHA daily). Adequate sleep (7–9 hours) dramatically affects insulin sensitivity — a single week of 5-hour sleep nights reduces insulin sensitivity by 25%.";
        readingMinutes = 6;
        publishedDate = "2024-07-08";
      },
      {
        id = 13;
        title = "The Role of Stretching in Performance and Injury Prevention";
        category = #recovery;
        summary = "Static versus dynamic stretching: when to use each type, what the evidence says about injury prevention, and the real benefits of flexibility training.";
        content = "Stretching is one of the most debated topics in sports science. Static stretching (holding a position for 20–60 seconds) has been shown to acutely reduce force production by 5–8% when performed immediately before strength training — making it suboptimal as a pre-workout warm-up. However, regular long-term static stretching practice improves flexibility and may reduce injury risk when performed at appropriate times.\n\nDynamic stretching (controlled movements through full range of motion) is the evidence-based choice before training. It elevates muscle temperature, improves neuromuscular activation, and increases range of motion without reducing force production. Examples: leg swings, hip circles, arm rotations, and bodyweight squats.\n\nPost-workout static stretching improves flexibility over time without compromising performance. Stretching tight hip flexors and thoracic spine particularly benefits individuals with sedentary jobs. Yoga and dedicated flexibility training improve mobility, posture, and potentially reduce chronic pain.";
        readingMinutes = 5;
        publishedDate = "2024-07-25";
      },
    ]
  };

  /// Return a single article by ID, or null if not found.
  public func getArticle(id : Nat) : ?Types.ScienceArticle {
    let articles = getArticles();
    articles.find(func(a) { a.id == id })
  };
};
