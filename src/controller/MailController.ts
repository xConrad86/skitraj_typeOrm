import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import config from "../config/config";

import { sendEmailTest } from "../utils/functions";
import { IRequest } from "../utils/globals";

export default class MailController {
    static sendTestEmail = async (
        request: Request,
        response: Response,
        next: NextFunction
      ) => {
        try {
            const {payload, email} = request.body;
            if(!payload || !email){
                response.status(400).send("Provide payload and email.")                
                return;
            } else {
                await sendEmailTest(email, JSON.stringify(payload))
            }
        }         
        catch {
            response.status(400).send("Cannot send email. Ensure you have provided proper payload.")                
            return;
        }
        response.status(200).send("Mail has been sent.")                                
      };
}