import { MissingParamError } from '../../errors';
import {
  badRequest,
  ok,
  serverError,
  unauthorized,
} from '../../helpers/http/http-helper';
import { IValidation, IAuthentication, IHttpRequest } from './login-protocols';
import { LoginController } from './login';

interface ISutTypes {
  loginController: LoginController;
  validationStub: IValidation;
  authenticationStub: IAuthentication;
}

const makeValidation = (): IValidation => {
  class ValidationStub implements IValidation {
    public validate(): Error {
      return null;
    }
  }

  return new ValidationStub();
};

const makeAuthentication = (): IAuthentication => {
  class AuthenticationStub implements IAuthentication {
    public async auth(): Promise<string> {
      return 'any_token';
    }
  }

  return new AuthenticationStub();
};

const makeFakeRequest = (): IHttpRequest => ({
  body: {
    email: 'any_email@mail.com',
    password: 'any_password',
  },
});

const makeSut = (): ISutTypes => {
  const validationStub = makeValidation();
  const authenticationStub = makeAuthentication();
  const loginController = new LoginController(
    authenticationStub,
    validationStub,
  );

  return {
    loginController,
    validationStub,
    authenticationStub,
  };
};

describe('Login Controller', () => {
  test('Should call Authentication with correct values', async () => {
    const { loginController, authenticationStub } = makeSut();

    const authSpy = jest.spyOn(authenticationStub, 'auth');

    await loginController.handle(makeFakeRequest());

    expect(authSpy).toHaveBeenCalledWith('any_email@mail.com', 'any_password');
  });

  test('Should return 401 if invalid credentials are provided', async () => {
    const { loginController, authenticationStub } = makeSut();

    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(null);

    const httpResponse = await loginController.handle(makeFakeRequest());

    expect(httpResponse).toEqual(unauthorized());
  });

  test('Should return 500 if Authantication throws', async () => {
    const { loginController, authenticationStub } = makeSut();

    jest.spyOn(authenticationStub, 'auth').mockImplementationOnce(() => {
      throw new Error();
    });

    const httpResponse = await loginController.handle(makeFakeRequest());

    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test('Should return 401 if invalid credentials are provided', async () => {
    const { loginController } = makeSut();

    const httpResponse = await loginController.handle(makeFakeRequest());

    expect(httpResponse).toEqual(ok({ accessToken: 'any_token' }));
  });

  test('should call Validation with correct values', async () => {
    const { loginController, validationStub } = makeSut();

    const validateSpy = jest.spyOn(validationStub, 'validate');

    const httpRequest = makeFakeRequest();

    loginController.handle(httpRequest);

    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  test('should return 400 if Validation returns an error', async () => {
    const { loginController, validationStub } = makeSut();

    jest
      .spyOn(validationStub, 'validate')
      .mockReturnValueOnce(new MissingParamError('any_field'));

    const httpResponse = await loginController.handle(makeFakeRequest());

    expect(httpResponse).toEqual(
      badRequest(new MissingParamError('any_field')),
    );
  });
});
