const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl, isLoggedIn } = require("../middleware.js");
const userController = require("../controllers/users.js");

router.route("/signup")
.get(userController.renderSignupForm)
.post(wrapAsync(userController.signup));

router.route("/login")
.get(userController.renderLoginForm)
.post(
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  userController.login
);

// Profile Route
router.get("/profile", isLoggedIn, userController.profile);

// Logout Route
router.get("/logout", userController.logout);

router.get("/forgot-password", (req, res) => {
    res.render("users/forgot.ejs", {
        hideNavbar: true
    });
});
router.post("/forgot-password", (req, res) => {
    res.send("OTP Send Route Working");
});
module.exports = router;