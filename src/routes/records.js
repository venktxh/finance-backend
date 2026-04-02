const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const role = require("../middleware/role");

const {
  createRecord,
  getRecords,
  updateRecord,
  deleteRecord,
} = require("../controllers/recordsController");

router.post("/", auth, role("ADMIN"), createRecord);
router.get("/", auth, role("ADMIN", "ANALYST"), getRecords);
router.put("/:id", auth, role("ADMIN"), updateRecord);
router.delete("/:id", auth, role("ADMIN"), deleteRecord);

module.exports = router;
