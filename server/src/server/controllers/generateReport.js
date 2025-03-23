const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");
const nodemailer = require("nodemailer");
const cron = require("node-cron");
const ClockIn = require("../models/clockIn");
const Instructor = require("../models/user");

const ADMIN_EMAIL = "admin@example.com"; // Replace with actual admin email

// Function to generate the PDF report
const generatePDF = async () => {
  try {
    const today = new Date().toISOString().split("T")[0]; // Get today's date
    const startDate = new Date(today + "T00:00:00Z");
    const endDate = new Date(today + "T23:59:59Z");

    // Get all instructors
    const instructors = await Instructor.find();

    // Get clock-ins for today
    const clockIns = await ClockIn.find({
      timestamp: { $gte: startDate, $lte: endDate },
    }).populate("instructor");

    // Create a dictionary of clock-ins by instructor ID
    const clockInMap = new Map();
    clockIns.forEach((clock) => {
      clockInMap.set(clock.instructor._id.toString(), clock);
    });

    // Create a PDF document
    const doc = new PDFDocument();
    const pdfPath = path.join(__dirname, "daily_report.pdf");
    const writeStream = fs.createWriteStream(pdfPath);
    doc.pipe(writeStream);

    // Add a title
    doc.fontSize(20).text("Daily Clock-In Report", { align: "center" });
    doc.moveDown(2);

    // Add table headers
    doc.fontSize(12).text("Instructor Name | Email | Location | Status | Time");
    doc.moveDown();

    // Loop through instructors and add details
    instructors.forEach((instructor) => {
      const clockIn = clockInMap.get(instructor._id.toString());
      const location = clockIn
        ? `${clockIn.location.address} (${clockIn.location.latitude}, ${clockIn.location.longitude})`
        : "No Clock-In";
      const status = clockIn ? clockIn.status : "Absent";
      const timestamp = clockIn
        ? new Date(clockIn.timestamp).toLocaleString()
        : "-";

      doc.text(
        `${instructor.name} | ${instructor.email} | ${location} | ${status} | ${timestamp}`
      );
      doc.moveDown();
    });

    doc.end();

    return new Promise((resolve, reject) => {
      writeStream.on("finish", () => resolve(pdfPath));
      writeStream.on("error", reject);
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
  }
};

// Function to send the email
const sendEmail = async (pdfPath) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "your-email@gmail.com", // Replace with your email
      pass: "your-email-password", // Replace with your email password
    },
  });

  const mailOptions = {
    from: "your-email@gmail.com",
    to: ADMIN_EMAIL,
    subject: "Daily Clock-In Report",
    text: "Attached is the daily clock-in report.",
    attachments: [{ filename: "daily_report.pdf", path: pdfPath }],
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully.");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

// Schedule the task to run at 9:00 PM daily
cron.schedule("0 21 * * *", async () => {
  console.log("Generating and sending daily report...");
  const pdfPath = await generatePDF();
  if (pdfPath) {
    await sendEmail(pdfPath);
  }
});

const { generatePDF, sendEmail } = require("./generateReport");

(async () => {
  const pdfPath = await generatePDF();
  if (pdfPath) {
    await sendEmail(pdfPath);
  }
})();


module.exports = { generatePDF, sendEmail };
