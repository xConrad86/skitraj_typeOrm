import { getRepository } from "typeorm";
import { User } from "../entity/User";
import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import config from "../config/config";
import { validate } from "class-validator";
const nodemailer = require("nodemailer");
const passport = require("passport");

export default class AuthController {
  static externalAuthRequest = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    passport.passport.authenticate(request.params.authProvider);
  };
  static externalAuthCallback = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    passport.authenticate(request.params.authProvider, {
      successRedirect: `${request.params.authProvider}/login`,
      failureRedirect: "/error",
    });
  };

  static externalLogin = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    let { email } = request.emails[0].value;
    const userRepository = getRepository(User);
    let user: User;

    if (!email) {
      response.status(400).send();
      return;
    }

    try {
      user = await userRepository.findOneOrFail({ where: { email } });
    } catch (error) {
      response.status(401).send("User not found");
      return;
    }

    // sign JWT, valid for 1 hour
    const expiresIn = "1h";
    const token = jwt.sign(
      { user_id: user.id, email: user.email },
      config.jwtSecret,
      { expiresIn }
    );

    response.status(200).send({ token, expiresIn });
  };

  static login = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    let { email, password } = request.body;
    const userRepository = getRepository(User);
    let user: User;

    if (!(email && password)) {
      response.status(400).send();
      return;
    }

    try {
      user = await userRepository.findOneOrFail({ where: { email } });
    } catch (error) {
      response.status(401).send("User not found");
      return;
    }

    // check if encrypted password match
    if (!user.checkPasswordIsValid(password)) {
      response.status(401).send("Password is not valid");
      return;
    }

    // sign JWT, valid for 1 hour
    const expiresIn = "1h";
    const token = jwt.sign(
      { user_id: user.id, email: user.email },
      config.jwtSecret,
      { expiresIn }
    );

    response.status(200).send({ token, expiresIn });
  };

  static register = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    let { email, password, phone, birthday } = request.body;
    let birthday_parsed;
    let user = new User();
    //console.log(request, response);
    if (birthday) {
      try {
        birthday_parsed = new Date(Date.parse(birthday));
      } catch (error) {
        response
          .status(400)
          .send("Wrong date format. Should be 'YYYY-MM-DD'" + error.message);
        return;
      }
    }

    user.email = email;
    user.password = password;
    user.phone = phone;
    user.birthday = birthday_parsed;

    const errors = await validate(user);
    console.log(user, errors);
    if (errors.length > 0) {
      response.status(400).send(errors);
      return;
    }

    user.hashPassword();

    try {
      const userRepository = getRepository(User);
      await userRepository.save(user);
    } catch (e) {
      response.status(409).send("Email already in use" + e.message);
      return;
    }

    response.status(201).send("User created");
  };

  static changePassword = async (request: Request, response: Response) => {
    //Get ID from JWT
    const id = request.locals.jwtPayload.user_id;

    //Get parameters from the body
    const { oldPassword, newPassword } = request.body;
    if (!(oldPassword && newPassword)) {
      response.status(400).send();
      return;
    }

    //Get user from the database
    const userRepository = getRepository(User);
    let user: User;
    try {
      user = await userRepository.findOneOrFail(id);
    } catch (id) {
      response.status(401).send();
      return;
    }

    //Check if old password matchs
    if (!user.checkPasswordIsValid(oldPassword)) {
      response.status(401).send();
      return;
    }

    user.password = newPassword;
    const errors = await validate(user);
    if (errors.length > 0) {
      response.status(400).send(errors);
      return;
    }

    user.hashPassword();
    userRepository.save(user);

    response.status(204).send();
  };

  static resetPassword = async (request: Request, response: Response) => {
    const { email } = request.body;
    let user: User;
    if (!email) {
      response.status(401).send("Please provide email.");
      return;
    }
    try {
      const userRepository = getRepository(User);
      user = await userRepository.findOneOrFail({ where: { email } });

      if (!user) {
        response.status(401).send("Email not exist.");
        return;
      } else {
        //create token
        const expiresIn = "10m";
        const reset_link = jwt.sign(
          { user_id: user.id, email: user.email },
          config.jwtSecret,
          { expiresIn }
        );
        await updateUser(user.id, { reset_link: reset_link });
        sendEmail(email, reset_link);
        response.status(200).json({ message: "Email has been sent." });
      }
    } catch (error) {
      response.status(500).json({ errorMessage: error.message });
    }
  };
}

async function createUser(email: string, response: Response) {
  let user = new User();
  user.email = email;

  const errors = await validate(user);
  if (errors.length > 0) {
    response.status(400).send("Cannot create user. Please check parameters.");
    return;
  }

  try {
    const userRepository = getRepository(User);
    await userRepository.save(user);
  } catch (e) {
    response.status(400).send("Cannot create user. Please check parameters.");
    return;
  }

  return user;
}

async function updateUser(request: Request, response: Response) {
  const id = request.params.id;
  const { password, reset_link } = request.body;

  //Find user
  const userRepository = getRepository(User);
  let user;
  try {
    user = await userRepository.findOneOrFail(id);
  } catch (error) {
    response.status(404).send("User not found");
    return;
  }

  user.hashPassword();
  user.reset_link = reset_link;
  const errors = await validate(user);
  if (errors.length > 0) {
    response.status(400).send(errors);
    return;
  }

  //Try to safe, if fails, that means username already in use
  try {
    await userRepository.save(user);
  } catch (e) {
    response.status(409).send("Email already in use");
    return;
  }

  response.status(202).send();
}

async function sendEmail(user, token) {
  const clientURL = "http://localhost:3000";
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "skitrajTest@gmail.com",
      pass: "axs7777KBS#",
    },
  });
  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: "skitrajTest@gmail.com", // sender address
    to: user, // list of receivers
    subject: "Reset hasła SKITRAJ", // Subject line
    text: "Utraciłeś hasło? kliknij w link poniżej:", // plain text body
    html: `
    <a href="${clientURL}/NewPass/${token}">${token}</a>
  `,
  });
  console.log("Message sent: %s", info.messageId);
}
