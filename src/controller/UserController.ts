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
        console.log(request);     
        let { email, password } = request.body;
        let user = new User();

        user.email = email;
        user.password = password;        

        const errors = await validate(user);
        if (errors.length > 0) {
            response.status(400).send(errors);
            return;
        }

        user.hashPassword();
        const userRepository = getRepository(User);
        try {
            await userRepository.save(user);
        } catch (e) {
            response.status(409).send("Email already in use");
            return;
        }
        
        response.status(201).send("User created");    
    }

    static remove = async (request: Request, response: Response, next: NextFunction) => {
        const userRepository = getRepository(User);
        let userToRemove = await userRepository.findOne(request.params.id);
        await userRepository.remove(userToRemove);
    }
    
    static edit = async (request: Request, response: Response) => {        
        const id = request.params.id;              
        const { email, role } = request.body;
      
        //Find user
        const userRepository = getRepository(User);
        let user;
        try {
          user = await userRepository.findOneOrFail(id);
        } catch (error) {          
          response.status(404).send("User not found");
          return;
        }
            
        user.email = email;
        user.role = role;
        const errors = await validate(user);
        if (errors.length > 0) {
          response.status(400).send(errors);
          return;
        }
      
        //if failed that means username already in use
        try {
          await userRepository.save(user);
        } catch (e) {
          response.status(409).send("Email already in use");
          return;
        }
        
        response.status(202).send();
      };
}