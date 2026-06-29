import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function WorkoutCalendar() {

    const [workouts, setWorkouts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {

        const fetchWorkouts = async () => {

            try {

                const token =
                    localStorage.getItem("token");

                const response =
                    await axios.get(
                        "http://localhost:5000/api/workouts/history",
                        {
                            headers: {
                                Authorization:
                                    `Bearer ${token}`
                            }
                        }
                    );

                setWorkouts(response.data);

            } catch (error) {

                console.error(error);

            }

        };

        fetchWorkouts();

    }, []);

    return (

        <div>

            <button onClick={() => navigate("/dashboard")}>
                Back to Dashboard
            </button>

            <h1>Workout Calendar</h1>

            {
                workouts.map((workout) => (

                    <div key={workout.id}>

                        <h3>
                            {
                                new Date(
                                    workout.completed_at
                                ).toLocaleDateString()
                            }
                        </h3>

                        <p>
                            {workout.duration_seconds / 60}
                            {" "}
                            minutes
                        </p>

                    </div>

                ))
            }

        </div>

    );

}

export default WorkoutCalendar;