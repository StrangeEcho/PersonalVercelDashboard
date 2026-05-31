import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate()

  async function register() {

    await fetch(
      "http://localhost:5000/register",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json"
        },
        body: JSON.stringify({
          email,
          password
        })
      }
    );

    alert(`Sucessfully registered email: ${email}`);
  }

  async function login() {

    const response = await fetch(
      "http://localhost:5000/login",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json"
        },
        body: JSON.stringify({
          email,
          password
        })
      }
    );

    const data = await response.json();

    navigate('/dashboard')
  }

  return (
    <div>
      <h1>Login Page</h1>

      <input
        placeholder="Email"
        onChange={(e) =>
          setEmail(e.target.value)}
      />

      <br />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) =>
          setPassword(e.target.value)}
      />

      <br />

      <button onClick={login}>
        Login
      </button>

      <button onClick={register}>
        Register
      </button>
    </div>
  );
}