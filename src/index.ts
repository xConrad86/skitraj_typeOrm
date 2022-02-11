import "reflect-metadata";
import { createConnection } from "typeorm";
import routes from "./routes/routes";
import config from "./config/config";
//import {User} from "./entity/User";

createConnection()
  .then(async (connection) => {
    const express = require("express"),
      passport = require("passport"),
      FacebookStrategy = require("passport-facebook").Strategy,
      GoogleStrategy = require("passport-google-oauth").OAuth2Strategy,
      session = require("express-session"),
      bodyParser = require("body-parser"),
      config = require("./config/config"),
      app = express();
    app.use(bodyParser.json());
    app.use("/", routes);
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
        secret: "rb96s&Ra{7*Ur>q=",
      })
    );

    // start express server
    app.listen(3000);
    app.use(passport.initialize());
    app.use(passport.session());

    // facebook login configuration
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

    // gooogle login configuration
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

    // determines which data of the user object should be stored in a session
    passport.serializeUser(function (user, done) {
      done(null, user);
    });

    // used to retrieve user object from a session
    passport.deserializeUser(function (obj, done) {
      done(null, obj);
    });

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
