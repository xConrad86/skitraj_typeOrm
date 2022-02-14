import { NextFunction, Request, Response } from "express";

const apiReference = `<pre>
GET:

  all users:
    url: /users

  user by id: /users/:id

  facebook (register,login):
    url: /auth/facebook

  google (register,login):
    url: /auth/google

POST:

  create user normal password:
    url: /users
    body: {'email': 'normal@gmail.com', password: '12345'}

  login normal password:
    url: /auth/normal-password
    body: {'email': 'normal@gmail.com', password: '12345'}

PUT:

  update user:
    url: /user/:id
    body: {'firstName': 'John'}

DELETE:

  delete user by id:
    url: /users/:id

  <pre>`;

export default class DocsController {
  static apiReference = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    response.status(400).send(apiReference);
  };
}
