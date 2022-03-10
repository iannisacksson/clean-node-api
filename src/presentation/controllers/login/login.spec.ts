import { MissingParamError } from '../../errors';
import { badRequest } from '../../helpers/http-helper';
import { LoginController } from './login';

describe('Login Controller', () => {
  test('Should return 400 if no email is provided', async () => {
    const loginController = new LoginController();
    const httpRequest = {
      body: {
        passoword: 'any_password',
      },
    };

    const httpResponse = await loginController.handle(httpRequest);

    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')));
  });

  test('Should return 400 if no password is provided', async () => {
    const loginController = new LoginController();
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
      },
    };

    const httpResponse = await loginController.handle(httpRequest);

    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')));
  });
});
