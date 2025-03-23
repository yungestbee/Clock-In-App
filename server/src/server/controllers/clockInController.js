const ClockIn = require("../../models/clockIn");
// const Instructor = require("../../models/user");

// // Define the allowed radius for clock-in (e.g., 500 meters)
// const ALLOWED_RADIUS = 500; // in meters

// // Function to calculate distance between two coordinates (Haversine formula)
// const calculateDistance = (lat1, lon1, lat2, lon2) => {
//   const R = 6371e3; // Earth radius in meters
//   const toRad = (angle) => (angle * Math.PI) / 180;

//   const dLat = toRad(lat2 - lat1);
//   const dLon = toRad(lon2 - lon1);
//   const a =
//     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//     Math.cos(toRad(lat1)) *
//       Math.cos(toRad(lat2)) *
//       Math.sin(dLon / 2) *
//       Math.sin(dLon / 2);

//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   return R * c; // Distance in meters
// };

// // Clock-in function
// const clockIn = async (req, res) => {
//   try {
//     const { latitude, longitude, address } = req.body;
//     const instructorId = req.user.id; // Assuming user ID is stored in JWT

//     // Fetch instructor details
//     const instructor = await Instructor.findById(instructorId);
//     if (!instructor)
//       return res.status(404).json({ message: "Instructor not found" });

//     // Check if the instructor has a registered school location
//     if (
//       !instructor.schoolLocation ||
//       !instructor.schoolLocation.latitude ||
//       !instructor.schoolLocation.longitude
//     ) {
//       return res
//         .status(400)
//         .json({ message: "School location is not set for this instructor" });
//     }

//     // Calculate distance between instructor's school and their current location
//     const distance = calculateDistance(
//       instructor.schoolLocation.latitude,
//       instructor.schoolLocation.longitude,
//       latitude,
//       longitude
//     );

//     let clockInStatus = "Failed";
//     let reason = null;

//     if (distance <= ALLOWED_RADIUS) {
//       clockInStatus = "Success";
//     } else {
//       reason = "Out of designated school area";
//     }

//     // Save clock-in record
//     const clockInRecord = new ClockIn({
//       instructor: instructorId,
//       location: { latitude, longitude, address },
//       status: clockInStatus,
//       reason,
//     });

//     await clockInRecord.save();

//     return res.status(200).json({
//       message: `Clock-in ${clockInStatus}`,
//       status: clockInStatus,
//       reason,
//     });
//   } catch (error) {
//     console.error("Clock-in error:", error);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };

// module.exports = { clockIn };



// Clock-in function (Without Location Verification)
const clockIn = async (req, res) => {
  try {
    console.log("User from JWT:", req.user); // Debugging

    const { latitude, longitude, address } = req.body;
    const instructorId = req.user?.id; // Ensure req.user exists

    // Validate required fields
    if (!latitude || !longitude || !address) {
      return res.status(400).json({ message: "Location data is required" });
    }
    if (!instructorId) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    // Create and save the clock-in record
    const clockInRecord = new ClockIn({
      instructor: instructorId,
      location: { latitude, longitude, address },
      status: "Success",
      reason: null,
    });

    await clockInRecord.save();

    return res.status(200).json({
      message: "Clock-in successful",
      status: "Success",
    });
  } catch (error) {
    console.error("Clock-in error:", error.stack);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { clockIn };


