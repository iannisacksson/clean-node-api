import { IHttpRequest, IHttpResponse } from '../protocols/http';

class SignUpController {
  public handle(httpRequest: IHttpRequest): IHttpResponse {
    if (!httpRequest.body.name) {
      return { statusCode: 400, body: new Error('Missing param: name') };
    }

    if (!httpRequest.body.mail) {
      return { statusCode: 400, body: new Error('Missing param: email') };
    }

    return { statusCode: 200, body: {} };
  }
}

export { SignUpController };
