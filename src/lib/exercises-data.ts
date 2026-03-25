
export interface Exercise {
  name: string;
  muscle: string;
  subMuscle: string;
  secondaryMuscles: string;
  setup: string;
  execution: string;
}

export const EXERCISES_DATA: Exercise[] = [
  // CHEST - Upper Chest
  { 
    name: 'Incline Barbell Bench Press', 
    muscle: 'CHEST', 
    subMuscle: 'Upper Chest', 
    secondaryMuscles: 'TRICEPS, SHOULDERS',
    setup: 'Set bench to 30-45 degrees. Grip bar slightly wider than shoulders. Plant feet firmly.',
    execution: 'Lower bar to upper chest with control. Press back up while squeezing the upper pecs.'
  },
  { 
    name: 'Incline Dumbbell Bench Press', 
    muscle: 'CHEST', 
    subMuscle: 'Upper Chest', 
    secondaryMuscles: 'TRICEPS, SHOULDERS',
    setup: 'Lie on incline bench with dumbbells at chest level, palms facing forward.',
    execution: 'Press weights up and slightly inward. Squeeze at the top and lower slowly.'
  },
  { 
    name: 'Incline Smith Machine Press', 
    muscle: 'CHEST', 
    subMuscle: 'Upper Chest', 
    secondaryMuscles: 'TRICEPS, SHOULDERS',
    setup: 'Align incline bench under Smith bar. Grip bar wider than shoulders.',
    execution: 'Un-hook bar and lower to upper chest. Press straight up following the fixed path.'
  },
  { 
    name: 'Incline Cable Press', 
    muscle: 'CHEST', 
    subMuscle: 'Upper Chest', 
    secondaryMuscles: 'TRICEPS, SHOULDERS',
    setup: 'Place incline bench between low pulleys. Grab handles at chest level.',
    execution: 'Press handles upward and together in an arc. Squeeze chest at the peak.'
  },
  { 
    name: 'Incline Dumbbell Fly', 
    muscle: 'CHEST', 
    subMuscle: 'Upper Chest', 
    secondaryMuscles: 'SHOULDERS, BICEPS',
    setup: 'Lie on incline bench with dumbbells above you, palms facing each other.',
    execution: 'Lower weights in a wide arc. Feel the stretch, then squeeze chest to return.'
  },
  { 
    name: 'Incline Cable Fly', 
    muscle: 'CHEST', 
    subMuscle: 'Upper Chest', 
    secondaryMuscles: 'SHOULDERS',
    setup: 'Use low pulleys on an incline bench. Arms extended out to sides.',
    execution: 'Pull handles up and together in an arc. Focus on the upper pec contraction.'
  },
  { 
    name: 'Incline Hammer Strength Press', 
    muscle: 'CHEST', 
    subMuscle: 'Upper Chest', 
    secondaryMuscles: 'TRICEPS, SHOULDERS',
    setup: 'Adjust seat so handles align with upper chest.',
    execution: 'Press forward and up following the machine arc. Squeeze at the top.'
  },
  { 
    name: 'Incline Landmine Press', 
    muscle: 'CHEST', 
    subMuscle: 'Upper Chest', 
    secondaryMuscles: 'SHOULDERS, TRICEPS, ABS & CORE',
    setup: 'Kneel facing landmine. Hold bar end with both hands at upper chest.',
    execution: 'Press bar up and away. Drive hands together to engage upper chest.'
  },
  { 
    name: 'High-to-Low Cable Press', 
    muscle: 'CHEST', 
    subMuscle: 'Upper Chest', 
    secondaryMuscles: 'SHOULDERS',
    setup: 'Set pulleys high. Step forward, grab handles.',
    execution: 'Press handles down and forward, bringing hands together in front of waist.'
  },
  { 
    name: 'Incline Guillotine Press', 
    muscle: 'CHEST', 
    subMuscle: 'Upper Chest', 
    secondaryMuscles: 'SHOULDERS, TRICEPS',
    setup: 'Wide grip on incline bench (Smith machine preferred).',
    execution: 'Lower bar towards clavicle area for max stretch. Press back up carefully.'
  },
  { 
    name: 'Incline Machine Chest Press', 
    muscle: 'CHEST', 
    subMuscle: 'Upper Chest', 
    secondaryMuscles: 'TRICEPS, SHOULDERS',
    setup: 'Adjust machine seat for upper chest alignment.',
    execution: 'Press handles until arms are extended. Control the weight back down.'
  },
  { 
    name: 'Incline Around-the-World Fly', 
    muscle: 'CHEST', 
    subMuscle: 'Upper Chest', 
    secondaryMuscles: 'SHOULDERS',
    setup: 'Lie on incline bench with light dumbbells at your sides.',
    execution: 'Move weights in a large circular motion from sides to above chest.'
  },
  { 
    name: 'Low-Cable to High-Cable Fly', 
    muscle: 'CHEST', 
    subMuscle: 'Upper Chest', 
    secondaryMuscles: 'SHOULDERS, ABS & CORE',
    setup: 'Single handle on low pulley.',
    execution: 'Pull handle upward across body towards opposite shoulder.'
  },
  { 
    name: 'Incline Squeeze Press', 
    muscle: 'CHEST', 
    subMuscle: 'Upper Chest', 
    secondaryMuscles: 'TRICEPS',
    setup: 'Dumbbells pressed together on incline bench.',
    execution: 'Press dumbbells up while forcefully squeezing them together.'
  },
  { 
    name: 'Reverse-Grip Incline Bench Press', 
    muscle: 'CHEST', 
    subMuscle: 'Upper Chest', 
    secondaryMuscles: 'TRICEPS, BACK',
    setup: 'Underhand grip on incline barbell press.',
    execution: 'Lower bar to upper chest, elbows tucked. Press up for upper chest focus.'
  },

  // CHEST - Middle Chest
  { 
    name: 'Flat Barbell Bench Press', 
    muscle: 'CHEST', 
    subMuscle: 'Middle Chest', 
    secondaryMuscles: 'TRICEPS, SHOULDERS',
    setup: 'Lie on flat bench, grip bar slightly wider than shoulders.',
    execution: 'Lower bar to mid-chest. Press up until arms are extended.'
  },
  { 
    name: 'Flat Dumbbell Bench Press', 
    muscle: 'CHEST', 
    subMuscle: 'Middle Chest', 
    secondaryMuscles: 'TRICEPS, SHOULDERS',
    setup: 'Dumbbells at chest level on flat bench.',
    execution: 'Press dumbbells up in an arc. Lower slowly with control.'
  },
  { 
    name: 'Flat Smith Press', 
    muscle: 'CHEST', 
    subMuscle: 'Middle Chest', 
    secondaryMuscles: 'TRICEPS, SHOULDERS',
    setup: 'Flat bench under Smith machine.',
    execution: 'Press the fixed bar up and down focusing on the mid-pecs.'
  },
  { 
    name: 'Flat Hammer Strength Chest Press', 
    muscle: 'CHEST', 
    subMuscle: 'Middle Chest', 
    secondaryMuscles: 'TRICEPS, SHOULDERS',
    setup: 'Adjust seat for mid-chest handle alignment.',
    execution: 'Press handles forward. Squeeze pecs hard at extension.'
  },
  { 
    name: 'Flat Dumbbell Fly', 
    muscle: 'CHEST', 
    subMuscle: 'Middle Chest', 
    secondaryMuscles: 'SHOULDERS',
    setup: 'Dumbbells above you on flat bench, palms neutral.',
    execution: 'Lower in wide arc. Squeeze chest to pull weights back up.'
  },
  { 
    name: 'Cable Fly (Chest Height)', 
    muscle: 'CHEST', 
    subMuscle: 'Middle Chest', 
    secondaryMuscles: 'SHOULDERS',
    setup: 'Pulleys at chest height. Step forward, grab handles.',
    execution: 'Bring handles together in front of chest. Peak contraction focus.'
  },
  { 
    name: 'Close-Grip Bench Press (Chest Focus)', 
    muscle: 'CHEST', 
    subMuscle: 'Middle Chest', 
    secondaryMuscles: 'TRICEPS, SHOULDERS',
    setup: 'Hands inside shoulder-width on flat bench.',
    execution: 'Lower bar to mid-chest. Press up focusing on inner pec squeeze.'
  },
  { 
    name: 'Push-Ups', 
    muscle: 'CHEST', 
    subMuscle: 'Middle Chest', 
    secondaryMuscles: 'TRICEPS, SHOULDERS, ABS & CORE',
    setup: 'Plank position, hands slightly wider than shoulders.',
    execution: 'Lower chest to floor. Push back up, keeping body straight.'
  },
  { 
    name: 'Weighted Push-Ups', 
    muscle: 'CHEST', 
    subMuscle: 'Middle Chest', 
    secondaryMuscles: 'TRICEPS, SHOULDERS, ABS & CORE',
    setup: 'Standard push-up with weight plate on upper back.',
    execution: 'Perform controlled push-ups with the added load.'
  },
  { 
    name: 'Svend Press', 
    muscle: 'CHEST', 
    subMuscle: 'Middle Chest', 
    secondaryMuscles: 'SHOULDERS, FOREARMS',
    setup: 'Stand holding weight plate between palms at chest.',
    execution: 'Squeeze hands together. Press plate forward and return.'
  },
  { 
    name: 'Machine Chest Fly', 
    muscle: 'CHEST', 
    subMuscle: 'Middle Chest', 
    secondaryMuscles: 'SHOULDERS',
    setup: 'Sit in Pec Deck machine, arms parallel to floor.',
    execution: 'Squeeze pads together in front. Hold contraction briefly.'
  },
  { 
    name: 'Cable Crossover (Mid-Level)', 
    muscle: 'CHEST', 
    subMuscle: 'Middle Chest', 
    secondaryMuscles: 'SHOULDERS',
    setup: 'Handles at mid-height. Arms out to sides.',
    execution: 'Pull handles across body to cross in the middle.'
  },
  { 
    name: 'Plate Pinch Press', 
    muscle: 'CHEST', 
    subMuscle: 'Middle Chest', 
    secondaryMuscles: 'SHOULDERS, TRICEPS',
    setup: 'Pinch two plates together between fingers and thumb.',
    execution: 'Press plates away from chest while maintaining the squeeze.'
  },
  { 
    name: 'Iso-Lateral Chest Press Machine', 
    muscle: 'CHEST', 
    subMuscle: 'Middle Chest', 
    secondaryMuscles: 'TRICEPS, SHOULDERS',
    setup: 'Use machine with independent arm movement.',
    execution: 'Press one or both arms forward for balanced growth.'
  },
  { 
    name: 'Stability Ball Dumbbell Chest Press', 
    muscle: 'CHEST', 
    subMuscle: 'Middle Chest', 
    secondaryMuscles: 'ABS & CORE, TRICEPS, SHOULDERS',
    setup: 'Upper back on stability ball, dumbbells at chest.',
    execution: 'Perform press while using core to stabilize body.'
  },

  // CHEST - Lower Chest
  { 
    name: 'Decline Barbell Bench Press', 
    muscle: 'CHEST', 
    subMuscle: 'Lower Chest', 
    secondaryMuscles: 'TRICEPS, SHOULDERS',
    setup: 'Secure feet on decline bench. Wide grip on bar.',
    execution: 'Lower bar to lower chest. Press back up fully.'
  },
  { 
    name: 'Decline Dumbbell Bench Press', 
    muscle: 'CHEST', 
    subMuscle: 'Lower Chest', 
    secondaryMuscles: 'TRICEPS, SHOULDERS',
    setup: 'Dumbbells at sides on decline bench.',
    execution: 'Press weights up in an arc meeting at the top.'
  },
  { 
    name: 'Decline Smith Press', 
    muscle: 'CHEST', 
    subMuscle: 'Lower Chest', 
    secondaryMuscles: 'TRICEPS, SHOULDERS',
    setup: 'Decline bench in Smith machine.',
    execution: 'Lower fixed bar to lower chest. Press up focusing on lower pecs.'
  },
  { 
    name: 'Decline Hammer Strength Press', 
    muscle: 'CHEST', 
    subMuscle: 'Lower Chest', 
    secondaryMuscles: 'TRICEPS, SHOULDERS',
    setup: 'Sit in decline machine, align handles with lower chest.',
    execution: 'Press handles forward. Squeeze lower pecs at extension.'
  },
  { 
    name: 'High-to-Low Cable Fly', 
    muscle: 'CHEST', 
    subMuscle: 'Lower Chest', 
    secondaryMuscles: 'SHOULDERS',
    setup: 'Set pulleys high. Step forward, grab handles.',
    execution: 'Pull handles down and together in front of waist.'
  },
  { 
    name: 'Decline Dumbbell Fly', 
    muscle: 'CHEST', 
    subMuscle: 'Lower Chest', 
    secondaryMuscles: 'SHOULDERS',
    setup: 'Dumbbells above you on decline bench.',
    execution: 'Lower weights in wide arc to sides. Pull back to start.'
  },
  { 
    name: 'Cable Dip Pressdown', 
    muscle: 'CHEST', 
    subMuscle: 'Lower Chest', 
    secondaryMuscles: 'TRICEPS, SHOULDERS',
    setup: 'High pulleys, single handles. Stand between them.',
    execution: 'Press handles down and away mimicking a dip motion.'
  },
  { 
    name: 'Chest Dips', 
    muscle: 'CHEST', 
    subMuscle: 'Lower Chest', 
    secondaryMuscles: 'TRICEPS, SHOULDERS',
    setup: 'On parallel bars, lean torso forward significantly.',
    execution: 'Lower until deep chest stretch. Press up using pecs.'
  },
  { 
    name: 'Weighted Chest Dips', 
    muscle: 'CHEST', 
    subMuscle: 'Lower Chest', 
    secondaryMuscles: 'TRICEPS, SHOULDERS',
    setup: 'Dips with weight belt attached.',
    execution: 'Perform deep dips with added load for lower chest.'
  },
  { 
    name: 'Decline Machine Chest Press', 
    muscle: 'CHEST', 
    subMuscle: 'Lower Chest', 
    secondaryMuscles: 'TRICEPS, SHOULDERS',
    setup: 'Adjust decline machine seat.',
    execution: 'Press weight away focusing on lower pec contraction.'
  },
  { 
    name: 'Lower-Pulley Chest Fly', 
    muscle: 'CHEST', 
    subMuscle: 'Lower Chest', 
    secondaryMuscles: 'SHOULDERS',
    setup: 'Low cable pulleys, single handles.',
    execution: 'Scooping fly motion, bringing hands together in front of chest.'
  },
  { 
    name: 'Underhand Cable Press (Decline Arc)', 
    muscle: 'CHEST', 
    subMuscle: 'Lower Chest', 
    secondaryMuscles: 'TRICEPS, SHOULDERS',
    setup: 'Underhand grip on low pulleys.',
    execution: 'Press up in an arc meeting at the top.'
  },
  { 
    name: 'Kneeling Low Cable Press', 
    muscle: 'CHEST', 
    subMuscle: 'Lower Chest', 
    secondaryMuscles: 'ABS & CORE, SHOULDERS',
    setup: 'Kneel between low pulleys.',
    execution: 'Press handles up and together in front of face.'
  },
  { 
    name: 'Medicine Ball Push-ups (Feet Elevated)', 
    muscle: 'CHEST', 
    subMuscle: 'Lower Chest', 
    secondaryMuscles: 'SHOULDERS, TRICEPS, ABS & CORE',
    setup: 'Feet on bench, one hand on medicine ball.',
    execution: 'Perform push-up at a decline angle for lower pec focus.'
  },
  { 
    name: 'Decline Around-the-World Fly', 
    muscle: 'CHEST', 
    subMuscle: 'Lower Chest', 
    secondaryMuscles: 'SHOULDERS',
    setup: 'Decline bench with light dumbbells.',
    execution: 'Circular "snow angel" motion meeting above chest.'
  },

  // BACK - Lats
  { 
    name: 'Pull-Ups', 
    muscle: 'BACK', 
    subMuscle: 'Lats (Latissimus Dorsi)', 
    secondaryMuscles: 'BICEPS, SHOULDERS',
    setup: 'Grip bar wider than shoulders, palms facing away.',
    execution: 'Pull chest to bar by driving elbows down. Squeeze lats.'
  },
  { 
    name: 'Chin-Ups', 
    muscle: 'BACK', 
    subMuscle: 'Lats (Latissimus Dorsi)', 
    secondaryMuscles: 'BICEPS, SHOULDERS',
    setup: 'Underhand, shoulder-width grip on bar.',
    execution: 'Pull up until chin clears bar. Focus on bicep/lat synergy.'
  },
  { 
    name: 'Lat Pulldown', 
    muscle: 'BACK', 
    subMuscle: 'Lats (Latissimus Dorsi)', 
    secondaryMuscles: 'BICEPS, SHOULDERS',
    setup: 'Secure knees under pad. Wide overhand grip on bar.',
    execution: 'Pull bar to upper chest. Squeeze shoulder blades.'
  },
  { 
    name: 'Wide-Grip Pulldown', 
    muscle: 'BACK', 
    subMuscle: 'Lats (Latissimus Dorsi)', 
    secondaryMuscles: 'BICEPS',
    setup: 'Pulldown with very wide bar grip.',
    execution: 'Pull to upper chest focusing on outer lat stretch/squeeze.'
  },
  { 
    name: 'Close-Grip Pulldown', 
    muscle: 'BACK', 
    subMuscle: 'Lats (Latissimus Dorsi)', 
    secondaryMuscles: 'BICEPS',
    setup: 'Use V-bar attachment.',
    execution: 'Pull handle to mid-chest. Focus on lower lat contraction.'
  },
  { 
    name: 'Reverse-Grip Pulldown', 
    muscle: 'BACK', 
    subMuscle: 'Lats (Latissimus Dorsi)', 
    secondaryMuscles: 'BICEPS',
    setup: 'Underhand, shoulder-width grip.',
    execution: 'Pull bar to mid-chest keeping elbows tucked.'
  },
  { 
    name: 'Single-Arm Lat Pulldown', 
    muscle: 'BACK', 
    subMuscle: 'Lats (Latissimus Dorsi)', 
    secondaryMuscles: 'ABS & CORE, BICEPS',
    setup: 'Single handle on pulldown machine.',
    execution: 'Pull handle to side. Focus on deep lat squeeze.'
  },
  { 
    name: 'Straight-Arm Pulldown', 
    muscle: 'BACK', 
    subMuscle: 'Lats (Latissimus Dorsi)', 
    secondaryMuscles: 'TRICEPS, SHOULDERS, ABS & CORE',
    setup: 'Stand facing high pulley with straight bar.',
    execution: 'Pull bar to thighs with straight arms. Pure lat isolation.'
  },
  { 
    name: 'Cable Pullover', 
    muscle: 'BACK', 
    subMuscle: 'Lats (Latissimus Dorsi)', 
    secondaryMuscles: 'TRICEPS',
    setup: 'Lie on bench, head near low pulley bar.',
    execution: 'Pull bar in arc from behind head to above chest.'
  },
  { 
    name: 'Dumbbell Pullover', 
    muscle: 'BACK', 
    subMuscle: 'Lats (Latissimus Dorsi)', 
    secondaryMuscles: 'CHEST, TRICEPS',
    setup: 'Upper back across flat bench, hold dumbbell above chest.',
    execution: 'Lower weight behind head. Pull back to start.'
  },
  { 
    name: 'Machine Pullover', 
    muscle: 'BACK', 
    subMuscle: 'Lats (Latissimus Dorsi)', 
    secondaryMuscles: 'SHOULDERS, TRICEPS',
    setup: 'Adjust pullover machine seat and pads.',
    execution: 'Press pads down in wide arc using lats only.'
  },
  { 
    name: 'Neutral-Grip Pulldown', 
    muscle: 'BACK', 
    subMuscle: 'Lats (Latissimus Dorsi)', 
    secondaryMuscles: 'BICEPS',
    setup: 'Use parallel neutral grip bar.',
    execution: 'Pull to chest for ergonomic lat training.'
  },
  { 
    name: 'Weighted Pull-Ups', 
    muscle: 'BACK', 
    subMuscle: 'Lats (Latissimus Dorsi)', 
    secondaryMuscles: 'BICEPS, FOREARMS',
    setup: 'Pull-ups with weight belt or dumbbell.',
    execution: 'Pull body up with added load. Maintain strict form.'
  },
  { 
    name: 'Assisted Pull-Ups', 
    muscle: 'BACK', 
    subMuscle: 'Lats (Latissimus Dorsi)', 
    secondaryMuscles: 'BICEPS',
    setup: 'Use machine or band for assistance.',
    execution: 'Perform full range pull-ups focusing on lat activation.'
  },
  { 
    name: 'Kneeling Single-Arm Pulldown', 
    muscle: 'BACK', 
    subMuscle: 'Lats (Latissimus Dorsi)', 
    secondaryMuscles: 'ABS & CORE',
    setup: 'Kneel facing high pulley handle.',
    execution: 'Pull handle to hip focusing on single lat contraction.'
  },
  { 
    name: 'Iso-Lateral Lat Pulldown Machine', 
    muscle: 'BACK', 
    subMuscle: 'Lats (Latissimus Dorsi)', 
    secondaryMuscles: 'BICEPS',
    setup: 'Use machine with independent arms.',
    execution: 'Pull down focusing on balanced back growth.'
  },
  { 
    name: 'Decline Pullover', 
    muscle: 'BACK', 
    subMuscle: 'Lats (Latissimus Dorsi)', 
    secondaryMuscles: 'TRICEPS',
    setup: 'Dumbbell pullover on decline bench.',
    execution: 'Lower and pull focusing on lower lat stretch.'
  },
  { 
    name: '“J” Pulldown', 
    muscle: 'BACK', 
    subMuscle: 'Lats (Latissimus Dorsi)', 
    secondaryMuscles: 'SHOULDERS',
    setup: 'High pulley straight bar.',
    execution: 'Pull bar down and in towards body in a "J" path.'
  },
  { 
    name: 'Kayak Pulldown', 
    muscle: 'BACK', 
    subMuscle: 'Lats (Latissimus Dorsi)', 
    secondaryMuscles: 'ABS & CORE, SHOULDERS',
    setup: 'High pulley handle.',
    execution: 'Pull down and across in a rowing/kayak motion.'
  },
  { 
    name: 'Behind-the-Neck Pulldown', 
    muscle: 'BACK', 
    subMuscle: 'Lats (Latissimus Dorsi)', 
    secondaryMuscles: 'SHOULDERS',
    setup: 'Lat pulldown, pull behind head.',
    execution: 'Carefully pull to traps. Requires high shoulder mobility.'
  },

  // BACK - Rhomboids
  { 
    name: 'Bent Over Barbell Row', 
    muscle: 'BACK', 
    subMuscle: 'Rhomboids (Middle Back)', 
    secondaryMuscles: 'BICEPS, LEGS',
    setup: 'Hinge at hips, back flat. Grip bar overhand.',
    execution: 'Pull bar to lower chest. Squeeze shoulder blades hard.'
  },
  { 
    name: 'T-Bar Row', 
    muscle: 'BACK', 
    subMuscle: 'Rhomboids (Middle Back)', 
    secondaryMuscles: 'BICEPS',
    setup: 'Stand over T-bar, use V-grip handle.',
    execution: 'Pull handle to chest. Focus on retracting rhomboids.'
  },
  { 
    name: 'One-Arm Dumbbell Row', 
    muscle: 'BACK', 
    subMuscle: 'Rhomboids (Middle Back)', 
    secondaryMuscles: 'BICEPS, ABS & CORE',
    setup: 'One knee/hand on bench for support.',
    execution: 'Pull dumbbell to hip. Keep elbow close to side.'
  },
  { 
    name: 'Seated Cable Row', 
    muscle: 'BACK', 
    subMuscle: 'Rhomboids (Middle Back)', 
    secondaryMuscles: 'BICEPS',
    setup: 'Feet on platform, V-grip handle.',
    execution: 'Pull to abdomen. Keep chest high, back straight.'
  },
  { 
    name: 'Machine Row', 
    muscle: 'BACK', 
    subMuscle: 'Rhomboids (Middle Back)', 
    secondaryMuscles: 'BICEPS',
    setup: 'Sit in row machine, chest against pad.',
    execution: 'Pull handles back and squeeze mid-back.'
  },
  { 
    name: 'Chest-Supported Row', 
    muscle: 'BACK', 
    subMuscle: 'Rhomboids (Middle Back)', 
    secondaryMuscles: 'BICEPS, SHOULDERS',
    setup: 'Face down on incline bench or supported machine.',
    execution: 'Row weights up without using momentum.'
  },
  { 
    name: 'Meadows Row', 
    muscle: 'BACK', 
    subMuscle: 'Rhomboids (Middle Back)', 
    secondaryMuscles: 'BICEPS, FOREARMS',
    setup: 'Stand sideways to landmine bar end.',
    execution: 'Row bar end up focusing on upper back stretch.'
  },
  { 
    name: 'Wide-Grip Seated Row', 
    muscle: 'BACK', 
    subMuscle: 'Rhomboids (Middle Back)', 
    secondaryMuscles: 'SHOULDERS',
    setup: 'Wide bar on seated row machine.',
    execution: 'Pull to chest with flared elbows for rhomboid focus.'
  },
  { 
    name: 'V-Grip Seated Row', 
    muscle: 'BACK', 
    subMuscle: 'Rhomboids (Middle Back)', 
    secondaryMuscles: 'BICEPS',
    setup: 'Standard seated row with V-handle.',
    execution: 'Pull to stomach squeezing middle back.'
  },
  { 
    name: 'Kroc Row', 
    muscle: 'BACK', 
    subMuscle: 'Rhomboids (Middle Back)', 
    secondaryMuscles: 'BICEPS, FOREARMS',
    setup: 'Heavy dumbbell, high reps, explosive style.',
    execution: 'Row with controlled momentum for upper back volume.'
  },
  { 
    name: 'Pendlay Row', 
    muscle: 'BACK', 
    subMuscle: 'Rhomboids (Middle Back)', 
    secondaryMuscles: 'BICEPS, LEGS, ABS & CORE',
    setup: 'Barbell on floor, torso parallel to ground.',
    execution: 'Explosively row to chest. Return bar to floor each rep.'
  },
  { 
    name: 'Seal Row', 
    muscle: 'BACK', 
    subMuscle: 'Rhomboids (Middle Back)', 
    secondaryMuscles: 'BICEPS, SHOULDERS',
    setup: 'Lie face down on elevated bench.',
    execution: 'Row weight up. Zero leg drive, pure back isolation.'
  },
  { 
    name: 'Landmine Row', 
    muscle: 'BACK', 
    subMuscle: 'Rhomboids (Middle Back)', 
    secondaryMuscles: 'BICEPS, ABS & CORE',
    setup: 'Stand over landmine bar with both hands.',
    execution: 'Row up to chest. Heavy rhomboid engagement.'
  },
  { 
    name: 'Standing Cable Row', 
    muscle: 'BACK', 
    subMuscle: 'Rhomboids (Middle Back)', 
    secondaryMuscles: 'ABS & CORE, BICEPS',
    setup: 'Stand facing low pulley.',
    execution: 'Row handle to stomach maintaining flat back.'
  },
  { 
    name: 'Hammer Strength Row', 
    muscle: 'BACK', 
    subMuscle: 'Rhomboids (Middle Back)', 
    secondaryMuscles: 'BICEPS',
    setup: 'Hammer Strength row machine.',
    execution: 'Pull handles focusing on the mid-back squeeze.'
  },

  // BACK - Erector Spinae
  { 
    name: 'Deadlift', 
    muscle: 'BACK', 
    subMuscle: 'Erector Spinae (Lower Back)', 
    secondaryMuscles: 'LEGS, FOREARMS',
    setup: 'Barbell over mid-foot. Hinge and grip bar.',
    execution: 'Drive through legs to stand tall. Squeeze glutes.'
  },
  { 
    name: 'Romanian Deadlift', 
    muscle: 'BACK', 
    subMuscle: 'Erector Spinae (Lower Back)', 
    secondaryMuscles: 'LEGS, FOREARMS',
    setup: 'Barbell in hands, slight knee bend.',
    execution: 'Push hips back, lower weight feeling hamstring stretch.'
  },
  { 
    name: 'Stiff-Leg Deadlift', 
    muscle: 'BACK', 
    subMuscle: 'Erector Spinae (Lower Back)', 
    secondaryMuscles: 'LEGS',
    setup: 'Standard DL with near-straight legs.',
    execution: 'Lower weight slowly focusing on deep hamstring/lower back stretch.'
  },
  { 
    name: 'Hyperextensions', 
    muscle: 'BACK', 
    subMuscle: 'Erector Spinae (Lower Back)', 
    secondaryMuscles: 'LEGS',
    setup: 'On 45-degree hyper bench.',
    execution: 'Lower torso and raise back to straight line.'
  },
  { 
    name: 'Reverse Hyperextensions', 
    muscle: 'BACK', 
    subMuscle: 'Erector Spinae (Lower Back)', 
    secondaryMuscles: 'LEGS',
    setup: 'Face down on reverse hyper machine.',
    execution: 'Raise legs up behind you using lower back/glutes.'
  },
  { 
    name: 'Good Mornings', 
    muscle: 'BACK', 
    subMuscle: 'Erector Spinae (Lower Back)', 
    secondaryMuscles: 'LEGS',
    setup: 'Light barbell on traps, feet shoulder-width.',
    execution: 'Hinge at hips with flat back. Torso near parallel to floor.'
  },
  { 
    name: 'Back Extension Machine', 
    muscle: 'BACK', 
    subMuscle: 'Erector Spinae (Lower Back)', 
    secondaryMuscles: 'LEGS',
    setup: 'Sit in extension machine.',
    execution: 'Lean back against pad to extend spine.'
  },
  { 
    name: 'Trap Bar Deadlift', 
    muscle: 'BACK', 
    subMuscle: 'Erector Spinae (Lower Back)', 
    secondaryMuscles: 'LEGS',
    setup: 'Stand inside trap bar, grip neutral handles.',
    execution: 'Drive up. Easier on lower back than straight bar.'
  },
  { 
    name: 'Jefferson Curl', 
    muscle: 'BACK', 
    subMuscle: 'Erector Spinae (Lower Back)', 
    secondaryMuscles: 'LEGS, ABS & CORE',
    setup: 'Standing on box with light weight.',
    execution: 'Slowly round spine down vertebra by vertebra.'
  },
  { 
    name: 'Cable Lower-Back Extensions', 
    muscle: 'BACK', 
    subMuscle: 'Erector Spinae (Lower Back)', 
    secondaryMuscles: 'LEGS',
    setup: 'Ankle strap on low pulley around hips.',
    execution: 'Hinge at hips against cable resistance.'
  },

  // BACK - Traps
  { 
    name: 'Barbell Shrugs', 
    muscle: 'BACK', 
    subMuscle: 'Traps', 
    secondaryMuscles: 'FOREARMS',
    setup: 'Hold heavy barbell in front.',
    execution: 'Shrug shoulders to ears. Hold and squeeze.'
  },
  { 
    name: 'Dumbbell Shrugs', 
    muscle: 'BACK', 
    subMuscle: 'Traps', 
    secondaryMuscles: 'FOREARMS',
    setup: 'Heavy dumbbells at sides.',
    execution: 'Shrug straight up without rolling shoulders.'
  },
  { 
    name: 'Behind-the-Back Shrugs', 
    muscle: 'BACK', 
    subMuscle: 'Traps', 
    secondaryMuscles: 'FOREARMS, SHOULDERS',
    setup: 'Hold bar behind you.',
    execution: 'Shrug up focusing on mid-trap contraction.'
  },
  { 
    name: 'Cable Shrugs', 
    muscle: 'BACK', 
    subMuscle: 'Traps', 
    secondaryMuscles: 'FOREARMS',
    setup: 'Straight bar on low cable.',
    execution: 'Perform shrug with constant cable tension.'
  },
  { 
    name: 'Machine Shrugs', 
    muscle: 'BACK', 
    subMuscle: 'Traps', 
    secondaryMuscles: 'None',
    setup: 'Shrug machine or standing calf machine.',
    execution: 'Shrug up against pads for heavy stable work.'
  },
  { 
    name: 'Farmer\'s Walk', 
    muscle: 'BACK', 
    subMuscle: 'Traps', 
    secondaryMuscles: 'FOREARMS, ABS & CORE, LEGS',
    setup: 'Heavy dumbbells in each hand.',
    execution: 'Walk for time/distance with perfect posture.'
  },
  { 
    name: 'Upright Row', 
    muscle: 'BACK', 
    subMuscle: 'Traps', 
    secondaryMuscles: 'SHOULDERS, BICEPS',
    setup: 'Barbell or EZ-bar, shoulder-width grip.',
    execution: 'Pull bar to chin leading with elbows.'
  },
  { 
    name: 'Incline Dumbbell Shrug', 
    muscle: 'BACK', 
    subMuscle: 'Traps', 
    secondaryMuscles: 'SHOULDERS',
    setup: 'Face down on incline bench.',
    execution: 'Retract blades and shrug up for mid-back traps.'
  },
  { 
    name: 'Plate Shrugs', 
    muscle: 'BACK', 
    subMuscle: 'Traps', 
    secondaryMuscles: 'FOREARMS',
    setup: 'Heavy plates in each hand.',
    execution: 'Shrug up with added grip demand.'
  },
  { 
    name: 'Barbell High Pull', 
    muscle: 'BACK', 
    subMuscle: 'Traps', 
    secondaryMuscles: 'SHOULDERS, LEGS',
    setup: 'Shoulder-width grip on bar.',
    execution: 'Explosive upright row using hip drive.'
  },
  { 
    name: 'Smith Machine Shrugs', 
    muscle: 'BACK', 
    subMuscle: 'Traps', 
    secondaryMuscles: 'FOREARMS',
    setup: 'Bar in Smith machine.',
    execution: 'Shrug straight up following the fixed path.'
  },
  { 
    name: 'Kelso Shrug', 
    muscle: 'BACK', 
    subMuscle: 'Traps', 
    secondaryMuscles: 'SHOULDERS',
    setup: 'Face down on incline bench holding dumbbells.',
    execution: 'Shrug without bending arms to isolate mid-traps.'
  },
  { 
    name: 'Power Shrugs', 
    muscle: 'BACK', 
    subMuscle: 'Traps', 
    secondaryMuscles: 'LEGS, FOREARMS',
    setup: 'Very heavy barbell.',
    execution: 'Explosive shrug using slight leg drive.'
  },

  // BACK - Teres Major-Minor
  { 
    name: 'Straight-Arm Pulldown (Teres Emphasis)', 
    muscle: 'BACK', 
    subMuscle: 'Teres Major-Minor', 
    secondaryMuscles: 'SHOULDERS',
    setup: 'High pulley straight bar.',
    execution: 'Focus on pulling from the armpit area for teres sweep.'
  },
  { 
    name: 'Kneeling Lat Row', 
    muscle: 'BACK', 
    subMuscle: 'Teres Major-Minor', 
    secondaryMuscles: 'ABS & CORE, BICEPS',
    setup: 'Kneel facing low pulley.',
    execution: 'Drive elbow back focusing on the muscle under armpit.'
  },
  { 
    name: 'Low Cable Row (Elbows Out)', 
    muscle: 'BACK', 
    subMuscle: 'Teres Major-Minor', 
    secondaryMuscles: 'SHOULDERS',
    setup: 'Seated row wide grip.',
    execution: 'Pull to upper chest with elbows flared.'
  },
  { 
    name: 'Dumbbell Row to Hip', 
    muscle: 'BACK', 
    subMuscle: 'Teres Major-Minor', 
    secondaryMuscles: 'BICEPS',
    setup: 'One arm dumbbell row.',
    execution: 'Pull in an arc towards hip for lower back/teres.'
  },
  { 
    name: 'Lat-Focused Underhand Row', 
    muscle: 'BACK', 
    subMuscle: 'Teres Major-Minor', 
    secondaryMuscles: 'BICEPS',
    setup: 'Underhand barbell row.',
    execution: 'Row to waist focusing on the outer back sweep.'
  },
  { 
    name: 'Cross-Body Cable Row', 
    muscle: 'BACK', 
    subMuscle: 'Teres Major-Minor', 
    secondaryMuscles: 'SHOULDERS',
    setup: 'Low pulley handle across body.',
    execution: 'Pull across torso for teres stretch and squeeze.'
  },
  { 
    name: 'Rear Delt Row (Hits Teres)', 
    muscle: 'BACK', 
    subMuscle: 'Teres Major-Minor', 
    secondaryMuscles: 'SHOULDERS',
    setup: 'Wide grip row.',
    execution: 'Pull bar high with flared elbows.'
  },
  { 
    name: 'High Cable Partial Row', 
    muscle: 'BACK', 
    subMuscle: 'Teres Major-Minor', 
    secondaryMuscles: 'SHOULDERS',
    setup: 'High pulley handle.',
    execution: 'Small rowing motion focused on upper lat/teres only.'
  },
  { 
    name: 'Chest-Supported Neutral Row', 
    muscle: 'BACK', 
    subMuscle: 'Teres Major-Minor', 
    secondaryMuscles: 'BICEPS',
    setup: 'Bench supported neutral row.',
    execution: 'Squeeze back together focusing on outer muscles.'
  },
  { 
    name: 'Plate-Loaded High Row', 
    muscle: 'BACK', 
    subMuscle: 'Teres Major-Minor', 
    secondaryMuscles: 'BICEPS',
    setup: 'High row machine handles.',
    execution: 'Pull down and back for upper back thickness.'
  },
  { 
    name: 'Cable Iso Teres Pull', 
    muscle: 'BACK', 
    subMuscle: 'Teres Major-Minor', 
    secondaryMuscles: 'SHOULDERS',
    setup: 'Specific cable angle for teres.',
    execution: 'Focus on pulling from armpit to hip.'
  },

  // SHOULDERS - Front Deltoid
  { 
    name: 'Barbell Shoulder Press', 
    muscle: 'SHOULDERS', 
    subMuscle: 'Front Deltoid', 
    secondaryMuscles: 'TRICEPS, CHEST',
    setup: 'Barbell at upper chest, seated or standing.',
    execution: 'Press straight overhead until arms are extended.'
  },
  { 
    name: 'Dumbbell Shoulder Press', 
    muscle: 'SHOULDERS', 
    subMuscle: 'Front Deltoid', 
    secondaryMuscles: 'TRICEPS',
    setup: 'Dumbbells at shoulder height.',
    execution: 'Press overhead meeting at the top. Control down.'
  },
  { 
    name: 'Arnold Press', 
    muscle: 'SHOULDERS', 
    subMuscle: 'Front Deltoid', 
    secondaryMuscles: 'TRICEPS',
    setup: 'Dumbbells in front of chest, palms facing you.',
    execution: 'Press up while rotating palms to face forward.'
  },
  { 
    name: 'Smith Machine Shoulder Press', 
    muscle: 'SHOULDERS', 
    subMuscle: 'Front Deltoid', 
    secondaryMuscles: 'TRICEPS',
    setup: 'Bench under Smith machine bar.',
    execution: 'Press bar up. Fixed path adds stability.'
  },
  { 
    name: 'Front Raise Dumbbells', 
    muscle: 'SHOULDERS', 
    subMuscle: 'Front Deltoid', 
    secondaryMuscles: 'CHEST',
    setup: 'Dumbbells at front of thighs.',
    execution: 'Raise straight arms to shoulder height. Do not swing.'
  },
  { 
    name: 'Front Raise Plate', 
    muscle: 'SHOULDERS', 
    subMuscle: 'Front Deltoid', 
    secondaryMuscles: 'CHEST, FOREARMS',
    setup: 'Hold weight plate at 3 and 9 o\'clock.',
    execution: 'Raise to shoulder height. Keep core braced.'
  },
  { 
    name: 'Barbell Front Raise', 
    muscle: 'SHOULDERS', 
    subMuscle: 'Front Deltoid', 
    secondaryMuscles: 'CHEST, ABS & CORE',
    setup: 'Overhand grip on barbell.',
    execution: 'Raise bar to eye level keeping arms straight.'
  },
  { 
    name: 'Landmine Shoulder Press', 
    muscle: 'SHOULDERS', 
    subMuscle: 'Front Deltoid', 
    secondaryMuscles: 'TRICEPS, CHEST, ABS & CORE',
    setup: 'Kneel holding landmine bar end.',
    execution: 'Press up and away in an arc.'
  },
  { 
    name: 'Cable Front Raise', 
    muscle: 'SHOULDERS', 
    subMuscle: 'Front Deltoid', 
    secondaryMuscles: 'CHEST',
    setup: 'Face away from low pulley.',
    execution: 'Raise handle between legs to shoulder height.'
  },
  { 
    name: 'Machine Shoulder Press', 
    muscle: 'SHOULDERS', 
    subMuscle: 'Front Deltoid', 
    secondaryMuscles: 'TRICEPS',
    setup: 'Adjust shoulder press machine seat.',
    execution: 'Press handles overhead squeezing delts.'
  },
  { 
    name: 'Z-Press', 
    muscle: 'SHOULDERS', 
    subMuscle: 'Front Deltoid', 
    secondaryMuscles: 'ABS & CORE, TRICEPS',
    setup: 'Sit on floor, legs straight and wide.',
    execution: 'Press weight overhead without leaning back.'
  },
  { 
    name: 'Kneeling Barbell Press', 
    muscle: 'SHOULDERS', 
    subMuscle: 'Front Deltoid', 
    secondaryMuscles: 'ABS & CORE, TRICEPS',
    setup: 'Kneeling position with bar at chest.',
    execution: 'Press overhead focusing on strict form.'
  },
  { 
    name: 'Military Press', 
    muscle: 'SHOULDERS', 
    subMuscle: 'Front Deltoid', 
    secondaryMuscles: 'TRICEPS, ABS & CORE, LEGS',
    setup: 'Standing with feet together, bar at chest.',
    execution: 'Strict overhead press. Zero leg drive.'
  },
  { 
    name: 'Resistance Band Front Raise', 
    muscle: 'SHOULDERS', 
    subMuscle: 'Front Deltoid', 
    secondaryMuscles: 'CHEST',
    setup: 'Step on band holding handles.',
    execution: 'Raise handles to eye level against band tension.'
  },
  { 
    name: 'Single-Arm Dumbbell Press', 
    muscle: 'SHOULDERS', 
    subMuscle: 'Front Deltoid', 
    secondaryMuscles: 'ABS & CORE, TRICEPS',
    setup: 'Hold one dumbbell at shoulder.',
    execution: 'Press up while resisting body lean.'
  },

  // SHOULDERS - Side Deltoid
  { 
    name: 'Dumbbell Lateral Raise', 
    muscle: 'SHOULDERS', 
    subMuscle: 'Side Deltoid', 
    secondaryMuscles: 'None',
    setup: 'Dumbbells at sides, palms in.',
    execution: 'Raise out to sides to shoulder height. Tilt weights slightly forward.'
  },
  { 
    name: 'Cable Lateral Raise', 
    muscle: 'SHOULDERS', 
    subMuscle: 'Side Deltoid', 
    secondaryMuscles: 'None',
    setup: 'Stand sideways to low pulley.',
    execution: 'Raise handle out to side. Constant cable tension.'
  },
  { 
    name: 'Machine Lateral Raise', 
    muscle: 'SHOULDERS', 
    subMuscle: 'Side Deltoid', 
    secondaryMuscles: 'None',
    setup: 'Sit in machine, arms against pads.',
    execution: 'Raise arms out to side against machine resistance.'
  },
  { 
    name: 'Seated Lateral Raise', 
    muscle: 'SHOULDERS', 
    subMuscle: 'Side Deltoid', 
    secondaryMuscles: 'None',
    setup: 'Sit on bench, dumbbells at sides.',
    execution: 'Raise out to shoulder height. Minimizes leg momentum.'
  },
  { 
    name: 'Lean-Away Lateral Raise', 
    muscle: 'SHOULDERS', 
    subMuscle: 'Side Deltoid', 
    secondaryMuscles: 'ABS & CORE',
    setup: 'Hold rack and lean away from it.',
    execution: 'Perform lateral raise. Increased bottom-range stretch.'
  },
  { 
    name: 'Dead-Stop Lateral Raise', 
    muscle: 'SHOULDERS', 
    subMuscle: 'Side Deltoid', 
    secondaryMuscles: 'None',
    setup: 'Start with dumbbells resting at your sides.',
    execution: 'Raise from complete stop to eliminate momentum.'
  },
  { 
    name: 'Upright Row (Side Delt Variation)', 
    muscle: 'SHOULDERS', 
    subMuscle: 'Side Deltoid', 
    secondaryMuscles: 'BICEPS',
    setup: 'Wide grip on barbell.',
    execution: 'Pull bar to chest, elbows high and out.'
  },
  { 
    name: 'Dumbbell “W’s”', 
    muscle: 'SHOULDERS', 
    subMuscle: 'Side Deltoid', 
    secondaryMuscles: 'None',
    setup: 'Hinge forward slightly.',
    execution: 'External shoulder rotation into a "W" position.'
  },
  { 
    name: 'Lateral Raise Partial Reps', 
    muscle: 'SHOULDERS', 
    subMuscle: 'Side Deltoid', 
    secondaryMuscles: 'None',
    setup: 'After full sets.',
    execution: 'Do small partial raises to fully burn out delts.'
  },
  { 
    name: 'Behind-Back Cable Raise', 
    muscle: 'SHOULDERS', 
    subMuscle: 'Side Deltoid', 
    secondaryMuscles: 'None',
    setup: 'Cable pulley behind you.',
    execution: 'Raise out to side pulling from behind for unique tension.'
  },
  { 
    name: 'Landmine Lateral Lift', 
    muscle: 'SHOULDERS', 
    subMuscle: 'Side Deltoid', 
    secondaryMuscles: 'ABS & CORE',
    setup: 'Sideways to landmine bar.',
    execution: 'Lift bar end out to side in an arc.'
  },
  { 
    name: 'Delt Destroyer Set Raise', 
    muscle: 'SHOULDERS', 
    subMuscle: 'Side Deltoid', 
    secondaryMuscles: 'None',
    setup: 'Multiple dumbbell weights.',
    execution: 'Perform dropset of lateral raises to absolute failure.'
  },
  { 
    name: 'Plate Lateral Raise', 
    muscle: 'SHOULDERS', 
    subMuscle: 'Side Deltoid', 
    secondaryMuscles: 'FOREARMS',
    setup: 'Hold small weight plates.',
    execution: 'Standard lateral raise with grip challenge.'
  },
  { 
    name: 'Single-Arm Machine Lateral Raise', 
    muscle: 'SHOULDERS', 
    subMuscle: 'Side Deltoid', 
    secondaryMuscles: 'ABS & CORE',
    setup: 'Use machine one arm at a time.',
    execution: 'Focus on pure side delt contraction.'
  },
  { 
    name: 'Cross-Body Cable Lateral Raise', 
    muscle: 'SHOULDERS', 
    subMuscle: 'Side Deltoid', 
    secondaryMuscles: 'None',
    setup: 'Cable pulley across body.',
    execution: 'Pull across and up for maximum muscle fibers.'
  },

  // SHOULDERS - Posterior Deltoid
  { 
    name: 'Reverse Pec Deck', 
    muscle: 'SHOULDERS', 
    subMuscle: 'Posterior Deltoid (Rear)', 
    secondaryMuscles: 'BACK',
    setup: 'Sit facing the machine pad.',
    execution: 'Pull arms back in wide arc. Squeeze rear delts.'
  },
  { 
    name: 'Bent-Over Rear Delt Raise', 
    muscle: 'SHOULDERS', 
    subMuscle: 'Posterior Deltoid (Rear)', 
    secondaryMuscles: 'BACK',
    setup: 'Hinge at hips, back flat.',
    execution: 'Raise weights out to sides focusing on rear shoulders.'
  },
  { 
    name: 'Face Pull', 
    muscle: 'SHOULDERS', 
    subMuscle: 'Posterior Deltoid (Rear)', 
    secondaryMuscles: 'BACK',
    setup: 'Rope handle on high pulley.',
    execution: 'Pull to face, pulling ends apart. Rotate wrists out.'
  },
  { 
    name: 'Rear Delt Cable Fly', 
    muscle: 'SHOULDERS', 
    subMuscle: 'Posterior Deltoid (Rear)', 
    secondaryMuscles: 'BACK',
    setup: 'Crossed handles on high pulleys.',
    execution: 'Pull handles back and out in an arc.'
  },
  { 
    name: 'Chest-Supported Reverse Fly', 
    muscle: 'SHOULDERS', 
    subMuscle: 'Posterior Deltoid (Rear)', 
    secondaryMuscles: 'BACK',
    setup: 'Face down on incline bench.',
    execution: 'Perform reverse fly without torso swinging.'
  },
  { 
    name: 'Prone Rear Delt Raise', 
    muscle: 'SHOULDERS', 
    subMuscle: 'Posterior Deltoid (Rear)', 
    secondaryMuscles: 'BACK',
    setup: 'Lie face down on flat bench.',
    execution: 'Raise weights out to side. Very strict isolation.'
  },
  { 
    name: 'Wide-Grip Row to Chest', 
    muscle: 'SHOULDERS', 
    subMuscle: 'Posterior Deltoid (Rear)', 
    secondaryMuscles: 'BACK, BICEPS',
    setup: 'Wide grip on seated row machine.',
    execution: 'Pull bar to upper chest with flared elbows.'
  },
  { 
    name: 'Rear Delt Barbell Row', 
    muscle: 'SHOULDERS', 
    subMuscle: 'Posterior Deltoid (Rear)', 
    secondaryMuscles: 'BACK, BICEPS',
    setup: 'Barbell row with wide grip.',
    execution: 'Row to upper chest for rear delt focus.'
  },
  { 
    name: 'High Cable Rear Delt Pull-Apart', 
    muscle: 'SHOULDERS', 
    subMuscle: 'Posterior Deltoid (Rear)', 
    secondaryMuscles: 'BACK',
    setup: 'Hold single cable handles at eye level.',
    execution: 'Pull straight arms apart and back.'
  },
  { 
    name: 'Single-Arm Reverse Cable Fly', 
    muscle: 'SHOULDERS', 
    subMuscle: 'Posterior Deltoid (Rear)', 
    secondaryMuscles: 'ABS & CORE',
    setup: 'Facing cable machine, single handle.',
    execution: 'Pull across and back with one arm.'
  },
  { 
    name: 'Incline Bench Rear Raise', 
    muscle: 'SHOULDERS', 
    subMuscle: 'Posterior Deltoid (Rear)', 
    secondaryMuscles: 'BACK',
    setup: 'Sit on incline bench leaning forward.',
    execution: 'Raise dumbbells to sides.'
  },
  { 
    name: 'TRX Rear Delt Fly', 
    muscle: 'SHOULDERS', 
    subMuscle: 'Posterior Deltoid (Rear)', 
    secondaryMuscles: 'ABS & CORE',
    setup: 'Hold TRX straps, lean back.',
    execution: 'Pull body up by opening arms into a fly.'
  },
  { 
    name: 'Resistance Band Face Pull', 
    muscle: 'SHOULDERS', 
    subMuscle: 'Posterior Deltoid (Rear)', 
    secondaryMuscles: 'BACK',
    setup: 'Band anchored at eye level.',
    execution: 'Pull to face against band resistance.'
  },
  { 
    name: 'Reverse Dumbbell Swing', 
    muscle: 'SHOULDERS', 
    subMuscle: 'Posterior Deltoid (Rear)', 
    secondaryMuscles: 'BACK',
    setup: 'Light dumbbells at sides.',
    execution: 'Explosive small swings focusing on rear delts.'
  },
  { 
    name: 'Cable High Pull', 
    muscle: 'SHOULDERS', 
    subMuscle: 'Posterior Deltoid (Rear)', 
    secondaryMuscles: 'BACK',
    setup: 'Low pulley rope handle.',
    execution: 'Pull rope to neck leading with elbows high.'
  },

  // BICEPS - Long Head
  { 
    name: 'Incline Dumbbell Curl', 
    muscle: 'BICEPS', 
    subMuscle: 'Long Head', 
    secondaryMuscles: 'FOREARMS',
    setup: 'Sit on incline bench, arms hanging straight.',
    execution: 'Curl weights up without moving upper arms.'
  },
  { 
    name: 'Hammer Curl', 
    muscle: 'BICEPS', 
    subMuscle: 'Long Head', 
    secondaryMuscles: 'FOREARMS',
    setup: 'Stand holding dumbbells neutral grip.',
    execution: 'Curl up maintaining neutral palm position.'
  },
  { 
    name: 'Cross-Body Hammer Curl', 
    muscle: 'BICEPS', 
    subMuscle: 'Long Head', 
    secondaryMuscles: 'FOREARMS',
    setup: 'Neutral grip dumbbells.',
    execution: 'Curl one dumbbell towards opposite shoulder.'
  },
  { 
    name: 'Dumbbell Alternating Curl', 
    muscle: 'BICEPS', 
    subMuscle: 'Long Head', 
    secondaryMuscles: 'FOREARMS',
    setup: 'Stand with dumbbells at sides.',
    execution: 'Curl and rotate wrist so palm faces up at top.'
  },
  { 
    name: 'Cable Rope Hammer Curl', 
    muscle: 'BICEPS', 
    subMuscle: 'Long Head', 
    secondaryMuscles: 'FOREARMS',
    setup: 'Rope on low pulley.',
    execution: 'Curl rope up and pull ends apart at peak.'
  },
  { 
    name: 'Reverse-Grip Curl', 
    muscle: 'BICEPS', 
    subMuscle: 'Long Head', 
    secondaryMuscles: 'FOREARMS',
    setup: 'Barbell or EZ-bar with overhand grip.',
    execution: 'Curl weight up focusing on top of arm.'
  },
  { 
    name: 'Bayesian Cable Curl', 
    muscle: 'BICEPS', 
    subMuscle: 'Long Head', 
    secondaryMuscles: 'None',
    setup: 'Facing away from low pulley, arm back.',
    execution: 'Curl handle forward from a stretched position.'
  },
  { 
    name: 'Long-Head Focus Dumbbell Curl', 
    muscle: 'BICEPS', 
    subMuscle: 'Long Head', 
    secondaryMuscles: 'None',
    setup: 'Standard curl setup.',
    execution: 'Keep elbows slightly behind torso during curl.'
  },
  { 
    name: 'Behind-the-Back Cable Curl', 
    muscle: 'BICEPS', 
    subMuscle: 'Long Head', 
    secondaryMuscles: 'None',
    setup: 'Stand facing away from low cable.',
    execution: 'Curl forward from extreme bottom stretch.'
  },
  { 
    name: 'Drag Curl', 
    muscle: 'BICEPS', 
    subMuscle: 'Long Head', 
    secondaryMuscles: 'SHOULDERS',
    setup: 'Hold barbell at front of thighs.',
    execution: 'Pull elbows back while "dragging" bar up torso.'
  },
  { 
    name: 'Dumbbell Supinating Curl', 
    muscle: 'BICEPS', 
    subMuscle: 'Long Head', 
    secondaryMuscles: 'FOREARMS',
    setup: 'Start neutral grip.',
    execution: 'Rotate palm up as you lift for max contraction.'
  },
  { 
    name: 'Single-Arm Cable Curl', 
    muscle: 'BICEPS', 
    subMuscle: 'Long Head', 
    secondaryMuscles: 'None',
    setup: 'Single low pulley handle.',
    execution: 'Focus on pure bicep isolate one arm at a time.'
  },
  { 
    name: 'Cross-Chest Cable Curl', 
    muscle: 'BICEPS', 
    subMuscle: 'Long Head', 
    secondaryMuscles: 'None',
    setup: 'Low pulley, single handle.',
    execution: 'Curl handle across chest towards opposite shoulder.'
  },
  { 
    name: 'Concentration Hammer Curl', 
    muscle: 'BICEPS', 
    subMuscle: 'Long Head', 
    secondaryMuscles: 'FOREARMS',
    setup: 'Sit on bench, arm braced against inner thigh.',
    execution: 'Hammer curl with very strict form.'
  },
  { 
    name: 'Machine Hammer Curl', 
    muscle: 'BICEPS', 
    subMuscle: 'Long Head', 
    secondaryMuscles: 'FOREARMS',
    setup: 'Hammer grip bicep machine.',
    execution: 'Curl handles against machine resistance.'
  },

  // BICEPS - Short Head
  { 
    name: 'Preacher Curl', 
    muscle: 'BICEPS', 
    subMuscle: 'Short Head', 
    secondaryMuscles: 'FOREARMS',
    setup: 'Arms firmly on preacher bench pad.',
    execution: 'Curl bar up from bottom stretch to full peak.'
  },
  { 
    name: 'Spider Curl', 
    muscle: 'BICEPS', 
    subMuscle: 'Short Head', 
    secondaryMuscles: 'None',
    setup: 'Face down on incline bench, arms hanging.',
    execution: 'Curl weights up. Intense peak contraction.'
  },
  { 
    name: 'Cable Preacher Curl', 
    muscle: 'BICEPS', 
    subMuscle: 'Short Head', 
    secondaryMuscles: 'FOREARMS',
    setup: 'Preacher bench in front of low pulley.',
    execution: 'Curl cable for constant tension throughout.'
  },
  { 
    name: 'Close-Grip Barbell Curl', 
    muscle: 'BICEPS', 
    subMuscle: 'Short Head', 
    secondaryMuscles: 'None',
    setup: 'Hands inside shoulder-width on bar.',
    execution: 'Curl focusing on inner bicep squeeze.'
  },
  { 
    name: 'Dumbbell Curl (Elbows Forward)', 
    muscle: 'BICEPS', 
    subMuscle: 'Short Head', 
    secondaryMuscles: 'None',
    setup: 'Standard curl position.',
    execution: 'Let elbows drift forward slightly as you lift.'
  },
  { 
    name: 'Machine Curl', 
    muscle: 'BICEPS', 
    subMuscle: 'Short Head', 
    secondaryMuscles: 'None',
    setup: 'Standard bicep curl machine.',
    execution: 'Isolate biceps using machine fixed path.'
  },
  { 
    name: 'High-Cable Curl', 
    muscle: 'BICEPS', 
    subMuscle: 'Short Head', 
    secondaryMuscles: 'SHOULDERS',
    setup: 'Standing between high cable handles.',
    execution: 'Curl handles towards ears (front double bi pose).'
  },
  { 
    name: 'EZ-Bar Curl', 
    muscle: 'BICEPS', 
    subMuscle: 'Short Head', 
    secondaryMuscles: 'FOREARMS',
    setup: 'Shoulder-width grip on EZ-bar.',
    execution: 'Curl up keeping elbows pinned to sides.'
  },
  { 
    name: 'Standing Cable Curl', 
    muscle: 'BICEPS', 
    subMuscle: 'Short Head', 
    secondaryMuscles: 'FOREARMS',
    setup: 'Facing low pulley bar.',
    execution: 'Curl bar up. Cable provides steady resistance.'
  },
  { 
    name: 'Double Dumbbell Curl', 
    muscle: 'BICEPS', 
    subMuscle: 'Short Head', 
    secondaryMuscles: 'ABS & CORE',
    setup: 'Dumbbells at sides.',
    execution: 'Curl both at the same time for core challenge.'
  },
  { 
    name: 'Zottman Curl', 
    muscle: 'BICEPS', 
    subMuscle: 'Short Head', 
    secondaryMuscles: 'FOREARMS',
    setup: 'Dumbbells neutral or supinated.',
    execution: 'Curl up palm-up, rotate to palm-down at top, lower slowly.'
  },
  { 
    name: 'Inner-Grip Curl', 
    muscle: 'BICEPS', 
    subMuscle: 'Short Head', 
    secondaryMuscles: 'None',
    setup: 'Narrow grip on EZ or barbell.',
    execution: 'Curl focusing on inner short head squeeze.'
  },
  { 
    name: 'Seated Curl', 
    muscle: 'BICEPS', 
    subMuscle: 'Short Head', 
    secondaryMuscles: 'None',
    setup: 'Sit on flat bench.',
    execution: 'Isolate biceps by removing leg drive.'
  },
  { 
    name: 'Wrist-Supinated Curl', 
    muscle: 'BICEPS', 
    subMuscle: 'Short Head', 
    secondaryMuscles: 'FOREARMS',
    setup: 'Dumbbell curl.',
    execution: 'Aggressively twist wrist out at the top.'
  },
  { 
    name: 'Lying Cable Curl', 
    muscle: 'BICEPS', 
    subMuscle: 'Short Head', 
    secondaryMuscles: 'None',
    setup: 'Lie on floor facing low pulley.',
    execution: 'Curl bar towards forehead.'
  },

  // TRICEPS - Long Head
  { 
    name: 'Overhead Dumbbell Extension', 
    muscle: 'TRICEPS', 
    subMuscle: 'Long Head', 
    secondaryMuscles: 'SHOULDERS',
    setup: 'Hold one dumbbell with both hands overhead.',
    execution: 'Lower weight behind head. Press back to extension.'
  },
  { 
    name: 'Cable Overhead Extension', 
    muscle: 'TRICEPS', 
    subMuscle: 'Long Head', 
    secondaryMuscles: 'SHOULDERS',
    setup: 'Facing away from high pulley rope.',
    execution: 'Lower weight behind you. Press up to lockout.'
  },
  { 
    name: 'Skull Crushers', 
    muscle: 'TRICEPS', 
    subMuscle: 'Long Head', 
    secondaryMuscles: 'SHOULDERS',
    setup: 'Lie on flat bench, bar above chest.',
    execution: 'Lower bar to forehead. Press back up using triceps.'
  },
  { 
    name: 'Incline Skull Crushers', 
    muscle: 'TRICEPS', 
    subMuscle: 'Long Head', 
    secondaryMuscles: 'SHOULDERS',
    setup: 'Skull crushers on incline bench.',
    execution: 'Greater stretch on the long head at the bottom.'
  },
  { 
    name: 'Dumbbell Kickback', 
    muscle: 'TRICEPS', 
    subMuscle: 'Long Head', 
    secondaryMuscles: 'SHOULDERS',
    setup: 'Hinge forward, upper arm parallel to floor.',
    execution: 'Straighten arm back. Squeeze tricep hard.'
  },
  { 
    name: 'Rope Overhead Extension', 
    muscle: 'TRICEPS', 
    subMuscle: 'Long Head', 
    secondaryMuscles: 'SHOULDERS, FOREARMS',
    setup: 'High pulley rope handle.',
    execution: 'Extend rope overhead and pull ends apart at top.'
  },
  { 
    name: 'Machine Overhead Extension', 
    muscle: 'TRICEPS', 
    subMuscle: 'Long Head', 
    secondaryMuscles: 'None',
    setup: 'Sit in tricep machine.',
    execution: 'Press weight overhead. Stable isolation.'
  },
  { 
    name: 'Landmine French Press', 
    muscle: 'TRICEPS', 
    subMuscle: 'Long Head', 
    secondaryMuscles: 'SHOULDERS, ABS & CORE',
    setup: 'Lie on floor facing landmine end.',
    execution: 'Lower bar to head. Press back to extension.'
  },
  { 
    name: 'Single-Arm Overhead Extension', 
    muscle: 'TRICEPS', 
    subMuscle: 'Long Head', 
    secondaryMuscles: 'ABS & CORE',
    setup: 'Single dumbbell or cable overhead.',
    execution: 'Extend arm straight up. Ensures balanced development.'
  },
  { 
    name: 'Barbell French Press', 
    muscle: 'TRICEPS', 
    subMuscle: 'Long Head', 
    secondaryMuscles: 'SHOULDERS',
    setup: 'Barbell or EZ-bar overhead.',
    execution: 'Lower and press back to full extension.'
  },

  // TRICEPS - Lateral & Medial
  { 
    name: 'Tricep Pushdown (Rope)', 
    muscle: 'TRICEPS', 
    subMuscle: 'Lateral & Medial Heads', 
    secondaryMuscles: 'FOREARMS',
    setup: 'High pulley rope handle.',
    execution: 'Push down and pull ends apart at the bottom.'
  },
  { 
    name: 'Tricep Pushdown (Bar)', 
    muscle: 'TRICEPS', 
    subMuscle: 'Lateral & Medial Heads', 
    secondaryMuscles: 'FOREARMS',
    setup: 'Straight or V-bar on high pulley.',
    execution: 'Push bar down to lockout. Squeeze triceps.'
  },
  { 
    name: 'Reverse Grip Pushdown', 
    muscle: 'TRICEPS', 
    subMuscle: 'Lateral & Medial Heads', 
    secondaryMuscles: 'FOREARMS',
    setup: 'Underhand grip on high pulley bar.',
    execution: 'Push down focusing on inner tricep head.'
  },
  { 
    name: 'Cable Kickback (Triceps)', 
    muscle: 'TRICEPS', 
    subMuscle: 'Lateral & Medial Heads', 
    secondaryMuscles: 'SHOULDERS',
    setup: 'Single cable handle, hinge at hips.',
    execution: 'Kick back against constant cable tension.'
  },
  { 
    name: 'Machine Tricep Extension', 
    muscle: 'TRICEPS', 
    subMuscle: 'Lateral & Medial Heads', 
    secondaryMuscles: 'None',
    setup: 'Sit in extension machine.',
    execution: 'Push handles down to lockout.'
  },
  { 
    name: 'Close-Grip Bench Press', 
    muscle: 'TRICEPS', 
    subMuscle: 'Lateral & Medial Heads', 
    secondaryMuscles: 'CHEST, SHOULDERS',
    setup: 'Flat bench, hands inside shoulder-width.',
    execution: 'Lower bar to chest keeping elbows tucked. Press up.'
  },
  { 
    name: 'Diamond Push-Ups', 
    muscle: 'TRICEPS', 
    subMuscle: 'Lateral & Medial Heads', 
    secondaryMuscles: 'CHEST, SHOULDERS, ABS & CORE',
    setup: 'Hands together in diamond shape on floor.',
    execution: 'Lower chest to hands. Push back to extension.'
  },
  { 
    name: 'Smith Close-Grip Press', 
    muscle: 'TRICEPS', 
    subMuscle: 'Lateral & Medial Heads', 
    secondaryMuscles: 'CHEST',
    setup: 'Bench in Smith machine, close grip.',
    execution: 'Press bar up. Constant tension on triceps.'
  },
  { 
    name: 'Dips', 
    muscle: 'TRICEPS', 
    subMuscle: 'Lateral & Medial Heads', 
    secondaryMuscles: 'CHEST, SHOULDERS',
    setup: 'Torso upright on parallel bars.',
    execution: 'Lower until elbows are 90 degrees. Press back up.'
  },
  { 
    name: 'Weighted Dips', 
    muscle: 'TRICEPS', 
    subMuscle: 'Lateral & Medial Heads', 
    secondaryMuscles: 'CHEST, SHOULDERS',
    setup: 'Dips with weight added.',
    execution: 'Full extension focus with added load.'
  },
  { 
    name: 'Underhand Rope Pushdown', 
    muscle: 'TRICEPS', 
    subMuscle: 'Lateral & Medial Heads', 
    secondaryMuscles: 'FOREARMS',
    setup: 'Underhand grip on rope.',
    execution: 'Push down focusing on medial head squeeze.'
  },
  { 
    name: 'Cable Straight-Bar Extension', 
    muscle: 'TRICEPS', 
    subMuscle: 'Lateral & Medial Heads', 
    secondaryMuscles: 'FOREARMS',
    setup: 'Standard straight bar pushdown.',
    execution: 'Heavy lockout focus for mass.'
  },
  { 
    name: 'Tricep Bench Dips', 
    muscle: 'TRICEPS', 
    subMuscle: 'Lateral & Medial Heads', 
    secondaryMuscles: 'CHEST, SHOULDERS',
    setup: 'Hands on bench behind you.',
    execution: 'Lower hips towards floor. Press back up.'
  },
  { 
    name: 'Dumbbell Neutral Kickback', 
    muscle: 'TRICEPS', 
    subMuscle: 'Lateral & Medial Heads', 
    secondaryMuscles: 'SHOULDERS',
    setup: 'Neutral (hammer) grip kickback.',
    execution: 'Focus on lateral head contraction.'
  },
  { 
    name: 'Reverse Grip Close Bench', 
    muscle: 'TRICEPS', 
    subMuscle: 'Lateral & Medial Heads', 
    secondaryMuscles: 'CHEST, SHOULDERS',
    setup: 'Underhand close grip bench press.',
    execution: 'Press up for multi-head tricep activation.'
  },
  { 
    name: 'Cable Wrist-Out Pushdown', 
    muscle: 'TRICEPS', 
    subMuscle: 'Lateral & Medial Heads', 
    secondaryMuscles: 'FOREARMS',
    setup: 'Standard pushdown.',
    execution: 'Rotate wrists out at bottom for peak peak.'
  },
  { 
    name: 'One-Arm Straight Bar Pushdown', 
    muscle: 'TRICEPS', 
    subMuscle: 'Lateral & Medial Heads', 
    secondaryMuscles: 'None',
    setup: 'Single handle pushdown.',
    execution: 'Unilateral focus for balanced triceps.'
  },
  { 
    name: 'Single-Dumbbell Neutral Extension', 
    muscle: 'TRICEPS', 
    subMuscle: 'Lateral & Medial Heads', 
    secondaryMuscles: 'SHOULDERS',
    setup: 'Overhead hold with one dumbbell.',
    execution: 'Extend arms fully for mass.'
  },
  { 
    name: 'Tricep Hold', 
    muscle: 'TRICEPS', 
    subMuscle: 'Lateral & Medial Heads', 
    secondaryMuscles: 'FOREARMS',
    setup: 'End of set.',
    execution: 'Hold full contraction for time.'
  },
  { 
    name: 'Cable Cross-Body Extension', 
    muscle: 'TRICEPS', 
    subMuscle: 'Lateral & Medial Heads', 
    secondaryMuscles: 'None',
    setup: 'High pulley across body.',
    execution: 'Extend arm down and across.'
  },

  // FOREARMS - Flexors & Extensors
  { 
    name: 'Wrist Curl', 
    muscle: 'FOREARMS', 
    subMuscle: 'Flexors & Extensors', 
    secondaryMuscles: 'None',
    setup: 'Forearms on bench, palms up.',
    execution: 'Curl weight up with wrists. Lower slowly.'
  },
  { 
    name: 'Reverse Wrist Curl', 
    muscle: 'FOREARMS', 
    subMuscle: 'Flexors & Extensors', 
    secondaryMuscles: 'BICEPS',
    setup: 'Forearms on bench, palms down.',
    execution: 'Extend wrists up towards ceiling.'
  },
  { 
    name: 'Cable Wrist Flexion', 
    muscle: 'FOREARMS', 
    subMuscle: 'Flexors & Extensors', 
    secondaryMuscles: 'None',
    setup: 'Low pulley, forearm supported.',
    execution: 'Perform curl against cable resistance.'
  },
  { 
    name: 'Dumbbell Wrist Twist', 
    muscle: 'FOREARMS', 
    subMuscle: 'Flexors & Extensors', 
    secondaryMuscles: 'None',
    setup: 'Hold dumbbell in one hand.',
    execution: 'Rotate wrist through full range.'
  },
  { 
    name: 'Plate Pinch', 
    muscle: 'FOREARMS', 
    subMuscle: 'Flexors & Extensors', 
    secondaryMuscles: 'None',
    setup: 'Pinch weight plates between fingers.',
    execution: 'Hold for as long as possible.'
  },
  { 
    name: 'Bar Hang', 
    muscle: 'FOREARMS', 
    subMuscle: 'Flexors & Extensors', 
    secondaryMuscles: 'BACK, SHOULDERS, ABS & CORE',
    setup: 'Grip pull-up bar.',
    execution: 'Hang for maximum time.'
  },
  { 
    name: 'Flexor Bar Roll', 
    muscle: 'FOREARMS', 
    subMuscle: 'Flexors & Extensors', 
    secondaryMuscles: 'None',
    setup: 'Use wrist roller.',
    execution: 'Roll weight up and down with wrists.'
  },
  { 
    name: 'Farmer Carry', 
    muscle: 'FOREARMS', 
    subMuscle: 'Flexors & Extensors', 
    secondaryMuscles: 'BACK, ABS & CORE, LEGS',
    setup: 'Heavy weights at sides.',
    execution: 'Walk with good posture.'
  },
  { 
    name: 'Rope Hold', 
    muscle: 'FOREARMS', 
    subMuscle: 'Flexors & Extensors', 
    secondaryMuscles: 'None',
    setup: 'Grip thick rope.',
    execution: 'Hold against weight for time.'
  },
  { 
    name: 'Cable Finger Curl', 
    muscle: 'FOREARMS', 
    subMuscle: 'Flexors & Extensors', 
    secondaryMuscles: 'None',
    setup: 'Single cable handle.',
    execution: 'Curl using fingers only.'
  },
  { 
    name: 'Reverse Curl', 
    muscle: 'FOREARMS', 
    subMuscle: 'Brachioradialis', 
    secondaryMuscles: 'BICEPS',
    setup: 'Overhand grip on bar.',
    execution: 'Curl weight focusing on top of forearm.'
  },
  { 
    name: 'Wrist Extension', 
    muscle: 'FOREARMS', 
    subMuscle: 'Flexors & Extensors', 
    secondaryMuscles: 'BICEPS',
    setup: 'Dumbbells, palms down.',
    execution: 'Lift back of hands up.'
  },
  { 
    name: 'Cable Reverse Wrist Curl', 
    muscle: 'FOREARMS', 
    subMuscle: 'Flexors & Extensors', 
    secondaryMuscles: 'BICEPS',
    setup: 'Low pulley, palm down.',
    execution: 'Extend wrist against tension.'
  },
  { 
    name: 'Barbell Reverse Wrist Raise', 
    muscle: 'FOREARMS', 
    subMuscle: 'Flexors & Extensors', 
    secondaryMuscles: 'BICEPS',
    setup: 'Heavy barbell, overhand grip.',
    execution: 'Extend wrists upward.'
  },
  { 
    name: 'Resistance Band Wrist Extension', 
    muscle: 'FOREARMS', 
    subMuscle: 'Flexors & Extensors', 
    secondaryMuscles: 'BICEPS',
    setup: 'Anchor band under feet.',
    execution: 'Extend wrists against band.'
  },
  { 
    name: 'Plate Wrist Extension', 
    muscle: 'FOREARMS', 
    subMuscle: 'Flexors & Extensors', 
    secondaryMuscles: 'BICEPS',
    setup: 'Hold small plate palm down.',
    execution: 'Lift plate by extending wrist.'
  },
  { 
    name: 'Dumbbell Reverse Twist', 
    muscle: 'FOREARMS', 
    subMuscle: 'Flexors & Extensors', 
    secondaryMuscles: 'None',
    setup: 'Hold dumbbell vertically.',
    execution: 'Rotate side to side.'
  },
  { 
    name: 'Barbell Hold', 
    muscle: 'FOREARMS', 
    subMuscle: 'Flexors & Extensors', 
    secondaryMuscles: 'BACK',
    setup: 'Heavy bar in rack.',
    execution: 'Hold for maximum time.'
  },
  { 
    name: 'Finger Extension Bands', 
    muscle: 'FOREARMS', 
    subMuscle: 'Flexors & Extensors', 
    secondaryMuscles: 'None',
    setup: 'Bands around fingers.',
    execution: 'Open hand against band.'
  },
  { 
    name: 'Cable Knuckle-Up Extension', 
    muscle: 'FOREARMS', 
    subMuscle: 'Flexors & Extensors', 
    secondaryMuscles: 'BICEPS',
    setup: 'Low pulley handle.',
    execution: 'Drive knuckles to ceiling.'
  },
  { 
    name: 'Hammer Curl (Forearm Focus)', 
    muscle: 'FOREARMS', 
    subMuscle: 'Brachioradialis', 
    secondaryMuscles: 'BICEPS',
    setup: 'Standard hammer curl setup.',
    execution: 'Focus on top of forearm squeeze.'
  },
  { 
    name: 'Fat Grip Curl', 
    muscle: 'FOREARMS', 
    subMuscle: 'Brachioradialis', 
    secondaryMuscles: 'BICEPS',
    setup: 'Fat grips on bar.',
    execution: 'Curl with thick grip for max forearm load.'
  },

  // LEGS - Quads
  { 
    name: 'Back Squat', 
    muscle: 'LEGS', 
    subMuscle: 'Quads', 
    secondaryMuscles: 'BACK, ABS & CORE',
    setup: 'Bar on traps, feet shoulder-width.',
    execution: 'Squat deep, keep back flat. Drive through heels.'
  },
  { 
    name: 'Front Squat', 
    muscle: 'LEGS', 
    subMuscle: 'Quads', 
    secondaryMuscles: 'BACK, ABS & CORE',
    setup: 'Bar across front of shoulders.',
    execution: 'Squat while keeping torso upright.'
  },
  { 
    name: 'Leg Press', 
    muscle: 'LEGS', 
    subMuscle: 'Quads', 
    secondaryMuscles: 'None',
    setup: 'Feet shoulder-width on platform.',
    execution: 'Extend legs without locking knees. Control back.'
  },
  { 
    name: 'Hack Squat', 
    muscle: 'LEGS', 
    subMuscle: 'Quads', 
    secondaryMuscles: 'None',
    setup: 'Stand in hack machine, shoulders under pads.',
    execution: 'Squat down following machine path. Press up.'
  },
  { 
    name: 'Bulgarian Split Squat', 
    muscle: 'LEGS', 
    subMuscle: 'Quads', 
    secondaryMuscles: 'ABS & CORE',
    setup: 'One foot forward, one back on bench.',
    execution: 'Squat down on front leg. Keep torso stable.'
  },
  { 
    name: 'Walking Lunge', 
    muscle: 'LEGS', 
    subMuscle: 'Quads', 
    secondaryMuscles: 'ABS & CORE',
    setup: 'Dumbbells at sides.',
    execution: 'Take large steps into lunges. Drive up.'
  },
  { 
    name: 'Step-Ups', 
    muscle: 'LEGS', 
    subMuscle: 'Quads', 
    secondaryMuscles: 'None',
    setup: 'Stand before sturdy box.',
    execution: 'Step up and drive knee high. Control down.'
  },
  { 
    name: 'Sissy Squat', 
    muscle: 'LEGS', 
    subMuscle: 'Quads', 
    secondaryMuscles: 'ABS & CORE',
    setup: 'Stand in sissy squat stand.',
    execution: 'Lean back while bending knees forward.'
  },
  { 
    name: 'Leg Extension', 
    muscle: 'LEGS', 
    subMuscle: 'Quads', 
    secondaryMuscles: 'None',
    setup: 'Sit in extension machine.',
    execution: 'Extend legs fully. Squeeze quads at top.'
  },
  { 
    name: 'Goblet Squat', 
    muscle: 'LEGS', 
    subMuscle: 'Quads', 
    secondaryMuscles: 'BACK, ABS & CORE',
    setup: 'Hold dumbbell vertically at chest.',
    execution: 'Squat deep keeping chest high.'
  },
  { 
    name: 'Zombie Squat', 
    muscle: 'LEGS', 
    subMuscle: 'Quads', 
    secondaryMuscles: 'BACK, ABS & CORE',
    setup: 'Arms out front, bar on shoulders.',
    execution: 'Squat without hands for core challenge.'
  },
  { 
    name: 'Smith Machine Squat', 
    muscle: 'LEGS', 
    subMuscle: 'Quads', 
    secondaryMuscles: 'None',
    setup: 'Bar in Smith machine.',
    execution: 'Squat following the vertical path.'
  },
  { 
    name: 'High-Bar Squat', 
    muscle: 'LEGS', 
    subMuscle: 'Quads', 
    secondaryMuscles: 'BACK',
    setup: 'Bar high on traps.',
    execution: 'Upright squat for max quad focus.'
  },
  { 
    name: 'Pistol Squat', 
    muscle: 'LEGS', 
    subMuscle: 'Quads', 
    secondaryMuscles: 'ABS & CORE',
    setup: 'Balance on one leg.',
    execution: 'Perform full squat on single leg.'
  },
  { 
    name: 'Belt Squat', 
    muscle: 'LEGS', 
    subMuscle: 'Quads', 
    secondaryMuscles: 'None',
    setup: 'Weight loaded through belt at hips.',
    execution: 'Squat without spinal load.'
  },
  { 
    name: 'Narrow Stance Leg Press', 
    muscle: 'LEGS', 
    subMuscle: 'Quads', 
    secondaryMuscles: 'None',
    setup: 'Feet close together on press.',
    execution: 'Extend legs for outer quad focus.'
  },
  { 
    name: 'Split Squat', 
    muscle: 'LEGS', 
    subMuscle: 'Quads', 
    secondaryMuscles: 'None',
    setup: 'Static lunge stance.',
    execution: 'Lower and rise vertically.'
  },
  { 
    name: 'Landmine Squat', 
    muscle: 'LEGS', 
    subMuscle: 'Quads', 
    secondaryMuscles: 'BACK, ABS & CORE',
    setup: 'Hold landmine end at chest.',
    execution: 'Squat in an arc following bar path.'
  },
  { 
    name: 'Heel-Elevated Squat', 
    muscle: 'LEGS', 
    subMuscle: 'Quads', 
    secondaryMuscles: 'None',
    setup: 'Heels on plates or wedge.',
    execution: 'Squat upright for quad isolation.'
  },
  { 
    name: 'Sled Push', 
    muscle: 'LEGS', 
    subMuscle: 'Quads', 
    secondaryMuscles: 'CARDIO',
    setup: 'Load sled with weight.',
    execution: 'Drive sled forward with legs.'
  },

  // LEGS - Hamstrings & Glutes
  { 
    name: 'Romanian Deadlift', 
    muscle: 'LEGS', 
    subMuscle: 'Hamstrings & Glutes', 
    secondaryMuscles: 'BACK, FOREARMS',
    setup: 'Bar in hands, slight knee bend.',
    execution: 'Hinge back, lower to mid-shin. Pull up.'
  },
  { 
    name: 'Lying Leg Curl', 
    muscle: 'LEGS', 
    subMuscle: 'Hamstrings & Glutes', 
    secondaryMuscles: 'None',
    setup: 'Lie face down in machine.',
    execution: 'Curl heels to glutes. Squeeze at top.'
  },
  { 
    name: 'Seated Leg Curl', 
    muscle: 'LEGS', 
    subMuscle: 'Hamstrings & Glutes', 
    secondaryMuscles: 'None',
    setup: 'Sit in machine, secure pads.',
    execution: 'Curl handles down and back.'
  },
  { 
    name: 'Nordic Curl', 
    muscle: 'LEGS', 
    subMuscle: 'Hamstrings & Glutes', 
    secondaryMuscles: 'ABS & CORE',
    setup: 'Anchor ankles firmly.',
    execution: 'Lower torso slowly towards floor. Push back.'
  },
  { 
    name: 'Glute-Ham Raise', 
    muscle: 'LEGS', 
    subMuscle: 'Hamstrings & Glutes', 
    secondaryMuscles: 'BACK',
    setup: 'GHD machine setup.',
    execution: 'Lower and rise by flexing hamstrings.'
  },
  { 
    name: 'Single-Leg RDL', 
    muscle: 'LEGS', 
    subMuscle: 'Hamstrings & Glutes', 
    secondaryMuscles: 'ABS & CORE',
    setup: 'Balance on one leg, weight in opposite hand.',
    execution: 'Hinge forward maintaining flat back.'
  },
  { 
    name: 'Good Morning', 
    muscle: 'LEGS', 
    subMuscle: 'Hamstrings & Glutes', 
    secondaryMuscles: 'BACK',
    setup: 'Bar on traps, hinge at hips.',
    execution: 'Lower torso until parallel. Return to upright.'
  },
  { 
    name: 'Cable Leg Curl', 
    muscle: 'LEGS', 
    subMuscle: 'Hamstrings & Glutes', 
    secondaryMuscles: 'None',
    setup: 'Ankle strap on low pulley.',
    execution: 'Perform curl against cable resistance.'
  },
  { 
    name: 'Stability Ball Curl', 
    muscle: 'LEGS', 
    subMuscle: 'Hamstrings & Glutes', 
    secondaryMuscles: 'ABS & CORE',
    setup: 'Heels on stability ball, bridge up.',
    execution: 'Curl ball towards glutes.'
  },
  { 
    name: 'Machine Single-Leg Curl', 
    muscle: 'LEGS', 
    subMuscle: 'Hamstrings & Glutes', 
    secondaryMuscles: 'None',
    setup: 'Lying or seated machine, one leg.',
    execution: 'Isolate each hamstring individually.'
  },
  { 
    name: 'Kettlebell RDL', 
    muscle: 'LEGS', 
    subMuscle: 'Hamstrings & Glutes', 
    secondaryMuscles: 'BACK, FOREARMS',
    setup: 'KB in hands, hinge motion.',
    execution: 'Hinge back for deep stretch. Stand tall.'
  },
  { 
    name: 'Dumbbell RDL', 
    muscle: 'LEGS', 
    subMuscle: 'Hamstrings & Glutes', 
    secondaryMuscles: 'BACK, FOREARMS',
    setup: 'Dumbbells at front of legs.',
    execution: 'Perform hinge focusing on hamstring sweep.'
  },
  { 
    name: 'Hip Hinge', 
    muscle: 'LEGS', 
    subMuscle: 'Hamstrings & Glutes', 
    secondaryMuscles: 'None',
    setup: 'Hands on hips, feet parallel.',
    execution: 'Push hips back while keeping back flat.'
  },
  { 
    name: 'Isometric Hamstring Hold', 
    muscle: 'LEGS', 
    subMuscle: 'Hamstrings & Glutes', 
    secondaryMuscles: 'None',
    setup: 'Peak contracted position.',
    execution: 'Hold maximal squeeze for time.'
  },
  { 
    name: 'Slider Leg Curl', 
    muscle: 'LEGS', 
    subMuscle: 'Hamstrings & Glutes', 
    secondaryMuscles: 'ABS & CORE',
    setup: 'Heels on floor sliders.',
    execution: 'Slide in and out maintaining bridge.'
  },
  { 
    name: 'Reverse Hyperextension', 
    muscle: 'LEGS', 
    subMuscle: 'Hamstrings & Glutes', 
    secondaryMuscles: 'BACK',
    setup: 'Reverse hyper machine.',
    execution: 'Swing legs up behind using posterior chain.'
  },
  { 
    name: 'Swiss Ball Curl Rollouts', 
    muscle: 'LEGS', 
    subMuscle: 'Hamstrings & Glutes', 
    secondaryMuscles: 'ABS & CORE',
    setup: 'Standard ball curl setup.',
    execution: 'Slow eccentrics for muscle damage.'
  },
  { 
    name: 'Kneeling Leg Curl', 
    muscle: 'LEGS', 
    subMuscle: 'Hamstrings & Glutes', 
    secondaryMuscles: 'None',
    setup: 'Cable or machine kneeling.',
    execution: 'Curl one leg at a time.'
  },
  { 
    name: 'Band Leg Curl', 
    muscle: 'LEGS', 
    subMuscle: 'Hamstrings & Glutes', 
    secondaryMuscles: 'None',
    setup: 'Anchor band to pole.',
    execution: 'Curl against band tension.'
  },
  { 
    name: 'Prone Ham Curl Machine', 
    muscle: 'LEGS', 
    subMuscle: 'Hamstrings & Glutes', 
    secondaryMuscles: 'None',
    setup: 'Lying leg curl position.',
    execution: 'Squeeze hamstrings forcefully.'
  },
  { 
    name: 'Barbell Hip Thrust', 
    muscle: 'LEGS', 
    subMuscle: 'Hamstrings & Glutes', 
    secondaryMuscles: 'ABS & CORE',
    setup: 'Shoulders on bench, bar over hips.',
    execution: 'Drive hips to ceiling. Squeeze glutes.'
  },
  { 
    name: 'Glute Bridge', 
    muscle: 'LEGS', 
    subMuscle: 'Hamstrings & Glutes', 
    secondaryMuscles: 'None',
    setup: 'Lie on floor, knees bent.',
    execution: 'Thrust hips up and squeeze.'
  },
  { 
    name: 'Cable Kickback (Glutes)', 
    muscle: 'LEGS', 
    subMuscle: 'Hamstrings & Glutes', 
    secondaryMuscles: 'None',
    setup: 'Ankle strap on low pulley.',
    execution: 'Kick leg back focusing on glute squeeze.'
  },
  { 
    name: 'Machine Glute Kickback', 
    muscle: 'LEGS', 
    subMuscle: 'Hamstrings & Glutes', 
    secondaryMuscles: 'None',
    setup: 'Glute machine position.',
    execution: 'Kick platform back with power.'
  },
  { 
    name: 'Lunges (Long Step)', 
    muscle: 'LEGS', 
    subMuscle: 'Hamstrings & Glutes', 
    secondaryMuscles: 'None',
    setup: 'Take wider steps than usual.',
    execution: 'Focus on glute stretch at bottom.'
  },
  { 
    name: 'Frog Pumps', 
    muscle: 'LEGS', 
    subMuscle: 'Hamstrings & Glutes', 
    secondaryMuscles: 'None',
    setup: 'Soles of feet together, knees out.',
    execution: 'Glute bridge in this position.'
  },
  { 
    name: 'Banded Lateral Walk', 
    muscle: 'LEGS', 
    subMuscle: 'Hamstrings & Glutes', 
    secondaryMuscles: 'None',
    setup: 'Band around ankles/thighs.',
    execution: 'Take side steps in quarter-squat.'
  },
  { 
    name: 'Barbell Glute Bridge', 
    muscle: 'LEGS', 
    subMuscle: 'Hamstrings & Glutes', 
    secondaryMuscles: 'None',
    setup: 'Weighted bridge on floor.',
    execution: 'Thrust up against added load.'
  },
  { 
    name: 'Smith Machine Hip Thrust', 
    muscle: 'LEGS', 
    subMuscle: 'Hamstrings & Glutes', 
    secondaryMuscles: 'None',
    setup: 'Fixed bar over hips.',
    execution: 'Focus on the stabilized thrust.'
  },
  { 
    name: 'Single-Leg Hip Thrust', 
    muscle: 'LEGS', 
    subMuscle: 'Hamstrings & Glutes', 
    secondaryMuscles: 'ABS & CORE',
    setup: 'One leg on floor, one in air.',
    execution: 'Thrust up on single supporting leg.'
  },
  { 
    name: 'Hip Abduction Machine', 
    muscle: 'LEGS', 
    subMuscle: 'Hamstrings & Glutes', 
    secondaryMuscles: 'None',
    setup: 'Outer thigh machine.',
    execution: 'Press legs apart against pads.'
  },
  { 
    name: 'Cable Abduction', 
    muscle: 'LEGS', 
    subMuscle: 'Hamstrings & Glutes', 
    secondaryMuscles: 'ABS & CORE',
    setup: 'Ankle strap, stand sideways.',
    execution: 'Lift leg out to side against cable.'
  },
  { 
    name: 'Kettlebell Swing', 
    muscle: 'LEGS', 
    subMuscle: 'Hamstrings & Glutes', 
    secondaryMuscles: 'BACK, ABS & CORE, SHOULDERS',
    setup: 'KB between feet, hinge stance.',
    execution: 'Explosive hip snap to swing KB up.'
  },
  { 
    name: 'Curtsy Lunge', 
    muscle: 'LEGS', 
    subMuscle: 'Hamstrings & Glutes', 
    secondaryMuscles: 'None',
    setup: 'Lunge with leg crossing behind.',
    execution: 'Targets glute medius sweep.'
  },
  { 
    name: 'Low Cable Pull-Through', 
    muscle: 'LEGS', 
    subMuscle: 'Hamstrings & Glutes', 
    secondaryMuscles: 'BACK',
    setup: 'Facing away from low pulley rope.',
    execution: 'Hinge and snap hips forward to stand.'
  },
  { 
    name: 'Reverse Lunge', 
    muscle: 'LEGS', 
    subMuscle: 'Hamstrings & Glutes', 
    secondaryMuscles: 'None',
    setup: 'Step backward into lunge.',
    execution: 'Drive up through front heel.'
  },
  { 
    name: 'Glute Hyperextension', 
    muscle: 'LEGS', 
    subMuscle: 'Hamstrings & Glutes', 
    secondaryMuscles: 'BACK',
    setup: 'Rounded upper back hyper.',
    execution: 'Squeeze glutes to lift torso.'
  },
  { 
    name: 'Sumo Deadlift', 
    muscle: 'LEGS', 
    subMuscle: 'Hamstrings & Glutes', 
    secondaryMuscles: 'BACK, FOREARMS',
    setup: 'Very wide stance, toes out.',
    execution: 'Pull bar up keeping chest high.'
  },

  // LEGS - Calves
  { 
    name: 'Standing Calf Raise', 
    muscle: 'LEGS', 
    subMuscle: 'Calves', 
    secondaryMuscles: 'None',
    setup: 'Heels off edge of platform.',
    execution: 'Press onto toes. Squeeze and stretch.'
  },
  { 
    name: 'Seated Calf Raise', 
    muscle: 'LEGS', 
    subMuscle: 'Calves', 
    secondaryMuscles: 'None',
    setup: 'Sit in machine, pads on thighs.',
    execution: 'Flex ankles to lift weight.'
  },
  { 
    name: 'Leg Press Calf Raise', 
    muscle: 'LEGS', 
    subMuscle: 'Calves', 
    secondaryMuscles: 'None',
    setup: 'Balls of feet on bottom of press.',
    execution: 'Extend ankles to move platform.'
  },
  { 
    name: 'Donkey Calf Raise', 
    muscle: 'LEGS', 
    subMuscle: 'Calves', 
    secondaryMuscles: 'None',
    setup: 'Hinge forward, partner on back.',
    execution: 'Full ankle range of motion.'
  },
  { 
    name: 'Smith Machine Calf Raise', 
    muscle: 'LEGS', 
    subMuscle: 'Calves', 
    secondaryMuscles: 'None',
    setup: 'Step on block in Smith machine.',
    execution: 'Stabilized calf raise focus.'
  },
  { 
    name: 'Single-Leg Calf Raise', 
    muscle: 'LEGS', 
    subMuscle: 'Calves', 
    secondaryMuscles: 'ABS & CORE',
    setup: 'One leg on platform, hold dumbbell.',
    execution: 'Full range extension on single leg.'
  },
  { 
    name: 'Toe Walk', 
    muscle: 'LEGS', 
    subMuscle: 'Calves', 
    secondaryMuscles: 'None',
    setup: 'Walking on toes only.',
    execution: 'Walk for time/distance.'
  },
  { 
    name: 'Jump Rope', 
    muscle: 'LEGS', 
    subMuscle: 'Calves', 
    secondaryMuscles: 'CARDIO, SHOULDERS',
    setup: 'Select rope length.',
    execution: 'Skip on balls of feet.'
  },
  { 
    name: 'Box Jumps', 
    muscle: 'LEGS', 
    subMuscle: 'Calves', 
    secondaryMuscles: 'Quads',
    setup: 'Stand before sturdy box.',
    execution: 'Explosive jump up and land soft.'
  },
  { 
    name: 'Explosive Toe Press', 
    muscle: 'LEGS', 
    subMuscle: 'Calves', 
    secondaryMuscles: 'None',
    setup: 'Leg press machine.',
    execution: 'Generate power through ankles.'
  },
  { 
    name: 'Tibialis Raise', 
    muscle: 'LEGS', 
    subMuscle: 'Calves', 
    secondaryMuscles: 'None',
    setup: 'Heels on floor, back against wall.',
    execution: 'Lift toes towards shins.'
  },
  { 
    name: 'Incline Calf Raise', 
    muscle: 'LEGS', 
    subMuscle: 'Calves', 
    secondaryMuscles: 'None',
    setup: 'Incline platform calf machine.',
    execution: 'Stretch and flex at the ankle.'
  },
  { 
    name: 'Barbell Calf Raise', 
    muscle: 'LEGS', 
    subMuscle: 'Calves', 
    secondaryMuscles: 'ABS & CORE',
    setup: 'Barbell on traps.',
    execution: 'Standing raises with heavy load.'
  },
  { 
    name: 'Cable Calf Raise', 
    muscle: 'LEGS', 
    subMuscle: 'Calves', 
    secondaryMuscles: 'ABS & CORE',
    setup: 'Ankle belt on low pulley.',
    execution: 'Extend ankles against cable.'
  },
  { 
    name: 'Hack Machine Calf Raise', 
    muscle: 'LEGS', 
    subMuscle: 'Calves', 
    secondaryMuscles: 'None',
    setup: 'Stand in hack squat machine.',
    execution: 'Calf raises with heavy machine load.'
  },

  // ABS & CORE - Rectus Abdominis
  { 
    name: 'Crunch', 
    muscle: 'ABS & CORE', 
    subMuscle: 'Rectus Abdominis', 
    secondaryMuscles: 'None',
    setup: 'Lie on back, knees bent.',
    execution: 'Lift upper back, curl ribs to pelvis.'
  },
  { 
    name: 'Sit-Up', 
    muscle: 'ABS & CORE', 
    subMuscle: 'Rectus Abdominis', 
    secondaryMuscles: 'None',
    setup: 'Lie on back, feet flat.',
    execution: 'Lift entire torso to knees.'
  },
  { 
    name: 'Hanging Leg Raise', 
    muscle: 'ABS & CORE', 
    subMuscle: 'Rectus Abdominis', 
    secondaryMuscles: 'FOREARMS',
    setup: 'Hang from pull-up bar.',
    execution: 'Raise straight legs parallel to floor.'
  },
  { 
    name: 'Cable Crunch', 
    muscle: 'ABS & CORE', 
    subMuscle: 'Rectus Abdominis', 
    secondaryMuscles: 'None',
    setup: 'Kneel with high pulley rope.',
    execution: 'Crunch down, elbows to knees.'
  },
  { 
    name: 'Weighted Decline Crunch', 
    muscle: 'ABS & CORE', 
    subMuscle: 'Rectus Abdominis', 
    secondaryMuscles: 'None',
    setup: 'Secure feet on decline bench, hold weight.',
    execution: 'Crunch up against resistance.'
  },
  { 
    name: 'Toes-to-Bar', 
    muscle: 'ABS & CORE', 
    subMuscle: 'Rectus Abdominis', 
    secondaryMuscles: 'BACK, FOREARMS',
    setup: 'Hang from pull-up bar.',
    execution: 'Raise toes to touch the bar.'
  },
  { 
    name: 'Reverse Crunch', 
    muscle: 'ABS & CORE', 
    subMuscle: 'Rectus Abdominis', 
    secondaryMuscles: 'None',
    setup: 'Lie on back, knees at 90 degrees.',
    execution: 'Curl hips to chest using lower abs.'
  },
  { 
    name: 'Jackknife Sit-Up', 
    muscle: 'ABS & CORE', 
    subMuscle: 'Rectus Abdominis', 
    secondaryMuscles: 'LEGS',
    setup: 'Lie flat, arms over head.',
    execution: 'Simultaneously lift torso and legs into V.'
  },
  { 
    name: 'Ab Wheel Rollout', 
    muscle: 'ABS & CORE', 
    subMuscle: 'Rectus Abdominis', 
    secondaryMuscles: 'BACK, SHOULDERS',
    setup: 'Kneel with ab wheel.',
    execution: 'Roll forward and pull back using abs.'
  },
  { 
    name: 'Machine Crunch', 
    muscle: 'ABS & CORE', 
    subMuscle: 'Rectus Abdominis', 
    secondaryMuscles: 'None',
    setup: 'Sit in crunch machine.',
    execution: 'Crunch forward against weights.'
  },
  { 
    name: 'Stability Ball Crunch', 
    muscle: 'ABS & CORE', 
    subMuscle: 'Rectus Abdominis', 
    secondaryMuscles: 'ABS & CORE',
    setup: 'Lower back on ball.',
    execution: 'Perform crunch. Stability focus.'
  },
  { 
    name: 'V-Ups', 
    muscle: 'ABS & CORE', 
    subMuscle: 'Rectus Abdominis', 
    secondaryMuscles: 'LEGS',
    setup: 'Lie flat on back.',
    execution: 'Explosively meet feet and hands above chest.'
  },
  { 
    name: 'Knee Raises', 
    muscle: 'ABS & CORE', 
    subMuscle: 'Rectus Abdominis', 
    secondaryMuscles: 'None',
    setup: 'Hang or in captain\'s chair.',
    execution: 'Raise knees to chest.'
  },
  { 
    name: 'Frog Crunch', 
    muscle: 'ABS & CORE', 
    subMuscle: 'Rectus Abdominis', 
    secondaryMuscles: 'LEGS',
    setup: 'Soles together, knees out on floor.',
    execution: 'Crunch up towards feet.'
  },
  { 
    name: 'Dead Bug', 
    muscle: 'ABS & CORE', 
    subMuscle: 'Rectus Abdominis', 
    secondaryMuscles: 'None',
    setup: 'On back, limbs in air.',
    execution: 'Lower opposite arm/leg slowly.'
  },

  // ABS & CORE - Obliques
  { 
    name: 'Russian Twist', 
    muscle: 'ABS & CORE', 
    subMuscle: 'Obliques', 
    secondaryMuscles: 'None',
    setup: 'Sit with feet elevated.',
    execution: 'Rotate torso side to side.'
  },
  { 
    name: 'Side Plank', 
    muscle: 'ABS & CORE', 
    subMuscle: 'Obliques', 
    secondaryMuscles: 'None',
    setup: 'On side, elbow under shoulder.',
    execution: 'Hold hips high in straight line.'
  },
  { 
    name: 'Cable Woodchopper', 
    muscle: 'ABS & CORE', 
    subMuscle: 'Obliques', 
    secondaryMuscles: 'SHOULDERS',
    setup: 'Stand sideways to high pulley.',
    execution: 'Pull handle down and across body.'
  },
  { 
    name: 'Hanging Oblique Raise', 
    muscle: 'ABS & CORE', 
    subMuscle: 'Obliques', 
    secondaryMuscles: 'FOREARMS',
    setup: 'Hang from pull-up bar.',
    execution: 'Raise knees to side armpit.'
  },
  { 
    name: 'Decline Oblique Sit-Up', 
    muscle: 'ABS & CORE', 
    subMuscle: 'Obliques', 
    secondaryMuscles: 'None',
    setup: 'Lie on decline bench.',
    execution: 'Sit up and twist elbow to knee.'
  },
  { 
    name: 'Bicycle Crunch', 
    muscle: 'ABS & CORE', 
    subMuscle: 'Obliques', 
    secondaryMuscles: 'None',
    setup: 'On back, legs pedaling.',
    execution: 'Elbow to opposite knee twist.'
  },
  { 
    name: 'Oblique Crunch', 
    muscle: 'ABS & CORE', 
    subMuscle: 'Obliques', 
    secondaryMuscles: 'None',
    setup: 'On back, knees to side.',
    execution: 'Crunch straight up.'
  },
  { 
    name: 'Standing Side Bend', 
    muscle: 'ABS & CORE', 
    subMuscle: 'Obliques', 
    secondaryMuscles: 'None',
    setup: 'Hold heavy dumbbell in one hand.',
    execution: 'Bend sideways and pull back up.'
  },
  { 
    name: 'Cable Side Bend', 
    muscle: 'ABS & CORE', 
    subMuscle: 'Obliques', 
    secondaryMuscles: 'None',
    setup: 'Low pulley handle.',
    execution: 'Bend away from machine and return.'
  },
  { 
    name: 'Pallof Press', 
    muscle: 'ABS & CORE', 
    subMuscle: 'Obliques', 
    secondaryMuscles: 'SHOULDERS',
    setup: 'Stand sideways to cable handle at chest.',
    execution: 'Press handle out, resist rotation.'
  },
  { 
    name: 'Landmine Twist', 
    muscle: 'ABS & CORE', 
    subMuscle: 'Obliques', 
    secondaryMuscles: 'SHOULDERS',
    setup: 'Hold landmine end with both hands.',
    execution: 'Rotate bar end side to side.'
  },
  { 
    name: 'Heel Touches', 
    muscle: 'ABS & CORE', 
    subMuscle: 'Obliques', 
    secondaryMuscles: 'None',
    setup: 'On back, knees bent.',
    execution: 'Tap heels side to side.'
  },
  { 
    name: 'T-Rotation Push-Up', 
    muscle: 'ABS & CORE', 
    subMuscle: 'Obliques', 
    secondaryMuscles: 'CHEST, SHOULDERS, TRICEPS',
    setup: 'High plank position.',
    execution: 'Perform push-up and rotate into T.'
  },
  { 
    name: 'Side V-Up', 
    muscle: 'ABS & CORE', 
    subMuscle: 'Obliques', 
    secondaryMuscles: 'None',
    setup: 'Lie on side, stacked legs.',
    execution: 'Lift top leg and torso to meet.'
  },
  { 
    name: 'Seated Oblique Knee Tuck', 
    muscle: 'ABS & CORE', 
    subMuscle: 'Obliques', 
    secondaryMuscles: 'None',
    setup: 'Sit on bench, lean back.',
    execution: 'Tuck knees and twist torso.'
  },

  // ABS & CORE - Transverse Abdominis
  { 
    name: 'Plank', 
    muscle: 'ABS & CORE', 
    subMuscle: 'Transverse Abdominis', 
    secondaryMuscles: 'SHOULDERS, LEGS',
    setup: 'Elbows under shoulders, toes on floor.',
    execution: 'Hold perfectly straight line. Brace everything.'
  },
  { 
    name: 'Hollow Hold', 
    muscle: 'ABS & CORE', 
    subMuscle: 'Transverse Abdominis', 
    secondaryMuscles: 'LEGS',
    setup: 'On back, legs/shoulders up.',
    execution: 'Press lower back into floor. Hold.'
  },
  { 
    name: 'Stomach Vacuum', 
    muscle: 'ABS & CORE', 
    subMuscle: 'Transverse Abdominis', 
    secondaryMuscles: 'None',
    setup: 'Standing or on all fours.',
    execution: 'Exhale fully, pull navel to spine. Hold.'
  },
  { 
    name: 'Bird Dog', 
    muscle: 'ABS & CORE', 
    subMuscle: 'Transverse Abdominis', 
    secondaryMuscles: 'BACK',
    setup: 'On hands and knees.',
    execution: 'Extend opposite arm/leg. Zero rotation.'
  },
  { 
    name: 'Dead Bug (TA Focus)', 
    muscle: 'ABS & CORE', 
    subMuscle: 'Transverse Abdominis', 
    secondaryMuscles: 'None',
    setup: 'On back, tabletop position.',
    execution: 'Slow, controlled limb lowering.'
  },
  { 
    name: 'Knee Tucks', 
    muscle: 'ABS & CORE', 
    subMuscle: 'Transverse Abdominis', 
    secondaryMuscles: 'None',
    setup: 'Sit on edge of bench.',
    execution: 'Pull knees in and out slowly.'
  },
  { 
    name: 'Mountain Climbers', 
    muscle: 'ABS & CORE', 
    subMuscle: 'Transverse Abdominis', 
    secondaryMuscles: 'SHOULDERS, TRICEPS',
    setup: 'High plank position.',
    execution: 'Run in place with knees to chest.'
  },
  { 
    name: 'Ball Stir-the-Pot', 
    muscle: 'ABS & CORE', 
    subMuscle: 'Transverse Abdominis', 
    secondaryMuscles: 'SHOULDERS',
    setup: 'Plank on stability ball.',
    execution: 'Make circles with forearms on ball.'
  },
  { 
    name: 'Isometric Hold', 
    muscle: 'ABS & CORE', 
    subMuscle: 'Transverse Abdominis', 
    secondaryMuscles: 'None',
    setup: 'Core tension position.',
    execution: 'Maximal core bracing for time.'
  },
  { 
    name: 'Bear Crawl', 
    muscle: 'ABS & CORE', 
    subMuscle: 'Transverse Abdominis', 
    secondaryMuscles: 'SHOULDERS, LEGS',
    setup: 'On hands and feet, knees low.',
    execution: 'Crawl forward using cross-patterns.'
  },
  { 
    name: 'Slow Controlled Leg Raises', 
    muscle: 'ABS & CORE', 
    subMuscle: 'Transverse Abdominis', 
    secondaryMuscles: 'None',
    setup: 'Lie on back.',
    execution: 'Extremely slow lowering of legs.'
  },

  // CARDIO
  { 
    name: 'Running (Treadmill)', 
    muscle: 'CARDIO', 
    subMuscle: 'General', 
    secondaryMuscles: 'LEGS',
    setup: 'Stand on treadmill, select speed.',
    execution: 'Run or jog at steady pace.'
  },
  { 
    name: 'Cycling (Stationary)', 
    muscle: 'CARDIO', 
    subMuscle: 'General', 
    secondaryMuscles: 'LEGS',
    setup: 'Adjust seat height.',
    execution: 'Pedal at consistent intensity.'
  },
  { 
    name: 'Elliptical Trainer', 
    muscle: 'CARDIO', 
    subMuscle: 'General', 
    secondaryMuscles: 'LEGS, SHOULDERS',
    setup: 'Step onto pedals, grab handles.',
    execution: 'Glide in smooth circular motion.'
  },
  { 
    name: 'Rowing Machine', 
    muscle: 'CARDIO', 
    subMuscle: 'General', 
    secondaryMuscles: 'BACK, LEGS, BICEPS',
    setup: 'Secure feet, grab handle.',
    execution: 'Drive with legs, lean back, pull to chest.'
  },
  { 
    name: 'Stair Climber', 
    muscle: 'CARDIO', 
    subMuscle: 'General', 
    secondaryMuscles: 'LEGS',
    setup: 'Step onto machine.',
    execution: 'Continuous climbing steps.'
  },
  { 
    name: 'Burpees', 
    muscle: 'CARDIO', 
    subMuscle: 'General', 
    secondaryMuscles: 'CHEST, SHOULDERS, LEGS',
    setup: 'Standing position.',
    execution: 'Drop to squat, kick back to plank, push-up, jump up.'
  },
  { 
    name: 'Mountain Climbers (Cardio Focus)', 
    muscle: 'CARDIO', 
    subMuscle: 'General', 
    secondaryMuscles: 'SHOULDERS, ABS & CORE',
    setup: 'High plank.',
    execution: 'Rapidly alternate knees to chest.'
  },
  { 
    name: 'Jumping Jacks', 
    muscle: 'CARDIO', 
    subMuscle: 'General', 
    secondaryMuscles: 'SHOULDERS, LEGS',
    setup: 'Standing neutral.',
    execution: 'Jump out with arms up, jump back.'
  },
  { 
    name: 'Kettlebell Swings (Cardio Focus)', 
    muscle: 'CARDIO', 
    subMuscle: 'General', 
    secondaryMuscles: 'LEGS, BACK',
    setup: 'Hinge stance with KB.',
    execution: 'Continuous hip-driven swings.'
  },
  { 
    name: 'Boxing (Shadow or Bag)', 
    muscle: 'CARDIO', 
    subMuscle: 'General', 
    secondaryMuscles: 'SHOULDERS, BACK',
    setup: 'Boxing stance.',
    execution: 'Punch combinations with footwork.'
  }
];
