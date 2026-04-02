const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields required" });

    // 🔒 Password validation
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,13}$/;

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must be 8-13 chars, include uppercase, lowercase, number and special character",
      });
    }

    const hashed = await bcrypt.hash(password, 10);

    await db.execute("INSERT INTO users (name,email,password) VALUES (?,?,?)", [
      name,
      email,
      hashed,
    ]);

    res.json({ message: "User created" });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY")
      return res.status(400).json({ message: "Email exists" });

    res.status(500).json({ message: err.message });
  }
};
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [rows] = await db.execute("SELECT * FROM users WHERE email=?", [
      email,
    ]);

    if (!rows.length)
      return res.status(404).json({ message: "User not found" });

    const user = rows[0];

    if (user.status === "INACTIVE")
      return res.status(403).json({ message: "User inactive" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Wrong password" });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
