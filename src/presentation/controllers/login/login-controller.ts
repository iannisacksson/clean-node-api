import {
  badRequest,
  ok,
  serverError,
  unauthorized,
} from '../../helpers/http/http-helper';
import {
  IValidation,
  IController,
  IHttpRequest,
  IHttpResponse,
  IAuthentication,
} from './login-controller-protocols';

export class LoginController implements IController {
  constructor(
    private readonly authentication: IAuthentication,
    private readonly validation: IValidation,
  ) {}

  public async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body);

      if (error) {
        return badRequest(error);
      }

      const { email, password } = httpRequest.body;

      const accessToken = await this.authentication.auth({ email, password });

      if (!accessToken) {
        return unauthorized();
      }

      return ok({ accessToken });
    } catch (error) {
      return serverError(error);
    }
  }
}
