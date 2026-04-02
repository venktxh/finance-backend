const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const {
  summary,
  categoryTotals,
  monthlyTrends,
  recent,
} = require("../controllers/dashboardController");

router.get("/summary", auth, summary);
router.get("/category", auth, categoryTotals);
router.get("/trends", auth, monthlyTrends);
router.get("/recent", auth, recent);

module.exports = router;
