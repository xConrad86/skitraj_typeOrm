const express = require("express");
const router = express.Router();
const passport = require("passport");
import { getRepository } from "typeorm";
import { User } from "../entity/User";

// homepage
router.get("/", (req, res) => {
  res.send("Hello world!");
});

// get all users
router.get("/users", async (req, res) => {
  const userRepository = getRepository(User);
  res.send(JSON.stringify(await userRepository.find()));
});

// get particular user by id
router.get("/users/:userId", async (req, res) => {
  const userRepository = getRepository(User);
  res.send(JSON.stringify(await userRepository.findOne(req.params.userId)));
});

// create new user
router.post("/users", async (req, res) => {
  const userRepository = getRepository(User);
  const { email } = req.body;
  const user = new User();

  user.email = email;

  try {
    await userRepository.save(user);
    res.send("User created");
  } catch (e) {
    res.send("Username already in use");
    return;
  }
});

// update particular user
router.put("/users/:userId", async (req, res) => {
  const userRepository = getRepository(User);
  res.send(
    JSON.stringify(
      await userRepository.update({ id: req.params.userId }, req.body)
    )
  );
});

// delete particular user
router.delete("/users/:userId", async (req, res) => {
  const userRepository = getRepository(User);
  res.send(JSON.stringify(await userRepository.delete(req.params.userId)));
});

// order email and profile from google auth
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// callback function from google
router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    // user successfully authenticated
    successRedirect: "/success-google",
    // can't authenticate
    failureRedirect: "/error",
  })
);

// prints successfully authenticated user in a browser
router.get("/success-google", async (req, res) => {
  const userRepository = getRepository(User);

  const user: User = await userRepository.findOne({
    email: req.user.emails[0].value,
  });

  if (user !== undefined) {
    // user already created, we can log in him
    res.send("Logging in...");
  } else {
    // user does not exist, create him and log in afterwards
    const user = new User();
    user.email = req.user.emails[0].value;
    await userRepository.save(user);
    res.send("I had to create a user first. Logging in...");
  }
});

// order email and profile from facebook
router.get(
  "/auth/facebook",
  passport.authenticate("facebook", { scope: "email" })
);

// callback function from facebook
router.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    // user successfully authenticated
    successRedirect: "/success-facebook",
    // can't authenticate
    failureRedirect: "/error",
  })
);

// prints successfully authenticated user in a browser
router.get("/success-facebook", async (req, res) => {
  const userRepository = getRepository(User);

  const user: User = await userRepository.findOne({
    email: req.user.emails[0].value,
  });

  if (user !== undefined) {
    // user already created, we can log in him
    res.send("Logging in...");
  } else {
    // user does not exist, create him and log in afterwards
    const user = new User();
    user.email = req.user.emails[0].value;
    await userRepository.save(user);
    res.send("I had to create a user first. Logging in...");
  }
});

// prints error message in a browser, in case of authentication error
router.get("/error", (req, res) => res.send("error logging in"));

// logout route, redirects to homepage
router.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});

module.exports = router;
