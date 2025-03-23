const express = require("express");
const { clockIn } = require("../controllers/clockInController");
const authMiddleware = require("../middlewares/auth.middleware"); // Ensure user is logged in

const router = express.Router();

router.post("/clock-in", authMiddleware.authenticateUser, clockIn);

module.exports = router;
