import { getRepository } from "typeorm";
import { User } from "../entity/User";
import {NextFunction, Request, Response} from "express";
import * as jwt from "jsonwebtoken";
import config from './../config/config'
import {validate} from "class-validator";

export default class AuthController {

  static loginExternalAccount = async (request: Request, response: Response, next: NextFunction) => {
      let { email } = request.body;
      const userRepository = getRepository(User)
      let user: User;

      if (!(email)) {
        response.status(400).send();
        return;
      }
          
      try {
        user = await userRepository.findOne({ where: { email } });
      }       
      catch (error) {
        response.status(401).send("User not found");
        return;
      }        

      if (!(user)) {
        try {          
          user = await createUser(email, response)
        } 
        catch (error) {
          response.status(401).send("User cannot be created." + error.message);
          return;
        }        
      }

      // sign JWT, valid for 1 hour
      const expiresIn = "1h";
      const token = jwt.sign({ user_id: user.id, email: user.email }, config.jwtSecret, { expiresIn });
    
      response.status(200).send({ token, expiresIn });
  }
    
  static login = async (request: Request, response: Response, next: NextFunction) => {
      let { email, password } = request.body;
      const userRepository = getRepository(User)
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
      const token = jwt.sign({ user_id: user.id, email: user.email }, config.jwtSecret, { expiresIn });
    
      response.status(200).send({ token, expiresIn });
  }

  static register = async (request: Request, response: Response, next: NextFunction) => {       
      let { email, password, phone, birthday} = request.body;
      let birthday_parsed;
      let user = new User();
      //console.log(request, response);
      if(birthday){
        try {
          birthday_parsed = new Date(Date.parse(birthday));
        } catch (error) {
          response.status(400).send("Wrong date format. Should be 'YYYY-MM-DD'" + error.message);
          return;
        }
      }

      user.email = email;
      user.password = password;              
      user.phone = phone;
      user.birthday = birthday_parsed;
      
      const errors = await validate(user);
      console.log(user, errors)
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
  }

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
 
}

async function createUser(email: string, response: Response){
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
  console.log("save returned user", user)
  return user;
}