import {
  IAddAccount,
  IHttpRequest,
  IHttpResponse,
  IController,
  IValidation,
} from './signup-protocols';
import { badRequest, serverError, ok } from '../../helpers/http/http-helper';

class SignUpController implements IController {
  private readonly addAccount: IAddAccount;
  private readonly validation: IValidation;

  constructor(addAccount: IAddAccount, validation: IValidation) {
    this.addAccount = addAccount;
    this.validation = validation;
  }

  public async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body);

      if (error) {
        return badRequest(error);
      }

      const { name, email, password } = httpRequest.body;

      const account = await this.addAccount.add({
        name,
        email,
        password,
      });

      return ok(account);
    } catch (error) {
      return serverError(error);
    }
  }
}

export { SignUpController };
