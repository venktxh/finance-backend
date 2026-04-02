const db = require("../db");

exports.getUsers = async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT id,name,email,role,status FROM users",
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!["VIEWER", "ANALYST", "ADMIN"].includes(role))
      return res.status(400).json({ message: "Invalid role" });

    await db.execute("UPDATE users SET role=? WHERE id=?", [
      role,
      req.params.id,
    ]);

    res.json({ message: "Role updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["ACTIVE", "INACTIVE"].includes(status))
      return res.status(400).json({ message: "Invalid status" });

    await db.execute("UPDATE users SET status=? WHERE id=?", [
      status,
      req.params.id,
    ]);

    res.json({ message: "Status updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
