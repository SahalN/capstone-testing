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
  dateOfBirth: {
    type: Date,
    required: true,
  },
  age: {
    type: Number,
    default: null,
  },
  gender: {
    type: String,
    enum: ["male", "female", "other"],
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    default: "Created new account!",
  },
  results: [{ type: Schema.Types.ObjectId, ref: "Result" }],
});

// Middleware untuk menghitung umur sebelum menyimpan dokumen
userSchema.pre("save", function (next) {
  if (this.dateOfBirth) {
    const now = new Date();
    const birthDate = new Date(this.dateOfBirth);
    let age = now.getFullYear() - birthDate.getFullYear();
    const monthDiff = now.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && now.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    this.age = age;
  }
  next();
});

module.exports = mongoose.model("User", userSchema);
