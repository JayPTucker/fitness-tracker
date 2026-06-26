CREATE TABLE user_profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT NOT NULL UNIQUE,

    gender VARCHAR(25),

    date_of_birth DATE,

    height_inches INT,

    weight_lbs DECIMAL(5,2),

    goal_weight DECIMAL(5,2),

    goal VARCHAR(50),

    experience_level VARCHAR(50),

    workout_days_per_week INT,

    equipment_type VARCHAR(50),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,

    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,

    email VARCHAR(255) NOT NULL UNIQUE,

    password VARCHAR(255) NOT NULL,

    auth_provider VARCHAR(50) DEFAULT 'local',

    profile_completed BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE exercises (
    id INT AUTO_INCREMENT PRIMARY KEY,

    exercise_name VARCHAR(100) NOT NULL,

    muscle_group VARCHAR(50) NOT NULL,

    secondary_muscle VARCHAR(50),

    equipment ENUM(
    'Barbell',
    'Dumbbells',
    'Machine',
    'Cable',
    'Smith Machine',
    'Bodyweight',
    'Resistance Bands',
    'Kettlebell'
	)  NOT NULL,

    difficulty ENUM(
        'Beginner',
        'Intermediate',
        'Advanced'
    ) NOT NULL,

    exercise_type ENUM(
        'Compound',
        'Isolation'
    ) NOT NULL,

    instructions TEXT,

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE exercise_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,

    workout_id INT NOT NULL,

    exercise_name VARCHAR(100),

    sets INT,

    reps INT,

    weight DECIMAL(6,2),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (workout_id)
    REFERENCES workouts(id)
    ON DELETE CASCADE
);

CREATE TABLE workout_plans (
    id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT NOT NULL,

    plan_name VARCHAR(100),

    goal VARCHAR(50),

    days_per_week INT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE TABLE workout_plan_exercises (
    id INT AUTO_INCREMENT PRIMARY KEY,

    workout_plan_id INT NOT NULL,

    workout_day INT NOT NULL,

    exercise_id INT NOT NULL,

    exercise_order INT NOT NULL,

    sets INT,

    reps VARCHAR(25),

    FOREIGN KEY (workout_plan_id)
        REFERENCES workout_plans(id)
        ON DELETE CASCADE,

    FOREIGN KEY (exercise_id)
        REFERENCES exercises(id)
);

CREATE TABLE workout_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT NOT NULL,

    workout_plan_id INT NOT NULL,

    workout_day INT NOT NULL,

    started_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    completed_at DATETIME,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    FOREIGN KEY (workout_plan_id)
        REFERENCES workout_plans(id)
        ON DELETE CASCADE
);

CREATE TABLE exercise_sets (
    id INT AUTO_INCREMENT PRIMARY KEY,

    workout_session_id INT NOT NULL,

    exercise_id INT NOT NULL,

    set_number INT NOT NULL,

    reps_completed INT,

    weight_used DECIMAL(6,2),

    completed BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (workout_session_id)
        REFERENCES workout_sessions(id)
        ON DELETE CASCADE,

    FOREIGN KEY (exercise_id)
        REFERENCES exercises(id)
);