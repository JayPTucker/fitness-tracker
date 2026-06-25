import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token =
          localStorage.getItem("token");

        const response =
          await axios.get(
            "http://localhost:5000/api/auth/me",
            {
              headers: {
                Authorization:
                  `Bearer ${token}`
              }
            }
          );

        setUser(response.data);

        if (
          !response.data.profile_completed
        ) {
          navigate("/setup");
        }

      } catch (error) {
        console.error(error);

        navigate("/login");
      }
    };

    fetchUser();
  }, [navigate]);

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <button onClick={() => navigate("/setup")}>
        Edit Profile
      </button>
      <h1>
        Welcome back,
        {" "}
        {user.first_name}
      </h1>

      <p>Dashboard coming soon.</p>
    </div>
  );
}

export default Dashboard;