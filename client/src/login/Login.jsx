import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:2300/api/v1/auth/login",
        { email, password },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      console.log("Backend Response:", response.data);

      // Check if login was successful
      if (response.status == 200) {
        // Store token in localStorage
        localStorage.setItem("token", response.data.token);
        // Redirect to dashboard
        navigate("/dashboard");
      } else {
        setError(response.data.message || "Login failed. Try again.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="container">
        <div className="login">
          <h4>Login</h4>
          {error && <p className="error">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="text_area">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                className="text_input"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="text_area">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                className="text_input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn" disabled={loading}>
              {loading ? "Logging in..." : "LOGIN"}
            </button>
          </form>
          <a className="link" href="/reset-password">
            Reset Password
          </a>
        </div>
      </div>
    </>
  );
};

export default Login;
