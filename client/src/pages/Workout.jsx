import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import "../css/Workout.css";

function Workout() {

  const [plan, setPlan] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [setData, setSetData] = useState({});
  const [completedSets, setCompletedSets] = useState({});
  const [seconds, setSeconds] = useState(0);
  const [workoutDay, setWorkoutDay] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const navigate = useNavigate();
  const [restSeconds, setRestSeconds] = useState(0);
  const [activeRestSet, setActiveRestSet] = useState(null);
  const [lastPerformance, setLastPerformance] = useState({});
  const [showSessionPrompt, setShowSessionPrompt] = useState(false);
  const [savedSessionData, setSavedSessionData] = useState(null);

  const restoreSession = (sessionData) => {
    setSessionId(sessionData.sessionId);
    setPlan(sessionData.plan);
    setWorkoutDay(sessionData.workoutDay);
    setExercises(sessionData.exercises);
    setSetData(sessionData.setData || {});
    setCompletedSets(sessionData.completedSets || {});
    setSeconds(sessionData.seconds || 0);
    setLastPerformance(sessionData.lastPerformance || {});
    setShowSessionPrompt(false);
    console.log("Restored workout session:", sessionData.sessionId);
  };

  const startNewSession = async () => {
    localStorage.removeItem("workoutSession");
    setSavedSessionData(null);
    setShowSessionPrompt(false);
    fetchWorkout();
  };

  const fetchWorkout = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/api/workouts/current",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const sessionResponse = await axios.post(
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

      setSessionId(sessionResponse.data.sessionId);

      console.log(
        "Session ID:",
        sessionResponse.data.sessionId
      );

      setPlan(response.data.plan);
      setWorkoutDay(response.data.workoutDay);

      setExercises(response.data.exercises);

      const performance = {};

      for (const exercise of response.data.exercises) {
        try {
          const lastResponse = await axios.get(
            `http://localhost:5000/api/workouts/last-performance/${exercise.exercise_id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          )
          if (lastResponse.data) {
            performance[exercise.id] = lastResponse.data;
          }
        } catch (error) {
          console.error(error);
        }
      }

      setLastPerformance(performance);

    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // Check for saved workout session on mount
    const savedSession = localStorage.getItem("workoutSession");
    if (savedSession) {
      try {
        const sessionData = JSON.parse(savedSession);
        setSavedSessionData(sessionData);
        setShowSessionPrompt(true);
        return;
      } catch (error) {
        console.error("Failed to restore session:", error);
      }
    }

    fetchWorkout();

  }, []);

  useEffect(() => {

      const interval = setInterval(() => {

          setSeconds((prev) => prev + 1);

      }, 1000);

    return () => clearInterval(interval);

  }, []);

  useEffect(() => {

    if (restSeconds <= 0) return;

      const interval = setInterval(() => {

        setRestSeconds(prev => prev - 1);

      }, 1000);

    return () => clearInterval(interval);

  }, [restSeconds]);

  useEffect(() => {
    // Save workout state to localStorage whenever it changes
    if (plan && sessionId) {
      const workoutState = {
        sessionId,
        plan,
        workoutDay,
        exercises,
        setData,
        completedSets,
        seconds,
        lastPerformance
      };
      localStorage.setItem("workoutSession", JSON.stringify(workoutState));
    }
  }, [sessionId, plan, workoutDay, exercises, setData, completedSets, seconds, lastPerformance]);

  if (showSessionPrompt) {
    return (
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000
      }}>
        <div style={{
          backgroundColor: "white",
          padding: "30px",
          borderRadius: "8px",
          textAlign: "center",
          maxWidth: "400px"
        }}>
          <h2>Continue Last Workout?</h2>
          <p>You have an ongoing workout session. Would you like to continue or start fresh?</p>
          <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginTop: "20px" }}>
            <button 
              onClick={() => restoreSession(savedSessionData)}
              style={{
                padding: "10px 20px",
                backgroundColor: "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "16px"
              }}
            >
              Continue
            </button>
            <button 
              onClick={startNewSession}
              style={{
                padding: "10px 20px",
                backgroundColor: "#f44336",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "16px"
              }}
            >
              Start New
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!plan) {
    return <h2>Loading Workout...</h2>;
  }


  const handleCompleteSet = async (
    exercise,
    setNumber
  ) => {

    try {

        const token =
            localStorage.getItem("token");

            await axios.post(
            "http://localhost:5000/api/workouts/log-set",
            {
                workout_session_id: sessionId, // We'll make this dynamic next
                exercise_id: exercise.exercise_id,
                set_number: setNumber,
                reps_completed: setData[`${exercise.id}-${setNumber - 1}`]?.reps,
                weight_used: setData[`${exercise.id}-${setNumber - 1}`]?.weight
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

    const formatRestTime = () => {

      const mins = Math.floor(restSeconds / 60);

      const secs = restSeconds % 60;

      return `${mins
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

        localStorage.removeItem("workoutSession");

        navigate('/workout-summary')

        } catch (error) {

            console.error(error);

        }

    };

  return (
    <div>

        <a href="/dashboard">Dashboard</a>
        <h1>{plan.plan_name}</h1>

        <h2>Day {workoutDay}</h2>

        <h3>{plan.goal}</h3>

        <h2>Workout Time</h2>

        <h2>{formatTime()}</h2>

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

          {Array.from(
            { length: exercise.sets },
            (_, index) => (

              
              <div
                key={index}
                className={`setRow ${
                  completedSets[`${exercise.id}-${index}`]
                    ? "completedSet"
                    : ""
                }`}
              >

                {
                  lastPerformance[exercise.id] && (

                    <div className="previous-performance">

                      <strong>Last Workout</strong>

                      <p>

                        {lastPerformance[exercise.id].weight_used}
                        {" "}lbs ×{" "}
                        {lastPerformance[exercise.id].reps_completed}

                      </p>

                    </div>

                  )
                }
                <strong>
                  Set {index + 1}
                </strong>

                <input
                  type="number"
                  placeholder={
                    lastPerformance[exercise.id]
                      ? `Rec Weight (${parseInt(lastPerformance[exercise.id].weight_used) + 5})`
                      : "Weight"
                  }
                  value={
                    setData[`${exercise.id}-${index}`]?.weight || ""
                  }
                  onChange={(e) =>
                    setSetData({
                      ...setData,
                      [`${exercise.id}-${index}`]: {
                        ...setData[`${exercise.id}-${index}`],
                        weight: e.target.value
                      }
                    })
                  }
                />

                <input
                  type="number"
                  placeholder="Reps"
                  value={
                    setData[`${exercise.id}-${index}`]?.reps || ""
                  }
                  onChange={(e) =>
                    setSetData({
                      ...setData,
                      [`${exercise.id}-${index}`]: {
                        ...setData[`${exercise.id}-${index}`],
                        reps: e.target.value
                      }
                    })
                  }
                />

                <button
                  disabled={
                    completedSets[
                      `${exercise.id}-${index}`
                    ]
                  }
                  onClick={async () => {

                    await handleCompleteSet(
                      exercise,
                      index + 1
                    );

                    setRestSeconds(75);
                    setActiveRestSet(`${exercise.id}-${index}`);

                    setCompletedSets({
                      ...completedSets,
                      [`${exercise.id}-${index}`]: true
                    });

                  }}
                >
                  {
                    completedSets[
                      `${exercise.id}-${index}`
                    ]
                      ? "✓"
                      : "Complete"
                  }
                </button>

                {
                activeRestSet === `${exercise.id}-${index}` &&
                restSeconds > 0 && (

                  <p className="restTimer">
                    ⏱ Rest: {formatRestTime()}
                  </p>

                )
              }
              </div>

          ))
          }

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