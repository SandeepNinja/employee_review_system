const mongoose = require("mongoose");

const URL =
  "mongodb+srv://codewithsandeep140:aEA9Ae4EFGvY1tvB@codewithsandeep.k2kfyxa.mongodb.net/?retryWrites=true&w=majority";
// mongoose.connect("mongodb://localhost:27017/Employee_review_system");
mongoose.connect(URL);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "Error to connect MongoDb"));

db.once("open", function () {
  console.log("connected to database :: MongoDB");
});

module.exports = db;
