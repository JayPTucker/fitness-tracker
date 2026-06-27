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

    const muscles =
      workoutTemplates[day].primary;

    const exerciseCounts =
      workoutTemplates[day].exerciseCounts;

    workouts.push({
      day,
      muscles,
      exerciseCounts
    });

  }

  return {
    split,
    workouts
  };
}

// node scripts/testGenerator.js