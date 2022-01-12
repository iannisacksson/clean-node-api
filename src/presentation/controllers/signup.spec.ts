// eslint-disable-next-line max-classes-per-file
import { InvalidParamError, MissingParamError, ServerError } from '../errors';
import { IEmailValidator } from '../protocols';
import { SignUpController } from './signup';

interface ISignUpControllerTypes {
  signUpController: SignUpController;
  emailValidatorStub: IEmailValidator;
}

const makeEmailValidator = (): IEmailValidator => {
  class EmailValidatorStub implements IEmailValidator {
    public isValid(): boolean {
      return true;
    }
  }

  return new EmailValidatorStub();
};

const makeEmailValidatorWithError = (): IEmailValidator => {
  class EmailValidatorStub implements IEmailValidator {
    public isValid(): boolean {
      throw new Error();
    }
  }

  return new EmailValidatorStub();
};

const makeSignUpController = (): ISignUpControllerTypes => {
  const emailValidatorStub = makeEmailValidator();
  const signUpController = new SignUpController(emailValidatorStub);

  return {
    signUpController,
    emailValidatorStub,
  };
};

describe('SignUp Controller', () => {
  test('should return 400 if no name is provided', () => {
    const { signUpController } = makeSignUpController();

    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };

    const httpResponse = signUpController.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('name'));
  });

  test('should return 400 if no email is provided', () => {
    const { signUpController } = makeSignUpController();

    const httpRequest = {
      body: {
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };

    const httpResponse = signUpController.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('email'));
  });

  test('should return 400 if no password is provided', () => {
    const { signUpController } = makeSignUpController();

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        passwordConfirmation: 'any_password',
      },
    };

    const httpResponse = signUpController.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('password'));
  });

  test('should return 400 if no password confirmation is provided', () => {
    const { signUpController } = makeSignUpController();

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
      },
    };

    const httpResponse = signUpController.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(
      new MissingParamError('passwordConfirmation'),
    );
  });

  test('should return 400 if an invalid email is provided', () => {
    const { signUpController, emailValidatorStub } = makeSignUpController();

    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'invalid_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };

    const httpResponse = signUpController.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new InvalidParamError('email'));
  });

  test('should call EmailValidator with correct email', () => {
    const { signUpController, emailValidatorStub } = makeSignUpController();

    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'invalid_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };

    signUpController.handle(httpRequest);

    expect(isValidSpy).toHaveBeenCalledWith('invalid_email@mail.com');
  });

  test('should return 500 if EmailValidator throws', () => {
    const emailValidatorStub = makeEmailValidatorWithError();
    const signUpController = new SignUpController(emailValidatorStub);

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'invalid_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };

    const httpResponse = signUpController.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });
});
