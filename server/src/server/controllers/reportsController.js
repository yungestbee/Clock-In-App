const ClockIn = require("../../models/clockIn");
const Instructor = require("../../models/user"); // Import Instructor model

const getReports = async (req, res) => {
  try {
    const { startDate, endDate, instructorName } = req.query;
    let query = {};

    // Filter by date range if provided
    if (startDate && endDate) {
      query.timestamp = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    // If instructorName is provided, find the instructor's ID
    if (instructorName) {
      console.log(instructorName);
      if (!instructorName || instructorName.trim() === "") {
        return res.status(400).json({ message: "Instructor name is required" });
      }
      const instructorNameTrimmed = instructorName.trim();
      const instructor = await Instructor.findOne({
        name: new RegExp(instructorNameTrimmed, "i"),
      });

      console.log(instructor);
      if (!instructor) {
        return res.status(404).json({ message: "Instructor not found" });
      }
      query.instructor = instructor._id;
    }

    // Fetch reports with populated instructor details

    //   const reports = await ClockIn.find({});

      console.log({ user: query.instructor });
      const reports = await ClockIn.find({ instructor: query.instructor }).populate("instructor");

    return res.status(200).json(reports);
  } catch (error) {
    console.error("Error fetching reports:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getReports };
