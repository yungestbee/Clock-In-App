const express = require("express");
const { getReports } = require("../controllers/reportsController");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/reports", authMiddleware.authenticateUser, getReports);

module.exports = router;
