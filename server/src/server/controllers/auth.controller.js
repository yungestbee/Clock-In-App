const Instructor = require("../../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const errorHandler = require("../middlewares/handleErrors");
const random = require("random-string-generator");
require("dotenv").config();

class AuthController {
  static async register(req, res) {
    try {
      let { email, phone, name } = req.body;
      const password = random("upper");
      console.log(password);
      const salt = await bcrypt.genSalt(10);
      let hashedPassword = await bcrypt.hash(password, salt);

      let user = new Instructor({
        password: hashedPassword,
        email,
        phone,
        name
      });

      await user.save();
      console.log(user);

      return res.status(201).json({
        status: 200,
        message: "User created successfully",
        data: user,
      });
    } catch (error) {
      console.log(error);
      const errors = errorHandler.dbSchemaErrors(error);
      return res.status(403).json({ Message: errors });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;

      let user = await Instructor.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Invalid Credentials" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: "Invalid Credentials" });
      }

      // Ensure user ID exists
      let payload = { id: user._id || user.id };

      // Ensure JWT_SECRET is defined
      const secretKey = process.env.JWT_SECRET;
      if (!secretKey) {
        console.error("JWT_SECRET is not defined!");
        return res
          .status(500)
          .json({ msg: "Server error: Missing JWT secret" });
      }

      // Generate token correctly
      const token = jwt.sign(payload, secretKey, { expiresIn: "1h" });

      // Set cookie securely
      res.cookie("logToken", token, {
        maxAge: 1000 * 60 * 60,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Secure in production
      });

      return res.status(200).json({ mesaage: "Login Successful", token });
    } catch (err) {
      console.error(err.message);
      return res.status(500).send("Error logging in!");
    }
  }

  // static async changePassword(req, res) {
  //   const userId = req.user.id;
  //   const { currentPassword, newPassword } = req.body;

  //   try {
  //     let userExist;
  //     if (req.user.role === "restaurant") {
  //       userExist = await Restaurant.findById(userId);
  //     } else {
  //       userExist = await User.findById(userId);
  //     }
  //     if (!userExist)
  //       return res.status(404).json({ message: "User not found" });

  //     let verifyPassword = await bcrypt.compare(
  //       currentPassword,
  //       userExist.password
  //     );
  //     if (verifyPassword) {
  //       const salt = await bcrypt.genSalt();
  //       const hashedPassword = await bcrypt.hash(newPassword, salt);

  //       // Update the password for the correct model
  //       if (req.user.role === "restaurant") {
  //         await Restaurant.findByIdAndUpdate(
  //           userId,
  //           { password: hashedPassword },
  //           { new: true }
  //         );
  //       } else {
  //         await User.findByIdAndUpdate(
  //           userId,
  //           { password: hashedPassword },
  //           { new: true }
  //         );
  //       }
  //       return res
  //         .status(201)
  //         .json({ message: "Password changed successfully" });
  //     } else
  //       return res
  //         .status(403)
  //         .json({ message: "Current password is incorrect" });
  //   } catch (error) {
  //     console.log(error);
  //     return res.status(500).json({ message: "Error changing password" });
  //   }
  // }

  static async logout(req, res) {
    try {
      res.clearCookie("logToken");
      res.status(200).json({ message: "Logout Successful" });
    } catch (error) {
      console.error(error.message);
      return res.status(500).send("Error logging out!");
    }
  }
}

module.exports = AuthController;
