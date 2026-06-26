import { generateWorkout }
from "../services/workoutGenerator.js";

const split =
    await generateWorkout({

        workout_days_per_week: 5

    });

console.log(split);