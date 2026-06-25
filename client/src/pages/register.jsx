import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { GoogleLogin }
from "@react-oauth/google";

function Register() {
  const navigate = useNavigate();

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,64}$/;


  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!passwordRegex.test(formData.password)) {

      alert(
        "Password must be 8-64 characters and contain an uppercase letter, lowercase letter, and number."
      );

      return;
    }
    // Check to see if Email is already registered in database
    try {
      
      await axios.post(
        "http://localhost:5000/api/auth/register",
        formData
      );

      alert("Account created!  Redirecting to login page...");

      // Redirect to login page
      navigate("/login");

    } catch (error) {
      if (error.response && error.response.status === 409) {
        alert("Email already exists. Please use a different email.");
      } else {
        alert("Registration failed. Please try again.");
      }

      console.error(error);

      // Make all input fields blank again
      document.querySelectorAll("input").forEach((input) => {
        input.value = "";
      });
    }

  };


  return (
    <div>
      <form onSubmit={handleSubmit} autoComplete="off">
        <input
          name="first_name"
          placeholder="First Name"
          onChange={handleChange}
        />

        <input
          name="last_name"
          placeholder="Last Name"
          onChange={handleChange}
        />

        <input
          name="email"
          placeholder="Email"
          autoComplete="new-email"
          onChange={handleChange}
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          autoComplete="new-password"
          minLength={8}
          maxLength={64}
          onChange={handleChange}
        />

        <button type="submit">
          Register
        </button>
      </form>

      <GoogleLogin
        onSuccess={async (
            credentialResponse
        ) => {

            try {

            const response =
                await axios.post(
                "http://localhost:5000/api/auth/google",
                {
                    credential:
                    credentialResponse.credential
                }
                );

            localStorage.setItem(
                "token",
                response.data.token
            );

            navigate("/dashboard");

            } catch (error) {

            console.error(error);

            }
        }}

        onError={() => {
            console.log("Registration Failed");
        }}
        />
    </div>

  );
}

export default Register;