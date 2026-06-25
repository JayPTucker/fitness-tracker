CREATE TABLE user_profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT NOT NULL,

    height_inches INT,
    weight_lbs DECIMAL(5,2),

    goal VARCHAR(50),
    experience_level VARCHAR(50),

    workout_days_per_week INT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);