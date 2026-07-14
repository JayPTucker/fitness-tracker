import pool from "../db/connection.js"

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
  },

  "Chest Focus": {
    primary: [
      "Chest",
      "Shoulders",
      "Triceps"
    ],

    exerciseCounts: {
      Chest: 4,
      Shoulders: 1,
      Triceps: 2
    }
  },

  "Back Focus": {
    primary: [
      "Back",
      "Biceps",
      "Shoulders"
    ],

    exerciseCounts: {
      Back: 4,
      Biceps: 2,
      Shoulders: 1
    }
  },

  "Shoulders Focus": {
    primary: [
      "Shoulders",
      "Chest",
      "Triceps"
    ],

    exerciseCounts: {
      Shoulders: 3,
      Chest: 1,
      Triceps: 2
    }
  },

  "Arms Focus": {
    primary: [
      "Biceps",
      "Triceps",
      "Chest"
    ],

    exerciseCounts: {
      Biceps: 3,
      Triceps: 2,
      Chest: 1
    }
  }

};

const equipmentMap = {

    "Full Gym": [
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


async function getExercisesForMuscle(
  muscle,
  count,
  profile
) {

  // console.log(profile.equipment_type);
  // console.log(equipmentMap);

  const allowedEquipment =
    equipmentMap[profile.equipment_type];

  if (!allowedEquipment) {
    throw new Error(
      `Unknown equipment type: ${profile.equipment_type}`
    );
  }

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
      LIMIT ${Number(count)}
      `,
      [
        muscle,
        ...allowedEquipment,
        profile.experience_level
      ]
    );

  return exercises;

}

export function buildWorkoutSplit(daysPerWeek) {

  switch (Number(daysPerWeek)) {

    case 2:
      return ["Upper", "Lower"];

    case 3:
      return ["Push", "Pull", "Legs"];

    case 4:
      return ["Upper", "Lower", "Upper", "Lower"];

    case 5:
      return [
        "Chest Focus",
        "Back Focus",
        "Legs",
        "Shoulders Focus",
        "Arms Focus"
      ];

    case 6:
      return [
        "Chest Focus",
        "Back Focus",
        "Legs",
        "Chest Focus",
        "Back Focus",
        "Legs"
      ];

    default:
      return ["Full Body", "Full Body", "Full Body"];
  }

}

export async function generateWorkout(profile) {

  const split = buildWorkoutSplit(profile.workout_days_per_week);

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