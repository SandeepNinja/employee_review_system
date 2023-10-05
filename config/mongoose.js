const mongoose = require("mongoose");

const URL = process.env.MONGODB_URL;

// mongoose.connect("mongodb://localhost:27017/Employee_review_system");
mongoose.connect(URL);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "Error to connect MongoDb"));

db.once("open", function () {
  console.log("connected to database :: MongoDB");
});

module.exports = db;
