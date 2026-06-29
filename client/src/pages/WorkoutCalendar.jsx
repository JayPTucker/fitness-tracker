import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

import "../css/WorkoutCalendar.css"

function WorkoutCalendar() {
    const navigate = useNavigate();

    const [workouts, setWorkouts] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());

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

    const hasWorkout = (date) => {

        return workouts.some((workout) => {

            const workoutDate =
            new Date(workout.completed_at);

            return (
            workoutDate.toDateString() ===
            date.toDateString()
            );

        });

    };

    const selectedWorkouts =
    workouts.filter((workout) => {

        return (
            new Date(workout.completed_at)
                .toDateString() ===
            selectedDate.toDateString()
        );

    });

    return (

        <div>

            <button onClick={() => navigate("/dashboard")}>
                Back to Dashboard
            </button>

            <h1>Workout Calendar</h1>

            <Calendar
                value={selectedDate}
                onChange={setSelectedDate}
                tileClassName={({ date }) => {

                    if (hasWorkout(date)) {
                        return "workout-day";
                    }

                }}
            />

            <hr />

            <h2>
                Workout History for{" "}
                {selectedDate.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric"
                })}

            </h2>

            {
            selectedWorkouts.length === 0 ? (

                <p>No workout this day.</p>

            ) : (

                selectedWorkouts.map((workout) => (

                <div key={workout.id}>

                    <h3>{workout.plan_name}</h3>

                    <b>
                    Workout Time: 
                    {" "}
                    {new Date(workout.started_at).toLocaleTimeString(
                        "en-US",
                        {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true
                        }
                    )}
                    {" - "}
                    {new Date(workout.completed_at).toLocaleTimeString(
                        "en-US",
                        {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true
                        }
                    )}                
                    </b>

                    <p>
                    Duration:
                    {" "}
                    {Math.floor(
                        workout.duration_seconds / 60
                    )}
                    {" "}
                    min
                    </p>

                    <p>
                    Volume:
                    {" "}
                    {workout.total_volume.toLocaleString()}
                    {" "}
                    lbs
                    </p>

                </div>

                ))

            )
            }
        </div>

    );

}

export default WorkoutCalendar;