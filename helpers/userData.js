/** @format */

const User = require("../models/user");

const getUserData = (userId) => {
  console.log(userId);
  return User.findById(userId)
    .select("age weight gender")
    .then((user) => {
      if (!user) {
        const error = new Error("User not found.");
        error.statusCode = 404;
        throw error;
      }
      return {
        age: user.age,
        weight: user.weight,
        gender: user.gender,
      };
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      throw err;
    });
};

module.exports = getUserData;
