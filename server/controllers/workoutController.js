import pool from "../db/connection.js";
import { generateWorkout } from "../services/workoutGenerator.js";

export const generateWorkoutPlan = async (req, res) => {
  try {

    // Get the logged-in user's profile
    const [profiles] = await pool.execute(
      `
      SELECT *
      FROM user_profiles
      WHERE user_id = ?
      `,
      [req.user.id]
    );

    if (profiles.length === 0) {
      return res.status(404).json({
        message: "Profile not found."
      });
    }

    const profile = profiles[0];

    // Generate the workout
    const workoutPlan = await generateWorkout(profile);

    console.log(workoutPlan);

    // Return it to the frontend/Postman
    res.json(workoutPlan);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Failed to generate workout."
    });

  }
};