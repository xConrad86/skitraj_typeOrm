import { NextFunction, Request, Response } from "express";

const apiReference = `<pre>

Note:

Please use real e-mails in order to check reset-password functionality

POST:

  normal register:
    url: /auth/register
    body: {'email': 'test@gmail.com', 'password': 'Skitraj=12#', 'phone': '123456789'}

  normal login:
    url: /auth/login
    body: {'email': 'test@gmail.com', password: 'Skitraj=12#'}

  send e-mail reset password(check spam folder for e-mail with token):
    url: /auth/reset-password
    body: {'email': 'test@gmail.com'}

PATCH:

  reset password (token = token from e-mail):
    url: /auth/reset-password/:token
    header: 'Authorization': :token
    body: {'email': 'test@gmail.com', 'password': 'Skitraj=12#'}

GET:

  facebook (register,login), try via browser:
    url: /auth/facebook

  google (register,login), try via browser:
    url: /auth/google

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
