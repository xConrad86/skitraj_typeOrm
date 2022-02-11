const express = require("express");
const router = express.Router();
const passport = require("passport");
import { getRepository } from "typeorm";
import { User } from "../entity/User";

// api reference
const apiReference = `<pre>
GET:

  all users:
    url: /users

  user by id: /users/:id

  facebook (register,login):
    url: /auth/facebook

  google (register,login):
    url: /auth/google

POST:

  create user normal password:
    url: /users
    body: {'email': 'normal@gmail.com', password: '12345'}

  login normal password:
    url: /auth/normal-password
    body: {'email': 'normal@gmail.com', password: '12345'}

PUT:

  update user:
    url: /user/:id
    body: {'firstName': 'John'}

DELETE:

  delete user by id:
    url: /users/:id

  <pre>`;

// homepage
router.get("/", (req, res) => {
  res.send(apiReference);
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

module.exports = router;
