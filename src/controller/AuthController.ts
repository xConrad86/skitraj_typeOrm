import { getRepository } from "typeorm";
import { User } from "../entity/User";
import {NextFunction, Request, Response} from "express";
import * as jwt from "jsonwebtoken";
import config from './../config/config'

export class AuthController {

    private userRepository = getRepository(User);

    async login (request: Request, response: Response, next: NextFunction) {
        let { email, password } = request.body;
        if (!(email && password)) {
          request.status(400).send();
        }
            
        let user: User;
        try {
          user = await this.userRepository.findOneOrFail({ where: { email } });
        } catch (error) {
          request.status(401).send("User not found");
        }
    
        // check if encrypted password match
        if (!user.checkIfUnencryptedPasswordIsValid(password)) {
            request.status(401).send("Password is incorrect");
            return;
        }
    
        // sign JWT, valid for 1 hour
        const expiresIn = "1h";
        const token = jwt.sign({ userId: user.id, email: user.email }, config.jwtSecret, {
          expiresIn
        });
    
        request.status(200).send({ token, expiresIn });
    }


}