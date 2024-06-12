/** @format */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    default: null,
  },
  gender: {
    type: String,
    enum: ["male", "female", "other"],
    default: null,
  },
  status: {
    type: String,
    default: "Created new account!",
  },
  results: [{ type: Schema.Types.ObjectId, ref: "Result" }],
});

module.exports = mongoose.model("User", userSchema);
