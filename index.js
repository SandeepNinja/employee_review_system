const express = require("express");
const port = 8000;
const cookieParser = require("cookie-parser");
const app = express();
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
const db = require("./config/mongoose");
// use session cookie
const session = require("express-session");
const passport = require("passport");
const passportLocal = require("./config/passport-local-strategy");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const customWare = require("./config/middleware");

app.use(express.urlencoded());
app.use(cookieParser());

app.use(expressLayouts);

// app.use((req, res, next) => {
//   console.log("req.session::", req.session);
//   console.log("req.user::", req.user);
//   next();
// });
//extract style and script from sub pages into the layout
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

app.use(express.static("./assets"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
const URL =
  "mongodb+srv://codewithsandeep140:aEA9Ae4EFGvY1tvB@codewithsandeep.k2kfyxa.mongodb.net/?retryWrites=true&w=majority";
app.use(
  session({
    name: "reviewSystem",
    //TODO change the secret before deployment in production mode
    secret: "blahsomething",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 100,
    },
    store: MongoStore.create(
      {
        mongoUrl: URL,
        autoRemove: "disabled",
      },
      function (err) {
        console.log(err || "connect-mongodb setup ok");
      }
    ),
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);
app.use(flash());
app.use(customWare.setFlash);

app.use("/", require("./routes"));

app.listen(port, function (err) {
  if (err) {
    console.log("error in starting server::", err);
  }
  console.log("!Yup !My Express server is running on port: ", port);
});
