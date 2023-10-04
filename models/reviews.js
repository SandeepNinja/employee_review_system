const mongoose = require("mongoose");
const Employee = require("../models/employees");

const reviewSchema = new mongoose.Schema({
  reviewer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Employee,
  },
  recipient_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Employee,
  },
  content: {
    type: String,
    default: "Enter review comments",
  },
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
