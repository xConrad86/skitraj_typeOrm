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

  send e-mail reset password(check spam folder for email with token):
    url: /auth/reset-password
    body: {'email': 'test@gmail.com'}

PATCH:

  reset password:
    url: /auth/reset-password/:token
    header: 'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJlbWFpbCI6Imxld2Fwb2VsQGdtYWlsLmNvbSIsImlhdCI6MTY0NDg0MDM4MSwiZXhwIjoxNjQ0ODQwOTgxfQ.RqDufEkBU6pv1CJjO8DWRZb7Djgt1GdIXSOD8JPFCEA'
    body: {'email': 'test@gmail.com', 'password': 'Skitraj=12#'}

GET:



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
