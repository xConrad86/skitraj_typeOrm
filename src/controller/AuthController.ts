import { getRepository } from "typeorm";
import { User } from "../entity/User";
import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";

const config = require("../config/config");

var passport = require("passport");

export class AuthController {
  private userRepository = getRepository(User);

  async login(request: Request, response: Response, next: NextFunction) {
    let { email, password } = request.body;
    if (!(email && password)) {
      response.status(400).send();
    }

    let user: User;
    try {
      user = await this.userRepository.findOneOrFail({ where: { email } });
    } catch (error) {
      response.status(401).send("User not found");
    }

    // check if encrypted password match
    if (!user.checkIfUnencryptedPasswordIsValid(password)) {
      response.status(401).send("Password is incorrect");
      return;
    }

    // sign JWT, valid for 1 hour
    const expiresIn = "1h";
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      config.jwtSecret,
      {
        expiresIn,
      }
    );

    response.status(200).send({ token, expiresIn });
  }

  async verifyAlternativeLogin(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const email = request.session.email;
    if (!email) {
      response.status(400).send();
    }

    let user: User;

    console.log(email);

    try {
      //jest taki uzytkownik wiec trzeba go zalogowac, dac mu dostep do aplikacji
      user = await this.userRepository.findOneOrFail({ where: { email } });
      response
        .status(200)
        .send("I know i am created one user, please log me in:)");
    } catch (error) {
      response
        .status(401)
        .send(`Email: ${email}. Please create me in database:)`);
      // nie ma takiego uzytkownika wiec trzeba mu zalozyc konto mając tylko maila
    }
  }
  async googleAuth(request: Request, response: Response, next: NextFunction) {
    passport.authenticate("google", { scope: ["profile", "email"] });
  }
}
