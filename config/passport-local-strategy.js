const passport = require("passport");

const LocalStrategy = require("passport-local").Strategy;

const Employee = require("../models/employees");

// authentication using passport
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passReqToCallback: true,
    },
    async function (req, email, password, done) {
      // find the employee and exteblish a strategy

      try {
        const user = await Employee.findOne({ email: email });
        if (!user || user.password != password) {
          //   console.log("***Invalid username/Password");
          req.flash("error", "Invalid username/Password");
          return done(null, false);
        }
        // console.log("*** LocalStrategy working");
        return done(null, user);
      } catch (err) {
        req.flash("error", err);
        // console.log("***error in passport user");
        return done(err);
      }
    }
  )
);

// serializeing the user to decide which key is to be kept in the cookies
passport.serializeUser(function (user, done) {
  //   console.log("***serializeUser working::");
  done(null, user.id);
});

// deserialize the user from the key in the cookie
passport.deserializeUser(async function (id, done) {
  try {
    const user = await Employee.findById(id);
    // console.log("***DeserializeUser working");
    return done(null, user);
  } catch (err) {
    console.log("Error in finding user --> passport Deserialize");
    return done(err);
  }
});

passport.checkAuthentication = function (req, res, next) {
  // if the user is signed in, then pass on the request to the next function(controller's action)
  if (req.isAuthenticated()) {
    // console.log("***checkAuthenticated");
    return next();
  }
  // if user is not signed in
  return res.redirect("/signin");
};

passport.setAuthenticatedUser = function (req, res, next) {
  if (req.isAuthenticated()) {
    // console.log("***setAuthenticated::", req.user.id);
    // req.user contains the current signed in user from the session cookie and we are just sending this to the locals for the views
    res.locals.user = req.user;
  }
  next();
};
