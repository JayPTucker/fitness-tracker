import { generateWorkout } from "../services/workoutGenerator.js";

const profile = {
  workout_days_per_week: 5
};

const result = await generateWorkout(profile);

console.log(JSON.stringify(result, null, 2));