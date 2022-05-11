import {
  IAddAccount,
  IHttpRequest,
  IHttpResponse,
  IController,
  IValidation,
} from './signup-controller-protocols';
import { badRequest, serverError, ok } from '../../helpers/http/http-helper';
import { IAuthentication } from '../login/login-controller-protocols';

class SignUpController implements IController {
  constructor(
    private readonly addAccount: IAddAccount,
    private readonly validation: IValidation,
    private readonly authentication: IAuthentication,
  ) {}

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

      await this.authentication.auth({ email, password });

      return ok(account);
    } catch (error) {
      return serverError(error);
    }
  }
}

export { SignUpController };
