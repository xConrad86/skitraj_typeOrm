import "reflect-metadata";
import { createConnection } from "typeorm";
import { Request, Response } from "express";
import { Routes } from "./routes";
import { User } from "./entity/User";

const express = require("express"),
  passport = require("passport"),
  FacebookStrategy = require("passport-facebook").Strategy,
  GoogleStrategy = require("passport-google-oauth").OAuth2Strategy,
  session = require("express-session"),
  cookieParser = require("cookie-parser"),
  bodyParser = require("body-parser"),
  config = require("./config/config"),
  app = express();

createConnection()
  .then(async (connection) => {
    // create express app
    const app = express();
    app.set("views", __dirname + "/src/views");
    app.set("view engine", "ejs");
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(
      session({
        resave: false,
        saveUninitialized: true,
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

    let userProfile: Object;

    app.get("/", function (req, res) {
      res.render("index", { user: req.user });
    });

    app.get("/google-success", (req, res) => res.send(userProfile));
    app.get("/facebook-success", (req, res) => res.send(userProfile));
    app.get("/error", (req, res) => res.send("error logging in"));

    passport.use(
      new FacebookStrategy(
        {
          clientID: config.facebook_api_key,
          clientSecret: config.facebook_api_secret,
          callbackURL: config.facebook_callback_url,
          profileFields: ["emails"],
        },
        function (accessToken, refreshToken, profile, done) {
          userProfile = profile;
          return done(null, userProfile);
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
          userProfile = profile;
          return done(null, userProfile);
        }
      )
    );

    app.get("/auth/facebook", passport.authenticate("facebook"));

    app.get(
      "/auth/facebook/callback",
      passport.authenticate("facebook", {
        successRedirect: "/facebook-success",
        failureRedirect: "/error",
      })
    );

    app.get(
      "/auth/google",
      passport.authenticate("google", { scope: ["profile", "email"] })
    );

    app.get(
      "/auth/google/callback",
      passport.authenticate("google", {
        failureRedirect: "/error",
      })
    );

    app.get("/error", function (req, res) {
      res.redirect("/error");
    });

    app.get("/logout", function (req, res) {
      req.logout();
      res.redirect("/");
    });

    // register express routes from defined application routes
    Routes.forEach((route) => {
      (app as any)[route.method](
        route.route,
        (req: Request, res: Response, next: Function) => {
          const result = new (route.controller as any)()[route.action](
            req,
            res,
            next
          );
          if (result instanceof Promise) {
            result.then((result) =>
              result !== null && result !== undefined
                ? res.send(result)
                : undefined
            );
          } else if (result !== null && result !== undefined) {
            res.json(result);
          }
        }
      );
    });

    // start express server
    app.listen(3000);

    // insert new users for test
    //   await connection.manager.save(connection.manager.create(User, {
    //       firstName: "Timber",
    //       lastName: "Saw",
    //       age: 27
    //   }));
    //   await connection.manager.save(connection.manager.create(User, {
    //        firstName: "Phantom",
    //       lastName: "Assassin",
    //       age: 24
    //   }));

    console.log(
      "Express server has started on port 3000. Open http://localhost:3000/users to see results"
    );
  })
  .catch((error) => console.log(error));
