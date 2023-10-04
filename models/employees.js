const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    required: true,
  },
  myReview: {
    type: Array,
    default: [],
  },
  pendingReview: {
    type: Array,
    default: [],
  },
  oldReview: {
    type: Array,
    default: [],
  },
});

const Employee = mongoose.model("Employee", employeeSchema);

module.exports = Employee;
