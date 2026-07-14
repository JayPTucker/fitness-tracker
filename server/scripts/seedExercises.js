import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import pool from "../db/connection.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const exercises = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "../db/exercises.json"),
    "utf8"
  )
);

async function seedExercises() {
  try {
    await pool.execute(`DELETE FROM exercise_sets`);
    await pool.execute(`DELETE FROM workout_sessions`);
    await pool.execute(`DELETE FROM workout_plan_exercises`);
    await pool.execute(`DELETE FROM workout_plans`);
    await pool.execute(`DELETE FROM exercises`);

    for (const exercise of exercises) {
      await pool.execute(
        `
        INSERT INTO exercises
        (
            exercise_name,
            muscle_group,
            secondary_muscle,
            equipment,
            difficulty,
            exercise_type,
            instructions
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
        [
          exercise.exercise_name,
          exercise.muscle_group,
          exercise.secondary_muscle,
          exercise.equipment,
          exercise.difficulty,
          exercise.exercise_type,
          exercise.instructions
        ]
      );
    }

    console.log(`${exercises.length} exercises inserted successfully!`);
  } catch (error) {
    console.error("Failed to seed exercises:", error);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

seedExercises();