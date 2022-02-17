import { NextFunction, Request, Response } from "express";

const apiReference = `<pre>

Note:

Please use real e-mails in order to check reset-password functionality

POST:

  normal register:
    url: /auth/register
    body: {"email": "test@gmail.com", "password": "Skitraj=12#", "phone": "123456789", "first_name" : "konrad", "last_name" : "bednarski"}

  normal login:
    url: /auth/login
    body: {"email": "test@gmail.com", password: "Skitraj=12#"}

  send e-mail reset password(check spam folder for e-mail with token):
    url: /auth/reset-password
    body: {"email": "test@gmail.com"}

  test e-mail(remember to provide payload as object):
    url: /test/mail
    body: { "email": "konradbednarski8623@gazeta.pl",
      "payload": {"something": "nothing important"}
    }  

PATCH:

  reset password (token = token from e-mail):
    url: /auth/reset-password/:token
    header: "Authorization": :token
    body: {"email": "test@gmail.com", "password": "Skitraj=12#"}

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
    response.status(200).send(apiReference);
  };
}
