const workoutTemplates = {

  Push: {
    primary: [
      "Chest",
      "Shoulders",
      "Triceps"
    ],

    exerciseCounts: {
      Chest: 3,
      Shoulders: 2,
      Triceps: 2
    }
  },

  Pull: {
    primary: [
      "Back",
      "Biceps"
    ],

    exerciseCounts: {
      Back: 3,
      Biceps: 2
    }
  },

  Legs: {
    primary: [
      "Legs"
    ],

    exerciseCounts: {
      Legs: 5
    }
  },

  Upper: {
    primary: [
      "Chest",
      "Back",
      "Shoulders",
      "Biceps",
      "Triceps"
    ],

    exerciseCounts: {
      Chest: 2,
      Back: 2,
      Shoulders: 1,
      Biceps: 1,
      Triceps: 1
    }
  },

  Lower: {
    primary: [
      "Legs"
    ],

    exerciseCounts: {
      Legs: 6
    }
  },

  "Full Body": {
    primary: [
      "Chest",
      "Back",
      "Legs",
      "Shoulders"
    ],

    exerciseCounts: {
      Chest: 2,
      Back: 2,
      Legs: 2,
      Shoulders: 1
    }
  }

};

const allowedEquipment = equipmentMap[profile.equipment_type];
  
const placeholders = allowedEquipment.map(() => "?").join(",");


async function getExercisesForMuscle(
  muscle,
  count,
  profile
) {

  const allowedEquipment =
    equipmentMap[profile.equipment_type];

  const equipmentPlaceholders =
    allowedEquipment
      .map(() => "?")
      .join(",");

  const [exercises] =
    await pool.execute(
      `
      SELECT *
      FROM exercises
      WHERE
        muscle_group = ?
        AND equipment IN (${equipmentPlaceholders})
        AND difficulty = ?
        AND is_active = TRUE
      ORDER BY RAND()
      LIMIT ?
      `,
      [
        muscle,
        ...allowedEquipment,
        profile.experience_level,
        count
      ]
    );

  return exercises;

}

export async function generateWorkout(profile) {

  let split = [];

  const equipmentMap = {

    "Commercial Gym": [
      "Barbell",
      "Dumbbells",
      "Machine",
      "Cable",
      "Smith Machine",
      "Resistance Bands",
      "Kettlebell",
      "Bodyweight"
    ],

    "Home Gym": [
      "Barbell",
      "Dumbbells",
      "Resistance Bands",
      "Kettlebell",
      "Bodyweight"
    ],

    "Bodyweight Only": [
      "Bodyweight"
    ]

  };

  switch (profile.workout_days_per_week) {

    case 3:
      split = ["Push", "Pull", "Legs"];
      break;

    case 4:
      split = ["Upper", "Lower", "Upper", "Lower"];
      break;

    case 5:
      split = ["Push", "Pull", "Legs", "Upper", "Lower"];
      break;

    case 6:
      split = ["Push", "Pull", "Legs", "Push", "Pull", "Legs"];
      break;

    default:
      split = ["Full Body", "Full Body", "Full Body"];
  }

  const workouts = [];

  // LOOP THROUGH EACH DAY
  for (const day of split) {

    const muscles =
      workoutTemplates[day].primary;

    const exerciseCounts =
      workoutTemplates[day].exerciseCounts;

    // Empty workout for this day
    const workoutExercises = [];

    // Loop through each muscle
    for (const muscle in exerciseCounts) {

      const count = exerciseCounts[muscle];

      const exercises =
        await getExercisesForMuscle(
          muscle,
          count,
          profile
        );

      workoutExercises.push(...exercises);

    }

    // Save the completed day
    workouts.push({
      day,
      exercises: workoutExercises
    });

  }
  return {
    split,
    workouts
  };
};

// node scripts/testGenerator.js