import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Workout() {

  const [plan, setPlan] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [setData, setSetData] = useState({});
  const [seconds, setSeconds] = useState(0);
  const [workoutDay, setWorkoutDay] = useState(null);
  const [sessionId, setSessionId] = useState(null);
    const navigate = useNavigate();

  useEffect(() => {

    const fetchWorkout = async () => {

      try {

        const token =
          localStorage.getItem("token");

        const response =
          await axios.get(
            "http://localhost:5000/api/workouts/current",
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );
        
          const sessionResponse =
            await axios.post(
                "http://localhost:5000/api/workouts/start",
                {
                workout_plan_id: response.data.plan.id,
                workout_day: response.data.workoutDay
                },
                {
                headers: {
                    Authorization: `Bearer ${token}`
                }
                }
            );

            setSessionId(
                sessionResponse.data.sessionId
            );

            console.log(
                "Session ID:",
                sessionResponse.data.sessionId
            );

        setPlan(response.data.plan);
        setWorkoutDay(response.data.workoutDay);

        setExercises(response.data.exercises);

      } catch (error) {

        console.error(error);

      }

    };

    fetchWorkout();

  }, []);

  useEffect(() => {

    const interval = setInterval(() => {

        setSeconds((prev) => prev + 1);

    }, 1000);

    return () => clearInterval(interval);

}, []);

  if (!plan) {
    return <h2>Loading Workout...</h2>;
  }


    const handleCompleteSet = async (exercise) => {

    try {

        const token =
            localStorage.getItem("token");

            await axios.post(
            "http://localhost:5000/api/workouts/log-set",
            {
                workout_session_id: sessionId, // We'll make this dynamic next
                exercise_id: exercise.exercise_id,
                set_number: 1,
                reps_completed: setData[exercise.id]?.reps,
                weight_used: setData[exercise.id]?.weight
            },
            {
                headers: {
                Authorization: `Bearer ${token}`
                }
            }
        );

        alert("Set completed!");

        } catch (error) {

            console.error(error);

        }

    };

    const formatTime = () => {

        const hrs = Math.floor(seconds / 3600);

        const mins = Math.floor(
            (seconds % 3600) / 60
        );

        const secs = seconds % 60;

        return `${hrs
            .toString()
            .padStart(2, "0")}:${mins
            .toString()
            .padStart(2, "0")}:${secs
            .toString()
            .padStart(2, "0")}`;

    };

    const handleFinishWorkout = async () => {

        const confirmFinish =
            window.confirm(
            "Finish this workout?\n\nAny incomplete sets will be skipped."
            );

        if (!confirmFinish) return;

        try {

        const token =
        localStorage.getItem("token");

        await axios.post(
        "http://localhost:5000/api/workouts/finish",
        {
            workout_session_id: sessionId
        },
        {
            headers: {
            Authorization:
                `Bearer ${token}`
            }
        }
        );

        alert("Workout Complete!");

        navigate('/dashboard')

        } catch (error) {

            console.error(error);

        }

    };

  return (
    <div>

        <h1>{plan.plan_name}</h1>

        <h2>Day {workoutDay}</h2>

        <h3>{plan.goal}</h3>

        <h2>Workout Time</h2>

        <h3>{formatTime()}</h3>


      <hr />

      {exercises.map((exercise) => (

        <div
          key={exercise.id}
          style={{
            border: "1px solid gray",
            marginBottom: "20px",
            padding: "15px"
          }}
        >

          <h3>{exercise.exercise_name}</h3>

          <p>
            {exercise.muscle_group}
          </p>

          <p>
            {exercise.sets} sets × {exercise.reps}
          </p>

          <p>
            {exercise.instructions}
          </p>

            <input
                type="number"
                placeholder="Weight"
                value={setData[exercise.id]?.weight || ""}
                onChange={(e) =>
                    setSetData({
                    ...setData,
                    [exercise.id]: {
                        ...setData[exercise.id],
                        weight: e.target.value
                    }
                    })
                }
            />

          <br />
            <input
                type="number"
                placeholder="Reps"
                value={setData[exercise.id]?.reps || ""}
                onChange={(e) =>
                    setSetData({
                    ...setData,
                    [exercise.id]: {
                        ...setData[exercise.id],
                        reps: e.target.value
                    }
                    })
                }
            />

          <br />
          <br />

            <button
            onClick={() =>
                handleCompleteSet(exercise)
            }
            >
            Complete Set
            </button>

        </div>

      ))}

      <hr />

        <button
        onClick={handleFinishWorkout}
        >
        Finish Workout
        </button>

    </div>
  );

}

export default Workout;