const express = require("express");
const router = express.Router();
const passport = require("passport");

const homeController = require("../controllers/home_Controller");
const loginController = require("../controllers/login_controller");

router.get("/", passport.checkAuthentication, homeController.homePage);
router.get("/signup", loginController.signup);
router.get("/signIn", loginController.signIn);
router.get("/signout", loginController.destroySession);
router.get("/assign", passport.checkAuthentication, homeController.assign);
router.post(
  "/assign_review",
  passport.checkAuthentication,
  homeController.assign_review
);
router.post(
  "/addContentInReview/:id",
  passport.checkAuthentication,
  homeController.addContentInReview
);
router.get("/employee", passport.checkAuthentication, homeController.employee);
router.post(
  "/updateemployee/:id",
  passport.checkAuthentication,
  homeController.updateEmployee
);

router.get(
  "/deleteEmployee/:id",
  passport.checkAuthentication,
  homeController.deleteEmployee
);

router.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/signin" }),
  loginController.login
);
router.post("/createNewEmployee", loginController.createNewEmployee);

module.exports = router;
