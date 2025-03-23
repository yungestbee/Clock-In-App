// const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USERNAME,
//     pass: process.env.EMAIL_PASSWORD,
//   },
// });

// function sendEmailNotification(mailOptions) {
//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       console.error("Error sending email:", error);
//     } else {
//       console.log("Email sent: ", info.response);
//     }
//   });
// }

// module.exports = sendEmailNotification;

const User = require("../../models/user");
const jwt = require("jsonwebtoken");

class AuthMiddleware {
    static async authenticateUser(req, res, next) {
    try {
      const token = req.cookies.logToken;
      console.log(token)

      if (!token) {
        return res
          .status(401)
          .json({ message: "No Token, authorization denied, Login again" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      let user = await User.findById(decoded.id); // ✅ FIXED

      if (!user) {
        return res.status(401).json({ message: "Token is not valid" });
      }

      req.user = user;

      next();
    } catch (err) {
      console.error("Auth Middleware Error:", err.message);
      return res.status(401).json({ msg: "Token is not valid" });
    }
  }
}

module.exports = AuthMiddleware;
