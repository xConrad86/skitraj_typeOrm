import * as jwt from "jsonwebtoken";
import {NextFunction, Request, Response} from "express";
import config from '../config/config'

export const authenticateToken = (request: Request, response: Response, next: NextFunction) => {
    const token = <string> request.headers["authorization"];
    let jwtPayload;
    console.log("verify permisson", token, request.headers)
    //Validate the jwt token
    try {
      jwtPayload = <any> jwt.verify(token, config.jwt_secret);    
    } catch (error) {         
        response.status(401).send("You are not authorized." + error.message);
      return;
    }
     
    next();
}

