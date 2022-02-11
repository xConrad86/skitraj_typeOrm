import {getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
import {User} from "../entity/User";
import {validate} from "class-validator";

export default class UserController {
   
    static all = async (request: Request, response: Response, next: NextFunction) => {
        const userRepository = getRepository(User);
        return userRepository.find();
    }

    static one = async (request: Request, response: Response, next: NextFunction) => {
        const userRepository = getRepository(User);
        return userRepository.findOne(request.params.id);
    }

    static save = async (request: Request, response: Response, next: NextFunction) => { 
        console.log(Request);     
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
        const userRepository = getRepository(User);
        try {
            await userRepository.save(user);
        } catch (e) {
            request.status(409).send("Email already in use");
            return;
        }
        
        request.status(201).send("User created");    
    }

    static remove = async (request: Request, response: Response, next: NextFunction) => {
        const userRepository = getRepository(User);
        let userToRemove = await userRepository.findOne(request.params.id);
        await userRepository.remove(userToRemove);
    }
    
    static edit = async (req: Request, res: Response) => {
        //Get the ID from the url
        const id = req.params.id;
      
        //Get values from the body
        const { email, role } = req.body;
      
        //Try to find user on database
        const userRepository = getRepository(User);
        let user;
        try {
          user = await userRepository.findOneOrFail(id);
        } catch (error) {
          //If not found, send a 404 response
          res.status(404).send("User not found");
          return;
        }
      
        //Validate the new values on model
        user.email = email;
        user.role = role;
        const errors = await validate(user);
        if (errors.length > 0) {
          res.status(400).send(errors);
          return;
        }
      
        //Try to safe, if fails, that means username already in use
        try {
          await userRepository.save(user);
        } catch (e) {
          res.status(409).send("Email already in use");
          return;
        }
        //After all send a 204 (no content, but accepted) response
        res.status(204).send();
      };
}