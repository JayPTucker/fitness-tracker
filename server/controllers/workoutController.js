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

    const [result] = await pool.execute(
        `
        INSERT INTO workout_plans
        (
            user_id,
            plan_name,
            goal,
            days_per_week
        )
        VALUES (?, ?, ?, ?)
        `,
        [
            req.user.id,
            `${profile.goal} Plan`,
            profile.goal,
            profile.workout_days_per_week
        ]
    );

    const workoutPlanId = result.insertId;

    let workoutDay = 1;

    for (const workout of workoutPlan.workouts) {

        let exerciseOrder = 1;

        for (const exercise of workout.exercises) {

            await pool.execute(
            `
            INSERT INTO workout_plan_exercises
            (
                workout_plan_id,
                workout_day,
                exercise_id,
                exercise_order,
                sets,
                reps
            )
            VALUES (?, ?, ?, ?, ?, ?)
            `,
            [
                workoutPlanId,
                workoutDay,
                exercise.id,
                exerciseOrder,
                3,
                "8-12"
            ]
        );

        exerciseOrder++;

    }

    workoutDay++;

    }

    res.json({
        message: "Workout plan generated successfully!",
        workoutPlanId
    });

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

export const getCurrentWorkoutPlan = async (req, res) => {
  try {

    const [plans] = await pool.execute(
      `
      SELECT *
      FROM workout_plans
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT 1
      `,
      [req.user.id]
    );

    if (plans.length === 0) {
      return res.status(404).json({
        message: "No workout plan found."
      });
    }

    const plan = plans[0];

    // Fetch every exercise for that plan
    const [exercises] = await pool.execute(
        `
        SELECT
            wpe.*,
            e.exercise_name,
            e.instructions,
            e.muscle_group,
            e.secondary_muscle,
            e.exercise_type,
            e.equipment
        FROM workout_plan_exercises wpe

        JOIN exercises e
            ON wpe.exercise_id = e.id

        WHERE workout_plan_id = ?

        ORDER BY
            workout_day,
            exercise_order
        `,
        [plan.id]
    );

    res.json({
        plan,
        exercises
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Failed to load workout."
    });

  }
};

export const startWorkoutSession = async (req, res) => {
  try {

    const {
      workout_plan_id,
      workout_day
    } = req.body;

    const [result] = await pool.execute(
      `
      INSERT INTO workout_sessions
      (
        user_id,
        workout_plan_id,
        workout_day
      )
      VALUES (?, ?, ?)
      `,
      [
        req.user.id,
        workout_plan_id,
        workout_day
      ]
    );

    res.status(201).json({
      sessionId: result.insertId
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Failed to start workout."
    });

  }
};