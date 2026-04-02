const db = require("../db");

// ================= CREATE =================
exports.createRecord = async (req, res) => {
  try {
    const { amount, type, category, date, notes } = req.body;

    const amt = Number(amount);

    if (amount === undefined || amount === null || amount === "")
      return res.status(400).json({ message: "Amount is required" });

    if (isNaN(amt))
      return res.status(400).json({ message: "Amount must be a number" });

    if (amt <= 0)
      return res.status(400).json({ message: "Amount must be greater than 0" });

    if (!["INCOME", "EXPENSE"].includes(type))
      return res.status(400).json({ message: "Invalid type" });

    await db.execute(
      `INSERT INTO records (user_id,amount,type,category,date,notes)
       VALUES (?,?,?,?,?,?)`,
      [req.user.id, amt, type, category, date, notes],
    );

    res.json({ message: "Record created" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getRecords = async (req, res) => {
  try {
    const { type, category, startDate, endDate, page, limit, search } =
      req.query;

    console.log("ROLE:", req.user.role);

    // 🔒 block only viewer
    if (req.user.role === "VIEWER") {
      return res.status(403).json({ message: "Not allowed" });
    }

    let query = "SELECT * FROM records WHERE deleted_at IS NULL";
    let params = [];

    if (type) {
      query += " AND type=?";
      params.push(type);
    }

    if (category) {
      query += " AND category=?";
      params.push(category);
    }

    if (startDate && endDate) {
      query += " AND date BETWEEN ? AND ?";
      params.push(startDate, endDate);
    }

    if (search) {
      query += " AND category LIKE ?";
      params.push(`%${search}%`);
    }

    // pagination
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const offset = (pageNum - 1) * limitNum;

    query += ` LIMIT ${limitNum} OFFSET ${offset}`;

    const [rows] = await db.execute(query, params);

    res.json(rows);
  } catch (err) {
    console.log("ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};
// ================= UPDATE =================
exports.updateRecord = async (req, res) => {
  try {
    const { amount, type, category, date, notes } = req.body;

    const amt = Number(amount);

    if (amount !== undefined) {
      if (amount === "" || isNaN(amt) || amt <= 0)
        return res.status(400).json({ message: "Invalid amount" });
    }

    if (type && !["INCOME", "EXPENSE"].includes(type))
      return res.status(400).json({ message: "Invalid type" });

    const [result] = await db.execute(
      `UPDATE records 
       SET amount=?, type=?, category=?, date=?, notes=? 
       WHERE id=?`,
      [amt, type, category, date, notes, req.params.id],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Record not found" });
    }

    res.json({ message: "Updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= DELETE =================
exports.deleteRecord = async (req, res) => {
  try {
    const [result] = await db.execute(
      "UPDATE records SET deleted_at=NOW() WHERE id=?",
      [req.params.id],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Record not found" });
    }

    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
