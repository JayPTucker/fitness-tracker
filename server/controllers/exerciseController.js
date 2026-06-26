import pool from "../db/connection.js";

export const getAllExercises = async (req, res) => {

  try {

    const {
      muscle,
      equipment,
      difficulty
    } = req.query;

    let sql = `
      SELECT *
      FROM exercises
      WHERE is_active = TRUE
    `;

    const params = [];

    if (muscle) {
      sql += " AND muscle_group = ?";
      params.push(muscle);
    }

    if (equipment) {
      sql += " AND equipment = ?";
      params.push(equipment);
    }

    if (difficulty) {
      sql += " AND difficulty = ?";
      params.push(difficulty);
    }

    sql += " ORDER BY exercise_name";

    const [exercises] =
      await pool.execute(sql, params);

    res.json(exercises);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Failed to fetch exercises."
    });

  }

};