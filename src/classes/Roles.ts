import { Request, Response, NextFunction } from "express";
import { getRepository } from "typeorm";
import { User } from "../entity/User";

export const verifyRoles = (roles: Array<string>) => {
  return async (request: Request, response: Response, next: NextFunction) => {
    //Get the user ID from previous midleware
    const id = request.locals.jwtPayload.user_id;

    //Get user role from the database
    const userRepository = getRepository(User);
    let user: User;
    try {
      user = await userRepository.findOneOrFail(id);
    } catch (id) {
      response.status(401).send("You are not authorized.");
    }
    //Check if array of authorized roles includes the user's role
    if (roles.indexOf(user.role) > -1) next();
    else response.status(401).send("Role unknown.");
  };
};
