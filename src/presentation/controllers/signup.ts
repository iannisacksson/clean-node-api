import { MissingParamError, InvalidParamError } from '../errors';
import { badRequest, serverError } from '../helpers/http-helper';
import {
  IHttpRequest,
  IHttpResponse,
  IController,
  IEmailValidator,
} from '../protocols';

class SignUpController implements IController {
  private readonly emailValidator: IEmailValidator;

  constructor(emailValidator: IEmailValidator) {
    this.emailValidator = emailValidator;
  }

  public handle(httpRequest: IHttpRequest): IHttpResponse {
    try {
      const requiredFields = [
        'name',
        'email',
        'password',
        'passwordConfirmation',
      ];

      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field));
        }
      }

      const isValid = this.emailValidator.isValid(httpRequest.body.email);

      if (!isValid) {
        return badRequest(new InvalidParamError('email'));
      }

      return { statusCode: 200, body: {} };
    } catch (error) {
      return serverError();
    }
  }
}

export { SignUpController };
