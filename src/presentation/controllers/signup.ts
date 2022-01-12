import { MissingParamError } from '../errors/missing-param-error';
import { IHttpRequest, IHttpResponse } from '../protocols/http';

class SignUpController {
  public handle(httpRequest: IHttpRequest): IHttpResponse {
    if (!httpRequest.body.name) {
      return {
        statusCode: 400,
        body: new MissingParamError('name'),
      };
    }

    if (!httpRequest.body.mail) {
      return {
        statusCode: 400,
        body: new MissingParamError('email'),
      };
    }

    return { statusCode: 200, body: {} };
  }
}

export { SignUpController };
