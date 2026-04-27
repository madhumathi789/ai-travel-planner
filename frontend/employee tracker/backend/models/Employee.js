const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  employeeId: String,
  fullName: String,
  designation: String,
  dob: Date,
  joiningDate: Date,
  ugQualification: String,
  pgQualification: String,
  department: String,
  gender: String,
  prevExpYears: Number,
  prevExpMonths: Number,
  prevExpDays: Number,
  age: Object,
  currentExperience: Object,
  totalExperience: Object,
  previousExperience: Object,
  photo: String
});

module.exports = mongoose.model("Employee", employeeSchema);
