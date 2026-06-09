const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

function strongPassword(password) {
  return password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password);
}

function getUserToken(userId, callback) {
  db.get("SELECT vercel_token FROM users WHERE id = ?", [userId], (err, row) => {
    if (err || !row) return callback(null);
    callback(row.vercel_token);
  });
}

app.post("/register", async (req, res) => {
  const { email, password, token } = req.body;

  if (!email || !password || !token) {
    return res.json({ success: false, message: "All fields are required." });
  }

  if (!strongPassword(password)) {
    return res.json({
      success: false,
      message: "Password must be 8+ characters with 1 uppercase letter and 1 number."
    });
  }

  const hash = await bcrypt.hash(password, 10);

  db.run(
    "INSERT INTO users(email, password, vercel_token) VALUES (?, ?, ?)",
    [email, hash, token],
    (err) => {
      if (err) return res.json({ success: false, message: "User already exists." });
      res.json({ success: true, message: "Registered successfully." });
    }
  );
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
    if (err || !user) return res.json({ success: false, message: "Invalid login." });

    const match = await bcrypt.compare(password, user.password);

    if (!match) return res.json({ success: false, message: "Invalid login." });

    db.run("INSERT INTO sessions(user_id, is_logged_in) VALUES (?, 1)", [user.id]);

    res.json({ success: true, userId: user.id });
  });
});

app.post("/change-password", async (req, res) => {
  const { userId, oldPassword, newPassword } = req.body;

  if (!userId || !oldPassword || !newPassword) {
    return res.json({ success: false, message: "All password fields are required." });
  }

  if (!strongPassword(newPassword)) {
    return res.json({
      success: false,
      message: "New password must be 8+ characters with 1 uppercase letter and 1 number."
    });
  }

  db.get("SELECT * FROM users WHERE id = ?", [userId], async (err, user) => {
    if (err || !user) return res.json({ success: false, message: "User not found." });

    const match = await bcrypt.compare(oldPassword, user.password);

    if (!match) return res.json({ success: false, message: "Old password is wrong." });

    const hash = await bcrypt.hash(newPassword, 10);

    db.run("UPDATE users SET password = ? WHERE id = ?", [hash, userId], () => {
      res.json({ success: true, message: "Password updated." });
    });
  });
});

app.post("/update-token", (req, res) => {
  const { userId, token } = req.body;

  if (!userId || !token) {
    return res.json({ success: false, message: "Token is required." });
  }

  db.run(
    "UPDATE users SET vercel_token = ? WHERE id = ?",
    [token, userId],
    function (err) {
      if (err || this.changes === 0) {
        return res.json({ success: false, message: "Token update failed." });
      }

      res.json({ success: true, message: "Token updated." });
    }
  );
});

app.get("/user-settings/:userId", (req, res) => {
  db.get(
    "SELECT email, vercel_token FROM users WHERE id = ?",
    [req.params.userId],
    (err, user) => {
      if (err || !user) return res.json({ success: false, message: "User not found." });

      res.json({
        success: true,
        user: {
          email: user.email,
          tokenPreview: user.vercel_token.slice(0, 6) + "..."
        }
      });
    }
  );
});

app.get("/vercel/projects/:userId", (req, res) => {
  getUserToken(req.params.userId, async (token) => {
    if (!token) return res.json({ success: false, message: "No Vercel token found." });

    try {
      const response = await fetch("https://api.vercel.com/v9/projects", {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await response.json();

      res.json({
        success: response.ok,
        projects: data.projects || [],
        message: data.error?.message || ""
      });
    } catch {
      res.json({ success: false, message: "Could not connect to Vercel." });
    }
  });
});

app.get("/vercel/deployments/:userId", (req, res) => {
  getUserToken(req.params.userId, async (token) => {
    if (!token) return res.json({ success: false, message: "No Vercel token found." });

    try {
      const response = await fetch("https://api.vercel.com/v6/deployments", {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await response.json();

      res.json({
        success: response.ok,
        deployments: data.deployments || [],
        message: data.error?.message || ""
      });
    } catch {
      res.json({ success: false, message: "Could not connect to Vercel." });
    }
  });
});

/* Week 4 CRUD: project notes */

app.get("/project-notes/:userId", (req, res) => {
  db.all(
    "SELECT * FROM project_notes WHERE user_id = ?",
    [req.params.userId],
    (err, rows) => {
      if (err) return res.json({ success: false, message: "Failed to load notes." });
      res.json({ success: true, notes: rows });
    }
  );
});

app.post("/project-notes", (req, res) => {
  const { userId, projectId, projectName, note, status } = req.body;

  if (!userId || !projectId || !projectName || !note) {
    return res.json({ success: false, message: "Missing note information." });
  }

  db.run(
    "INSERT INTO project_notes(user_id, project_id, project_name, note, status) VALUES (?, ?, ?, ?, ?)",
    [userId, projectId, projectName, note, status || "Active"],
    function (err) {
      if (err) return res.json({ success: false, message: "Failed to add note." });

      res.json({
        success: true,
        note: {
          id: this.lastID,
          user_id: userId,
          project_id: projectId,
          project_name: projectName,
          note,
          status: status || "Active"
        }
      });
    }
  );
});

app.put("/project-notes/:noteId", (req, res) => {
  const { note, status } = req.body;

  if (!note) return res.json({ success: false, message: "Note cannot be empty." });

  db.run(
    "UPDATE project_notes SET note = ?, status = ? WHERE id = ?",
    [note, status || "Active", req.params.noteId],
    function (err) {
      if (err || this.changes === 0) {
        return res.json({ success: false, message: "Failed to edit note." });
      }

      res.json({ success: true, message: "Note updated." });
    }
  );
});

app.delete("/project-notes/:noteId", (req, res) => {
  db.run("DELETE FROM project_notes WHERE id = ?", [req.params.noteId], function (err) {
    if (err || this.changes === 0) {
      return res.json({ success: false, message: "Failed to delete note." });
    }

    res.json({ success: true, message: "Note deleted." });
  });
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});