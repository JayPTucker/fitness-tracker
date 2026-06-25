import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token =
          localStorage.getItem("token");

        const response = await axios.get(
          "http://localhost:5000/api/auth/me",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setUser(response.data);

      } catch (error) {
        console.error(error);
      }
    };

    fetchUser();
  }, []);

  return (
    <div>
        <h1>Welcome back, {user?.first_name}</h1>
        <p>test</p>
    </div>

  );
}

export default Dashboard;