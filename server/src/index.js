require("dotenv").config();
const express = require("express");
const authRoutes = require("./server/routes/auth.routes");
const clockInRoutes = require("./server/routes/clockInRoutes")
const connectDB = require("./database/db");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const route = require("./server/routes/auth.routes")
const reportRoutes = require("./server/routes/reportsRoutes")
const { deleteOldReports } = require("./server/controllers/reportsController");


const app = express();

connectDB();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));
app.get("/", (req, res) => {
  res.status(200).json({ status: 200, message: "System is healthy" });
});

app.use(route);

app.use("/api/v1/clock", clockInRoutes);

app.use("/api/v1/auth", authRoutes);

app.use("/api/v1/report", reportRoutes);

const { lookup } = require("dns").promises;
const os = require("os");

const PORT = process.env.PORT || 2300;
app.enable("trust proxy");

app.use((err, req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});


// Run daily cleanup of old reports
setInterval(() => {
  deleteOldReports();
}, 24 * 60 * 60 * 1000); // Runs every 24 hours

app.listen(PORT, async () => {
  const IP = (await lookup(os.hostname())).address;
  console.log(
    `Server started at ${
      process.env.NODE_ENV === "development" ? "http" : "https"
    }://${IP}:${PORT}`
  );
});

module.exports = app;





