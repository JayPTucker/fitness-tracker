import React from 'react';
import { useState } from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Setup() {

    const navigate = useNavigate();

    const[formData, setFormData] = useState({
        gender: '',
        date_of_birth: '',
        height_inches: '',
        weight_lbs: '',
        goal_weight: '',
        goal: '',
        experience_level: '',
        workout_days_per_week: '',
        equipment_type: ''
    });

    const handleChange = (e) => {
        setFormData({
        ...formData,
        [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const token =
            localStorage.getItem("token");

            await axios.post(
            "http://localhost:5000/api/profile",
            formData,
            {
                headers: {
                Authorization:
                    `Bearer ${token}`
                }
            }
            );

            alert("Profile saved successfully! Redirecting to Dashboard...")

            navigate("/dashboard");

        } catch (error) {

            alert("Failed to save profile. Please try again.");
            console.error(error);

        }
    };

  return (
    <div>
      <h1>Setup Profile</h1>

      <p>
        Let's get your fitness
        profile configured.
      </p>

      <form onSubmit={handleSubmit}>
        <label>Gender</label>
        <select
            name="gender"
            onChange={handleChange}
        >
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
        </select>

        <br></br>

        <label>Date of Birth</label>
        <input
            type="date"
            name="date_of_birth"
            onChange={handleChange}
        />

        <br></br>

        <label>Height (Inches)</label>
        <input
            type="number"
            name="height_inches"
            onChange={handleChange}
        />
        
        <br></br>

        <label>Current Weight</label>
        <input
            type="number"
            name="weight_lbs"
            onChange={handleChange}
        />
        
        <br></br>

        <label>Goal Weight</label>
        <input
            type="number"
            name="goal_weight"
            onChange={handleChange}
        />

        <br></br>

        <label>Goal</label>
        <select
            name="goal"
            onChange={handleChange}
        >
            <option value="">Select</option>
            <option value="Build Muscle">Build Muscle</option>
            <option value="Lose Fat">Lose Fat</option>
            <option value="Maintain Weight">Maintain Weight</option>
            <option value="Improve Strength">Improve Strength</option>
        </select>

        <br></br>

        <label>Experience Level</label>
        <select
            name="experience_level"
            onChange={handleChange}
        >
            <option value="">Select</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
        </select>

        <br></br>

        <label>Workout Days Per Week</label>
        <select
            name="workout_days_per_week"
            onChange={handleChange}
        >
            <option value="">Select</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
        </select>

        <br></br>

        <label>Equipment</label>
        <select
            name="equipment_type"
            onChange={handleChange}
        >
            <option value="">Select</option>
            <option value="Full Gym">Full Gym</option>
            <option value="Home Gym">Home Gym</option>
            <option value="Dumbbells Only">Dumbbells Only</option>
            <option value="Bodyweight Only">Bodyweight Only</option>
        </select>

        <br></br><br></br>

        <button type="submit">
            Save Profile
        </button>

        </form>
    </div>
  );
}

export default Setup;