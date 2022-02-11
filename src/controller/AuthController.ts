import { getRepository } from "typeorm";
import { User } from "../entity/User";
import {NextFunction, Request, Response} from "express";
import * as jwt from "jsonwebtoken";
import config from './../config/config'
import {validate} from "class-validator";

export default class AuthController {
    
    static login = async (request: Request, response: Response, next: NextFunction) => {
        let { email, password } = request.body;
        const userRepository = getRepository(User)
        let user: User;

        if (!(email && password)) {
          request.status(400).send();
        }
           
        try {
          user = await userRepository.findOneOrFail({ where: { email } });
        } catch (error) {
          request.status(401).send("User not found");
        }
    
        // check if encrypted password match
        if (!user.checkPasswordIsValid(password)) {
            request.status(401).send("Password is not valid");
            return;
        }
    
        // sign JWT, valid for 1 hour
        const expiresIn = "1h";
        const token = jwt.sign({ userId: user.id, email: user.email }, config.jwtSecret, {
          expiresIn
        });
    
        request.status(200).send({ token, expiresIn });
    }

    static register = async (request: Request, response: Response, next: NextFunction) => {       
      let { email, password} = request.body;
      let user = new User();

      user.email = email;
      user.password = password;              

      const errors = await validate(user);
      if (errors.length > 0) {
          request.status(400).send(errors);
          return;
      }

      user.hashPassword();
      
      try {
          const userRepository = getRepository(User);
          await userRepository.save(user);
      } catch (e) {
          request.status(409).send("Email already in use");
          return;
      }
      
      request.status(201).send("User created");    
  }


}