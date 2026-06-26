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

console.log(exercises);

async function seedExercises() {
    await pool.execute(
    `
    DELETE FROM exercises
    `
    );
}

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

console.log(
  `${exercises.length} exercises inserted!`
);

process.exit();

seedExercises();