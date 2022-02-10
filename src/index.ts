import "reflect-metadata";
import { createConnection } from "typeorm";
const routes = require("./routes/router");

createConnection()
  .then(async (connection) => {
    const express = require("express"),
      passport = require("passport"),
      FacebookStrategy = require("passport-facebook").Strategy,
      GoogleStrategy = require("passport-google-oauth").OAuth2Strategy,
      session = require("express-session"),
      cookieParser = require("cookie-parser"),
      bodyParser = require("body-parser"),
      config = require("./config/config"),
      app = express();

    app.use(bodyParser.json());
    app.use(cookieParser());
    app.use(
      session({
        resave: false,
        saveUninitialized: false,
        secret: "SECRET",
      })
    );
    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser(function (user, done) {
      done(null, user);
    });

    passport.deserializeUser(function (obj, done) {
      done(null, obj);
    });

    app.use(routes);

    passport.use(
      new FacebookStrategy(
        {
          clientID: config.facebook_api_key,
          clientSecret: config.facebook_api_secret,
          callbackURL: config.facebook_callback_url,
          profileFields: ["emails"],
        },
        function (accessToken, refreshToken, profile, done) {
          return done(null, profile);
        }
      )
    );

    passport.use(
      new GoogleStrategy(
        {
          clientID: config.google_client_id,
          clientSecret: config.google_client_secret,
          callbackURL: config.google_callback_url,
        },
        function (accessToken, refreshToken, profile, done) {
          return done(null, profile);
        }
      )
    );

    app.listen(3000);

    console.log(
      "Express server has started on port 3000. Open http://localhost:3000/users to see results"
    );
  })
  .catch((error) => console.log(error));
