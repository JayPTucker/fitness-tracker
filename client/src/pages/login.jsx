import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { GoogleLogin }
from "@react-oauth/google";

function Login() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
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

        try {
            const response = await axios.post("http://localhost:5000/api/auth/login", formData);
            console.log(response.data);

            localStorage.setItem("token", response.data.token);

            alert("Login successful!");

            navigate("/dashboard");

        } catch (error) {
            console.error("Login failed:", error);
            alert("Login failed. Please check your credentials.");
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    onChange={handleChange}
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={handleChange}
                />

                <button type="submit">
                    Login
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
                console.log("Login Failed");
            }}
            />
        </div>
    )
}

export default Login;