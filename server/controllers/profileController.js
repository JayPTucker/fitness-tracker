import pool from "../db/connection.js";

export const createProfile = async (req, res) => {

    

  try {



    const {
      gender,
      date_of_birth,
      height_inches,
      weight_lbs,
      goal_weight,
      goal,
      experience_level,
      workout_days_per_week,
      equipment_type
    } = req.body;

    // Check if user's profile is already saved based on user_id
    const [existingProfileDetails] =
      await pool.execute(
        `
        SELECT id
        FROM user_profiles
        WHERE user_id = ?
        `,
        [req.user.id]
      );

    // If user saves changes and their profile details are already present in user_profiles table
    if (existingProfileDetails.length > 0) {
        await pool.execute(
            `
            UPDATE user_profiles
            SET
            gender = ?,
            date_of_birth = ?,
            height_inches = ?,
            weight_lbs = ?,
            goal_weight = ?,
            goal = ?,
            experience_level = ?,
            workout_days_per_week = ?,
            equipment_type = ?
            WHERE user_id = ?
            `,
            [
            gender,
            date_of_birth,
            height_inches,
            weight_lbs,
            goal_weight,
            goal,
            experience_level,
            workout_days_per_week,
            equipment_type,
            req.user.id
            ]
        );

        return res.json({
            message: "Profile updated"
        });
    }

    await pool.execute(
      `
      INSERT INTO user_profiles
      (
        user_id,
        gender,
        date_of_birth,
        height_inches,
        weight_lbs,
        goal_weight,
        goal,
        experience_level,
        workout_days_per_week,
        equipment_type
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        req.user.id,
        gender,
        date_of_birth,
        height_inches,
        weight_lbs,
        goal_weight,
        goal,
        experience_level,
        workout_days_per_week,
        equipment_type
      ]
    );

    await pool.execute(
      `
      UPDATE users
      SET profile_completed = TRUE
      WHERE id = ?
      `,
      [req.user.id]
    );

    res.json({
      message: "Profile created"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Failed to create profile"
    });

  }
};