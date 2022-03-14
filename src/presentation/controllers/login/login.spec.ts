import { MissingParamError } from '../../errors';
import { badRequest } from '../../helpers/http-helper';
import { IEmailValidator } from '../signup/signup-protocols';
import { LoginController } from './login';

interface ISutTypes {
  loginController: LoginController;
  emailValidatorStub: IEmailValidator;
}

const makeEmailValidator = (): IEmailValidator => {
  class EmailValidator implements IEmailValidator {
    public isValid(): boolean {
      return true;
    }
  }

  return new EmailValidator();
};

const makeSut = (): ISutTypes => {
  const emailValidatorStub = makeEmailValidator();
  const loginController = new LoginController(emailValidatorStub);

  return {
    loginController,
    emailValidatorStub,
  };
};

describe('Login Controller', () => {
  test('Should return 400 if no email is provided', async () => {
    const { loginController } = makeSut();
    const httpRequest = {
      body: {
        passoword: 'any_password',
      },
    };

    const httpResponse = await loginController.handle(httpRequest);

    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')));
  });

  test('Should return 400 if no password is provided', async () => {
    const { loginController } = makeSut();
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
      },
    };

    const httpResponse = await loginController.handle(httpRequest);

    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')));
  });

  test('Should return 400 if no password is provided', async () => {
    const { loginController } = makeSut();
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
      },
    };

    const httpResponse = await loginController.handle(httpRequest);

    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')));
  });

  test('Should call EmailValidator with correct email', async () => {
    const { loginController, emailValidatorStub } = makeSut();

    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');

    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_passoword',
      },
    };

    await loginController.handle(httpRequest);

    expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com');
  });
});
