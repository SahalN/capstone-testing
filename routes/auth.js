/** @format */

const express = require("express");
const { body } = require("express-validator");
const User = require("../models/user");
const authController = require("../controllers/auth");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.put(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("E-Mail address already exists.");
          }
        });
      })
      .normalizeEmail(),
    body("password").trim().isLength({ min: 5 }),
    body("username")
      .trim()
      .not()
      .isEmpty()
      .isLength({ max: 20 })
      .withMessage("Username must be no longer than 20 characters."),
    body("dateOfBirth")
      .isISO8601()
      .toDate()
      .withMessage("Please enter a valid date of birth."),
    body("weight")
      .isFloat({ min: 0 })
      .withMessage("Please enter a valid weight."),
    body("gender")
      .isIn(["male", "female", "other"])
      .withMessage("Please enter a valid gender."),
  ],
  authController.signup
);

router.post("/login", authController.login);

router.put(
  "/profile",
  [
    body("username")
      .optional()
      .trim()
      .not()
      .isEmpty()
      .withMessage("Username cannot be empty."),
    body("age")
      .optional()
      .isInt({ min: 0 })
      .withMessage("Please enter a valid age."),
    body("gender")
      .optional()
      .isString()
      .isIn(["male", "female", "other"])
      .withMessage("Please enter a valid gender."),
    body("weight")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("Please enter a valid weight."),
  ],
  isAuth,
  authController.updateProfile
);

router.get("/profile", isAuth, (req, res, next) => {
  const userId = req.userId;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        const error = new Error("User not found.");
        error.statusCode = 404;
        throw error;
      }
      // Hitung ulang umur jika tanggal lahir tersedia
      if (user.dateOfBirth) {
        const today = new Date();
        const birthDate = new Date(user.dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (
          monthDiff < 0 ||
          (monthDiff === 0 && today.getDate() < birthDate.getDate())
        ) {
          age--;
        }
        user.age = age;
      }

      let message = "User information retrieved successfully.";
      // Jika age dan gender kosong, tandai bahwa informasi belum diperbarui
      if (user.age === undefined || user.gender === undefined) {
        message =
          "User information retrieved successfully. Please update your profile.";
      }

      res.status(200).json({ error: false, message: message, user: user });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
});

module.exports = router;
