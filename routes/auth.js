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
    body("username").trim().not().isEmpty(),
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

      let message = "User information retrieved successfully.";
      // Jika age dan gender kosong, tandai bahwa informasi belum diperbarui
      if (user.age === undefined || user.gender === undefined) {
        message =
          "User information retrieved successfully. Please update your profile.";
      }

      res.status(200).json({
        message: message,
        user: user,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
});

module.exports = router;
