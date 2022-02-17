import * as jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import config from "../config/config";
import { Response_PL } from "../utils/dictionary";
import { showError } from "../utils/functions";

export const authenticateToken = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const token = <string>request.headers["authorization"];
  let jwtPayload;
  console.log("verify permisson", token, request.headers);

  if (!token) {
    response.status(403).send(showError(Response_PL.REQUIRE_TOKEN, ""));
    return;
  }
  //Validate the jwt token
  try {
    jwtPayload = <any>jwt.verify(token, config.jwt_secret);
  } catch (error) {
    response
      .status(401)
      .send(showError(Response_PL.NOT_AUTHORIZED, error as string));
    return;
  }

  next();
};
