const express = require("express");
require("dotenv").config();

const app = express();

const { apiLimiter } = require("./middleware/rateLimiter");

app.use(express.json());
app.use(apiLimiter);

app.use("/auth", require("./routes/auth"));
app.use("/users", require("./routes/users"));
app.use("/records", require("./routes/records"));
app.use("/dashboard", require("./routes/dashboard"));

app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Something went wrong" });
});

module.exports = app;
