import {getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
import {User} from "../entity/User";
import {validate} from "class-validator";

export class UserController {

    private userRepository = getRepository(User);

    async all(request: Request, response: Response, next: NextFunction) {
        return this.userRepository.find();
    }

    async one(request: Request, response: Response, next: NextFunction) {
        return this.userRepository.findOne(request.params.id);
    }

    async save(request: Request, response: Response, next: NextFunction) { 
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
        
        try {
            await this.userRepository.save(user);
        } catch (e) {
            request.status(409).send("username already in use");
            return;
        }
        
        request.status(201).send("User created");
       // return this.userRepository.save(request.body);
    }

    async remove(request: Request, response: Response, next: NextFunction) {
        let userToRemove = await this.userRepository.findOne(request.params.id);
        await this.userRepository.remove(userToRemove);
    }

}