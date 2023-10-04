const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/Employee_review_system");

const db = mongoose.connection;

db.on("error", console.error.bind(console, "Error to connect MongoDb"));

db.once("open", function () {
  console.log("connected to database :: MongoDB");
});

module.exports = db;
