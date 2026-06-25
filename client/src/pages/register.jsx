import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
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

    // Check to see if Email is already registered in database
    try {
      
      await axios.post(
        "http://localhost:5000/api/auth/register",
        formData
      );

      alert("Account created!  Redirecting to login page...");

      // Redirect to login page
      window.location.href = "/login";

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
        onChange={handleChange}
      />

      <button type="submit">
        Register
      </button>
    </form>
  );
}

export default Register;