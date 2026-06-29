import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Dashboard() {
  const navigate = useNavigate();

  // For GET on user table on Dashboard
  const [user, setUser] = useState(null);
  // For GET on user_profiles on Dashboard
  const [profile, setProfile] = useState(null);

  // Var for last workout
  const [lastWorkout, setLastWorkout] = useState(null);

  // GET on user table on Dashboard
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");

        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };

        const [userResponse, profileResponse] =
          await Promise.all([
            axios.get(
              "http://localhost:5000/api/auth/me",
              config
            ),
            axios.get(
              "http://localhost:5000/api/profile",
              config
            )
          ]);

        setUser(userResponse.data);
        setProfile(profileResponse.data);

        if (!userResponse.data.profile_completed) {
          navigate("/setup");
        }

        try {

          const workoutResponse =
            await axios.get(
              "http://localhost:5000/api/workouts/summary",
              {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              }
            );

          setLastWorkout(workoutResponse.data);

        } catch (error) {

          console.log("No previous workout.");

        }
      } catch (error) {

        console.error(error);

        navigate("/login");

      }
    };

    fetchUser();
  }, [navigate]);

  if (!user || !profile) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container">

      <button onClick={() => navigate("/setup")}>
        Edit Profile
      </button>
      <h1>
        Welcome back, {user.first_name}
      </h1>

      
      <p>Weight: {profile.weight_lbs} lbs</p>

      <p>Goal: {profile.goal}</p>

      <p>Equipment: {profile.equipment_type}</p>

      <p>Experience: {profile.experience_level}</p>

      <p>Workout Days: {profile.workout_days_per_week}</p>
      
      <hr></hr>

      <section>
        <button onClick={() => navigate("/workout")}>
            Start Today's Workout
        </button>
      </section>

      <hr />

      <h2>Last Workout</h2>

      {
        lastWorkout ? (
          <>

            <p>
              Plan:
              {" "}
              {lastWorkout.plan_name}
            </p>

            <p>
              Duration:
              {" "}
              {Math.floor(
                lastWorkout.duration_seconds / 60
              )}
              {" "}
              min
            </p>

            <p>
              Volume:
              {" "}
              {lastWorkout.total_volume.toLocaleString()}
              {" "}
              lbs
            </p>

          </>
        ) : (

          <p>
            No completed workouts yet.
          </p>

        )
      }

      <button
        onClick={() =>
          navigate("/history")
        }
      >
        Workout History
    </button>
    </div>


    
  );
}

export default Dashboard;