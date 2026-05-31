const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

app.post("/register", (req, res) => {
  const { email, password } = req.body;

  db.run(
    "INSERT INTO users(email,password) VALUES (?,?)",
    [email, password],
    function (err) {
      if (err) {
        return res.status(400).json({
          message: "User already exists"
        });
      }

      res.json({
        success: true
      });
    }
  );
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.get(
    "SELECT * FROM users WHERE email = ?",
    [email],
    (err, user) => {

      if (!user) {
        return res.status(401).json({
          message: "User not found"
        });
      }

      if (user.password !== password) {
        return res.status(401).json({
          message: "Wrong password"
        });
      }

      res.json({
        success: true
      });
    }
  );
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});