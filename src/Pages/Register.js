import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/register.css";

export default function Register() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");

  async function register() {
    const response = await fetch("http://localhost:5000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password, token })
    });

    const data = await response.json();

    if (!data.success) {
      alert(data.message || "Registration failed.");
      return;
    }

    alert("Registration successful.");
    navigate("/");
  }

  return (
    <div className="register-page">
      <div className="register-card">
        <h1>Register</h1>

        <p>Create an account and save your Vercel API token.</p>

        <p className="hint">
          Password must be 8+ characters, include 1 uppercase letter, and 1 number.
        </p>

        <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Vercel API Token"
          onChange={(e) => setToken(e.target.value)}
        />

        <button onClick={register}>Register</button>

        <button className="secondary-btn" onClick={() => navigate("/")}>
          Back to Login
        </button>
      </div>
    </div>
  );
}