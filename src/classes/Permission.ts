import * as jwt from "jsonwebtoken";
import {NextFunction, Request, Response} from "express";
import config from '../config/config'

export const authenticateToken = (request: Request, response: Response, next: NextFunction) => {
    const token = <string> request.headers["auth"];
    let jwtPayload;
  
    //Validate the jwt token
    try {
      jwtPayload = <any> jwt.verify(token, config.jwtSecret);
      request.locals.jwtPayload = jwtPayload;
    } catch (error) {         
        response.status(401).send();
      return;
    }
  
    //The token is valid for 1 hour    
    const { id, email } = jwtPayload;
    const newToken = jwt.sign({ id, email }, config.jwtSecret, {
      expiresIn: "1h"
    });
    request.setHeader("token", newToken);
  
    //Call the next permission or controller
    next();
}

