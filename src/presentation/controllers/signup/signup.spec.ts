// eslint-disable-next-line max-classes-per-file
import {
  IAddAccount,
  IAddAccountModel,
  IEmailValidator,
} from './signup-protocols';
import {
  InvalidParamError,
  MissingParamError,
  ServerError,
} from '../../errors';
import { SignUpController } from './signup';
import { IAccountModel } from '../../../domain/models/account';

interface ISignUpControllerTypes {
  signUpController: SignUpController;
  emailValidatorStub: IEmailValidator;
  addAccountStub: IAddAccount;
}

const makeEmailValidator = (): IEmailValidator => {
  class EmailValidatorStub implements IEmailValidator {
    public isValid(): boolean {
      return true;
    }
  }

  return new EmailValidatorStub();
};

const makeAddAccount = (): IAddAccount => {
  class AddAccountStub implements IAddAccount {
    public async add({
      email,
      name,
      password,
    }: IAddAccountModel): Promise<IAccountModel> {
      const fakeAccount = {
        id: 'valid_id',
        name,
        email,
        password,
      };

      return fakeAccount;
    }
  }

  return new AddAccountStub();
};

const makeSignUpController = (): ISignUpControllerTypes => {
  const emailValidatorStub = makeEmailValidator();
  const addAccountStub = makeAddAccount();

  const signUpController = new SignUpController(
    emailValidatorStub,
    addAccountStub,
  );

  return {
    signUpController,
    emailValidatorStub,
    addAccountStub,
  };
};

describe('SignUp Controller', () => {
  test('should return 400 if no name is provided', async () => {
    const { signUpController } = makeSignUpController();

    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };

    const httpResponse = await signUpController.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('name'));
  });

  test('should return 400 if no email is provided', async () => {
    const { signUpController } = makeSignUpController();

    const httpRequest = {
      body: {
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };

    const httpResponse = await signUpController.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('email'));
  });

  test('should return 400 if no password is provided', async () => {
    const { signUpController } = makeSignUpController();

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        passwordConfirmation: 'any_password',
      },
    };

    const httpResponse = await signUpController.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('password'));
  });

  test('should return 400 if no password confirmation is provided', async () => {
    const { signUpController } = makeSignUpController();

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
      },
    };

    const httpResponse = await signUpController.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(
      new MissingParamError('passwordConfirmation'),
    );
  });

  test('should return 400 if password confirmation fails', async () => {
    const { signUpController } = makeSignUpController();

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'invalid_password',
      },
    };

    const httpResponse = await signUpController.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(
      new InvalidParamError('passwordConfirmation'),
    );
  });

  test('should return 400 if an invalid email is provided', async () => {
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

    const httpResponse = await signUpController.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new InvalidParamError('email'));
  });

  test('should call EmailValidator with correct email', async () => {
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

  test('should return 500 if EmailValidator throws', async () => {
    const { signUpController, emailValidatorStub } = makeSignUpController();

    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error();
    });

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'invalid_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };

    const httpResponse = await signUpController.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });

  test('should call AddAccount with correct values', async () => {
    const { signUpController, addAccountStub } = makeSignUpController();

    const addSpy = jest.spyOn(addAccountStub, 'add');

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'invalid_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };

    signUpController.handle(httpRequest);

    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'invalid_email@mail.com',
      password: 'any_password',
    });
  });

  test('should return 500 if AddAccount throws', async () => {
    const { signUpController, addAccountStub } = makeSignUpController();

    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(() => {
      throw new Error();
    });

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'invalid_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };

    const httpResponse = await signUpController.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });

  test('should return 200 if valid data is provided', async () => {
    const { signUpController } = makeSignUpController();

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'invalid_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };

    const httpResponse = await signUpController.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(200);
    expect(httpResponse.body).toEqual({
      id: 'valid_id',
      name: 'any_name',
      email: 'invalid_email@mail.com',
      password: 'any_password',
    });
  });
});
