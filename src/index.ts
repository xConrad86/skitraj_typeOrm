import "reflect-metadata";
import { createConnection } from "typeorm";
import Routes from "./routes/Routes";
import config from "./config/config";
import { Request, Response, NextFunction } from "express";

//import {User} from "./entity/User";

createConnection()
  .then(async (connection) => {
    const express = require("express"),
      passport = require("passport"),
      FacebookStrategy = require("passport-facebook").Strategy,
      GoogleStrategy = require("passport-google-oauth").OAuth2Strategy,
      session = require("express-session"),
      cookieParser = require("cookie-parser"),
      bodyParser = require("body-parser"),
      app = express();
    app.use(bodyParser.json());
    app.use(cookieParser());

    app.use(
      session({
        /* Forces the session to be saved back to the session store, even if the session was never modified during the request.
          Depending on your store this may be necessary, but it can also create race conditions where a client makes two parallel
          requests to your server and changes made to the session in one request may get overwritten when the other request ends,
          even if it made no changes (this behavior also depends on what store you’re using).
          The default value is true, but using the default has been deprecated, as the default will change in the future.
          Please research into this setting and choose what is appropriate to your use-case. Typically, you’ll want false. */
        resave: false,
        /* Forces a session that is “uninitialized” to be saved to the store. A session is uninitialized when it is new but not modified.
          Choosing false is useful for implementing login sessions, reducing server storage usage, or complying with laws that require
          permission before setting a cookie. Choosing false will also help with race conditions where a client makes multiple parallel
          requests without a session. The default value is true, but using the default has been deprecated, as the default will change
          in the future. Please research into this setting and choose what is appropriate to your use-case.
          Note if you are using Session in conjunction with PassportJS, Passport will add an empty Passport object to the session
          for use after a user is authenticated, which will be treated as a modification to the session, causing it to be saved.
          This has been fixed in PassportJS 0.3.0 */
        saveUninitialized: false,
        /* This is the secret used to sign the session ID cookie. This can be either a string for a single secret, or an array
          of multiple secrets. If an array of secrets is provided, only the first element will be used to sign the session ID cookie,
          while all the elements will be considered when verifying the signature in requests. The secret itself should be not easily parsed
          by a human and would best be a random set of characters. A best practice may include: The use of environment variables to store the secret,
          ensuring the secret itself does not exist in your repository.
          Periodic updates of the secret, while ensuring the previous secret is in the array. Using a secret that cannot be guessed will
          reduce the ability to hijack a session to only guessing the session ID (as determined by the genid option).*/
        secret: "SECRET",
      })
    );

    app.use(passport.initialize());
    app.use(passport.session());

    // determines which data of the user object should be stored in a session
    passport.serializeUser(function (user: Request, done: Function) {
      done(null, user);
    });

    // used to retrieve user object from a session
    passport.deserializeUser(function (obj: Request, done: Function) {
      done(null, obj);
    });

    // facebook login configuration
    passport.use(
      new FacebookStrategy(
        {
          clientID: config.facebook_api_key,
          clientSecret: config.facebook_api_secret,
          callbackURL: config.facebook_callback_url,
          profileFields: ["emails"],
        },
        function (profile: Object, done: Function) {
          return done(null, profile);
        }
      )
    );

    // gooogle login configuration
    passport.use(
      new GoogleStrategy(
        {
          clientID: config.google_client_id,
          clientSecret: config.google_client_secret,
          callbackURL: config.google_callback_url,
        },
        function (profile: Object, done: Function) {
          return done(null, profile);
        }
      )
    );
    app.use(function (req: Request, res: Response, next: NextFunction) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
      );
      res.header(
        "Access-Control-Allow-Methods",
        "PUT, PATCH, POST, GET, DELETE, OPTIONS"
      );
      next();
    });
    //routes
    app.use(Routes);

    // start express server
    app.listen(8000);

    console.log(
      "Express server has started on port 8000. Open http://localhost:8000/"
    );
  })
  .catch((error) => console.log(error));
