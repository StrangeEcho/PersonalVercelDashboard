import { useState } from "react";
import { useNavigate } from "react-router-dom";


export default function Register() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");

  async function register() {
    try {
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password,
          token
        })
      });

      const data = await response.json();

      if (!data.success) {
        alert(data.message || "Registration failed.");
        return;
      }

      alert("Registration successful.");
      navigate("/");
    } catch (err) {
      alert("Could not connect to server.");
    }
  }

  return (
    <div className="login-page">
      <h1>Register</h1>

      <p>Create an account and save your Vercel API token.</p>

      <p>
        Password must be 8+ characters, include 1 uppercase letter,
        and 1 number.
      </p>

      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

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

      <button onClick={() => navigate("/")}>
        Back to Login
      </button>
    </div>
  );
}