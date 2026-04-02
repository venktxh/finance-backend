const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const role = require("../middleware/role");
const {
  getUsers,
  updateRole,
  updateStatus,
} = require("../controllers/userController");

router.get("/", auth, role("ADMIN"), getUsers);
router.patch("/:id/role", auth, role("ADMIN"), updateRole);
router.patch("/:id/status", auth, role("ADMIN"), updateStatus);

module.exports = router;
