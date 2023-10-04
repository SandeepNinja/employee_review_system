const Employee = require("../models/employees");

module.exports.signup = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  return res.render("signUp", {
    layout: false,
  });
};

module.exports.createNewEmployee = async function (req, res) {
  //   if (req.isAuthenticated) {
  //     return res.redirect("/");
  //   }

  // without passport ---------------------------
  //   if (req.body.password != req.body.confirm_password) {
  //     return res.redirect("back");
  //   }
  //   -----bu mongoDB ------
  try {
    console.log("creating");
    let employee = await Employee.findOne({ email: req.body.email });
    if (!employee) {
      const newEmp = await Employee.create(req.body);
      console.log("newEmp", newEmp);
      return res.redirect("/signin");
    } else {
      console.error("--> user already available");
      return res.redirect("back");
    }
  } catch (err) {
    console.log("error::", err);
    return res.redirect("back");
  }
  //   ---------by local data ----------
  //   const user = req.employees.find(
  //     (employee) => employee.email == req.body.email
  //   );
  //   if (!user) {
  //     delete req.body.confirm_password;
  //     console.log("user::", req.body);
  //     const newUser = {
  //       id: Date.now(),
  //       ...req.body,
  //       myReview: [],
  //       pendingReview: [],
  //       oldReview: [],
  //     };
  //     console.log("newUser::", newUser);
  //     req.employees.push(newUser);
  //   }
  //   console.log(req.employees);
  //   return res.redirect("back");
};

// singn-in page
module.exports.signIn = function (req, res) {
  //   console.log("**req.isAuthenticated**", req.isAuthenticated());
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  return res.render("signIn", {
    layout: false,
  });
};

// create session after login
module.exports.login = async function (req, res) {
  // -----------cookie local without passport
  //   console.log(req.body);
  //   try {
  //     const employee = await Employee.findOne({ email: req.body.email });
  //     // handle user found
  //     if (employee) {
  //       if (employee.password != req.body.password) {
  //         console.log("userId or Password wrong");
  //         return res.redirect("/signin");
  //       }
  //       res.cookie("user_id", employee.id);
  //       return res.redirect("/");
  //     } else {
  //       console.log("employee not found");
  //       return res.redirect("/signin");
  //     }
  //   } catch (err) {
  //     console.log("error::", err);
  //     return res.redirect("/signin");
  //   }
  // --------local login check -----
  //   const user = req.employees.find(
  //     (employee) => employee.email == req.body.email
  //   );
  //   if (user) {
  //   console.log(user);
  //   console.log("***login");
  req.flash("success", "Logged in successfully");
  return res.redirect("/");
  //   }
  //   return res.render("signIn");
};

module.exports.destroySession = function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "Logged-out in successfully");
    res.redirect("/");
  });
};
