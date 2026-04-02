const db = require("../db");

exports.summary = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT 
        SUM(CASE WHEN type='INCOME' THEN amount ELSE 0 END) AS totalIncome,
        SUM(CASE WHEN type='EXPENSE' THEN amount ELSE 0 END) AS totalExpense
      FROM records
      WHERE deleted_at IS NULL
    `);

    const totalIncome = rows[0].totalIncome || 0;
    const totalExpense = rows[0].totalExpense || 0;

    res.json({
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.categoryTotals = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT category, SUM(amount) total
      FROM records
      WHERE deleted_at IS NULL
      GROUP BY category
    `);

    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.monthlyTrends = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT DATE_FORMAT(date,'%Y-%m') month, SUM(amount) total
      FROM records
      WHERE deleted_at IS NULL
      GROUP BY month
    `);

    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.recent = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT * FROM records
      WHERE deleted_at IS NULL
      ORDER BY date DESC
      LIMIT 5
    `);

    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
