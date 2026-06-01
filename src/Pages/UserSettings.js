import { useEffect, useState } from "react";


export default function UserSettings() {
  const userId = localStorage.getItem("userId");

  const [email, setEmail] = useState("");
  const [tokenPreview, setTokenPreview] = useState("");
  const [newToken, setNewToken] = useState("");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSettings() {
      try {
        const response = await fetch(
          `http://localhost:5000/user-settings/${userId}`
        );

        const data = await response.json();

        if (!data.success) {
          setError(data.message || "Failed to load user settings.");
          return;
        }

        setEmail(data.user.email);
        setTokenPreview(data.user.tokenPreview);
      } catch (err) {
        setError("Could not connect to server.");
      }
    }

    if (userId) {
      loadSettings();
    }
  }, [userId]);

  async function updateToken() {
    try {
      setError("");
      setMessage("");

      const response = await fetch("http://localhost:5000/update-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId,
          token: newToken
        })
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.message || "Failed to update token.");
        return;
      }

      setMessage(data.message);
      setTokenPreview(`${newToken.slice(0, 6)}...`);
      setNewToken("");
    } catch (err) {
      setError("Could not connect to server.");
    }
  }

  async function changePassword() {
    try {
      setError("");
      setMessage("");

      const response = await fetch("http://localhost:5000/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId,
          oldPassword,
          newPassword
        })
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.message || "Failed to change password.");
        return;
      }

      setMessage(data.message);
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      setError("Could not connect to server.");
    }
  }

  return (
    <div className="settings-page">
      <h1>User Settings</h1>

      <p>This page lets you edit account settings for your personal Vercel dashboard.</p>

      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}

      <div className="settings-card">
        <h3>Account Info</h3>
        <p>Email: {email}</p>
        <p>Saved Vercel Token: {tokenPreview}</p>
      </div>

      <div className="settings-card">
        <h3>Update Vercel API Token</h3>

        <p>Paste a new Vercel API token below to replace the saved token.</p>

        <input
          type="password"
          placeholder="New Vercel API Token"
          value={newToken}
          onChange={(e) => setNewToken(e.target.value)}
        />

        <button onClick={updateToken}>Update Token</button>
      </div>

      <div className="settings-card">
        <h3>Change Password</h3>

        <p>Password must be 8+ characters, include 1 uppercase letter, and 1 number.</p>

        <input
          type="password"
          placeholder="Old password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="New password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <button onClick={changePassword}>Change Password</button>
      </div>
    </div>
  );
}