import { MissingParamError } from '../../errors';
import { badRequest } from '../../helpers/http-helper';
import { IController, IHttpRequest, IHttpResponse } from '../../protocols';

export class LoginController implements IController {
  public async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    if (!httpRequest.body.email) {
      return badRequest(new MissingParamError('email'));
    }

    if (!httpRequest.body.password) {
      return badRequest(new MissingParamError('password'));
    }

    return null;
  }
}
