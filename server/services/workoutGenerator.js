import pool from "../db/connection.js";

const workoutTemplates = {
  Push: {
    primary: ["Chest", "Shoulders", "Triceps"]
  },

  exerciseCounts: {
    Chest: 3,
    Shoulders: 2,
    Triceps: 2
  },

  Pull: {
    primary: ["Back", "Biceps"]
  },

  Legs: {
    primary: ["Legs"]
  },

  Upper: {
    primary: [
      "Chest",
      "Back",
      "Shoulders",
      "Biceps",
      "Triceps"
    ]
  },

  Lower: {
    primary: ["Legs"]
  },

  "Full Body": {
    primary: [
      "Chest",
      "Back",
      "Legs",
      "Shoulders"
    ]
  }
};

export async function generateWorkout(profile) {

  let split = [];

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

    console.log(day)


    // Which muscles does this day target?
    const muscles = workoutTemplates[day].primary;

    // Build SQL placeholders (?, ?, ?)
    // const placeholders =
    //   muscles.map(() => "?").join(",");

    // Query matching exercises
    // const [exercises] = await pool.execute(
    //   `
    //   SELECT *
    //   FROM exercises
    //   WHERE
    //     muscle_group IN (${placeholders})
    //     AND equipment = ?
    //     AND difficulty = ?
    //     AND is_active = TRUE
    //   `,
    //   [
    //     ...muscles,
    //     profile.equipment_type,
    //     profile.experience_level
    //   ]
    // );

    // // Save this day's workout
    workouts.push({
      day,
      exercises
    });

  }

  return {
    split,
    workouts
  };
}