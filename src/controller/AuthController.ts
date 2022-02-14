import { getRepository, PersistedEntityNotFoundError } from "typeorm";
import { User } from "../entity/User";
import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import config from "../config/config";
import { validate } from "class-validator";
import { sendEmail } from "../utils/Functions";
import { Console } from "console";

const bcrypt = require('bcryptjs');
const passport = require("passport");

export default class AuthController {
  static externalAuthRequest = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    passport.authenticate(request.params.authProvider, {
      scope: "email",
    })(request, response, next);
  };
  static externalAuthCallback = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    passport.authenticate(request.params.authProvider, {
      successRedirect: `/auth/${request.params.authProvider}/login`,
      failureRedirect: "/error",
    })(request, response, next);
  };

  static externalLogin = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    let email = request.user.emails[0].value;
    const userRepository = getRepository(User);
    let user: User;

    if (!email) {
      response.status(400).send();
      return;
    }

    try {
      user = await userRepository.findOne({ where: { email } });
      if(!user){
        user = await createUserExternalService(email, response);
      }
    } catch (error) {
      response.status(401).send("User not found");
      return;
    }

    // sign JWT, valid for 1 hour
    const expiresIn = "1h";
    const token = jwt.sign(
      { user_id: user.id, email: user.email },
      config.jwt_secret,
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
      config.jwt_secret,
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

    let errors_pass = user.checkPassword(password)
      
    if(errors_pass.length > 0 ){                            
      response.status(400).json({message: 'Provided password has errors. Check below: \n' + errors_pass.join("\n")}) 
      return;
    }     

    user.hashPassword();

    try {
      const userRepository = getRepository(User);
      await userRepository.save(user);
    } catch (e) {
      response.status(409).send(e.message);
      return;
    }
    let obj = user.toJSON()
    response.status(201).send({obj});
  };

  static changePassword = async (request: Request, response: Response) => {    
    const id = request.locals.jwtPayload.user_id;    
    const { oldPassword, newPassword } = request.body;

    if (!(oldPassword && newPassword)) {
      response.status(400).send();
      return;
    }
    
    const userRepository = getRepository(User);
    let user: User;
    try {
      user = await userRepository.findOneOrFail(id);
    } catch (id) {
      response.status(401).send();
      return;
    }
    
    if (!user.checkPasswordIsValid(oldPassword)) {
      response.status(401).send();
      return;
    }
    
    const errors = user.checkPassword(newPassword);
    if(errors){
      response.status(401).send(errors);
      return;
    } 

    user.password = newPassword;
    const validation_errors = await validate(user);
    if (validation_errors.length > 0) {
      response.status(400).send(validation_errors);
      return;
    }
    
    user.hashPassword();
    try{
      await userRepository.save(user);
      response.status(204).send();
    } catch (error){
      response.status(401).send("Cannot update user.");
      return;
    }
    
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
      console.log(email);
      user = await userRepository.findOneOrFail({ where: { email } });
      if (!user) {
        response.status(401).send("Email not exist.");
        return;
      } else {
        //create token
        const expiresIn = "10m";
        const reset_link = jwt.sign({ user_id: user.id, email: user.email }, config.jwt_secret, { expiresIn });        
        user.reset_link = reset_link;  
        
        try {          
          await userRepository.save(user);
        } catch (e) {
          response.status(400).send("Cannot update user." + e.message);
          return;
        }
        await sendEmail(email, reset_link);
        response.status(200).json({ message: "Email has been sent." });
      }
    } catch (error) {
      response.status(500).json({ errorMessage: error.message });      
    }
  };

  static resetPasswordToken = async (request: Request, response: Response) => {               
    const reset_link = request.params.token;
    const {password} = request.body;         
          
    try {       
      await resetUserPassword(response, reset_link, password)
    }
    catch (error) {              
      response.status(500).json({ message: error.message });
      return;
    }
    
  }          
}

async function createUserExternalService(email: string, response: Response) {
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
    response.status(400).send("Cannot create user." + e.message);
    return;
  }

  return user;
}

async function resetUserPassword(response: Response, reset_link: string, password: string){
  let user;
  let userRepository;
  
  try {  
    userRepository = getRepository(User);                             
    user = await userRepository.findOne({ reset_link: reset_link });
  } catch (error) {              
    response.status(500).json({ message: error.message });
    return;
  }
  
  if(!user) {
    response.status(401).json({ message: 'We could not find a match for this link' });    
  } else {       
    let errors = user.checkPassword(password)
      
    if(errors.length > 0 ){                            
      response.status(400).json({message: 'Provided password has errors. Check below: \n' + errors.join("\n")})      
    } else {                                    
      //user.password = bcrypt.hashSync(password, 8),
      user.password = password;      
      user.reset_link = null         

      console.log("validated user", user)
      const validation_errors = await validate(user);
      if (validation_errors.length > 0) {
        response.status(400).send(validation_errors);
        return;
      }     
      user.hashPassword();                               
      try{
        await userRepository.save(user);        
      } catch (error){
        response.status(401).send("Cannot update user.");
        return;
      }        
      response.status(200).json({ message: 'Password updated' });
    }                                        
  }
} 
  
  

