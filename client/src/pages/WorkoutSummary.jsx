import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function WorkoutSummary() {

  const navigate = useNavigate();

  const [summary, setSummary] = useState(null);

  useEffect(() => {

    const fetchSummary = async () => {

      try {

        const token =
          localStorage.getItem("token");

        const response =
          await axios.get(
            "http://localhost:5000/api/workouts/summary",
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );

        setSummary(response.data);

      } catch (error) {

        console.error(error);

      }

    };

    fetchSummary();

  }, []);

  if (!summary) {
    return <h2>Loading...</h2>;
  }

  return (
    <div>

      <h1>🎉 Workout Complete!</h1>

      <h2>{summary.plan_name}</h2>

      <hr />

      <p>
        Duration:
        {" "}
        {Math.floor(summary.duration_seconds / 60)}
        {" "}
        minutes
      </p>

      <p>
        Volume Lifted:
        {" "}
        {summary.total_volume.toLocaleString()}
        {" "}
        lbs
      </p>

      <button
        onClick={() => navigate("/dashboard")}
      >
        Back to Dashboard
      </button>

    </div>
  );

}

export default WorkoutSummary;