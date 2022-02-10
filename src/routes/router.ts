const express = require("express");
const router = express.Router();
const passport = require("passport");

let userProfile;

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/success-google",
    failureRedirect: "/error",
  })
);

router.get("/success-google", (req, res) => res.send(req.user.emails[0].value));

router.get(
  "/auth/facebook",
  passport.authenticate("facebook", { scope: "email" })
);

router.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "/success-facebook",
    failureRedirect: "/error",
  })
);

router.get("/success-facebook", (req, res) =>
  res.send(req.user.emails[0].value)
);

router.get("/error", function (req, res) {
  res.redirect("/error");
});

router.get("/error", (req, res) => res.send("error logging in"));

router.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});

module.exports = router;
