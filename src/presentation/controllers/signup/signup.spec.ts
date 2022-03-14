import {
  IAddAccount,
  IEmailValidator,
  IHttpRequest,
  IValidation,
} from './signup-protocols';
import {
  InvalidParamError,
  MissingParamError,
  ServerError,
} from '../../errors';
import { SignUpController } from './signup';
import { IAccountModel } from '../../../domain/models/account';
import { ok, serverError, badRequest } from '../../helpers/http-helper';

interface ISignUpControllerTypes {
  signUpController: SignUpController;
  emailValidatorStub: IEmailValidator;
  addAccountStub: IAddAccount;
  validationStub: IValidation;
}

const makeEmailValidator = (): IEmailValidator => {
  class EmailValidatorStub implements IEmailValidator {
    public isValid(): boolean {
      return true;
    }
  }

  return new EmailValidatorStub();
};

const makeFakeAccount = (): IAccountModel => ({
  id: 'valid_id',
  name: 'any_name',
  email: 'invalid_email@mail.com',
  password: 'any_password',
});

const makeAddAccount = (): IAddAccount => {
  class AddAccountStub implements IAddAccount {
    public async add(): Promise<IAccountModel> {
      return makeFakeAccount();
    }
  }

  return new AddAccountStub();
};

const makeValidation = (): IValidation => {
  class ValidationStub implements IValidation {
    public validate(): Error {
      return null;
    }
  }

  return new ValidationStub();
};

const makeFakeRequest = (): IHttpRequest => ({
  body: {
    name: 'any_name',
    email: 'invalid_email@mail.com',
    password: 'any_password',
    passwordConfirmation: 'any_password',
  },
});

const makeSignUpController = (): ISignUpControllerTypes => {
  const emailValidatorStub = makeEmailValidator();
  const addAccountStub = makeAddAccount();
  const validationStub = makeValidation();

  const signUpController = new SignUpController(
    emailValidatorStub,
    addAccountStub,
    validationStub,
  );

  return {
    signUpController,
    emailValidatorStub,
    addAccountStub,
    validationStub,
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

    expect(httpResponse).toEqual(badRequest(new MissingParamError('name')));
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

    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')));
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

    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')));
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

    expect(httpResponse).toEqual(
      badRequest(new MissingParamError('passwordConfirmation')),
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

    expect(httpResponse).toEqual(
      badRequest(new InvalidParamError('passwordConfirmation')),
    );
  });

  test('should return 400 if an invalid email is provided', async () => {
    const { signUpController, emailValidatorStub } = makeSignUpController();

    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);

    const httpResponse = await signUpController.handle(makeFakeRequest());

    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')));
  });

  test('should call EmailValidator with correct email', async () => {
    const { signUpController, emailValidatorStub } = makeSignUpController();

    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');

    signUpController.handle(makeFakeRequest());

    expect(isValidSpy).toHaveBeenCalledWith('invalid_email@mail.com');
  });

  test('should return 500 if EmailValidator throws', async () => {
    const { signUpController, emailValidatorStub } = makeSignUpController();

    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error();
    });

    const httpResponse = await signUpController.handle(makeFakeRequest());

    expect(httpResponse).toEqual(serverError(new ServerError(null)));
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

    const httpResponse = await signUpController.handle(makeFakeRequest());

    expect(httpResponse.statusCode).toBe(500);

    expect(httpResponse).toEqual(serverError(new ServerError(null)));
  });

  test('should return 200 if valid data is provided', async () => {
    const { signUpController } = makeSignUpController();

    const httpResponse = await signUpController.handle(makeFakeRequest());

    expect(httpResponse).toEqual(ok(makeFakeAccount()));
  });

  test('should call Validation with correct values', async () => {
    const { signUpController, validationStub } = makeSignUpController();

    const validateSpy = jest.spyOn(validationStub, 'validate');

    const httpRequest = makeFakeRequest();

    signUpController.handle(httpRequest);

    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  test('should return 400 if Validation returns an error', async () => {
    const { signUpController, validationStub } = makeSignUpController();

    jest
      .spyOn(validationStub, 'validate')
      .mockReturnValueOnce(new MissingParamError('any_field'));

    const httpResponse = await signUpController.handle(makeFakeRequest());

    expect(httpResponse).toEqual(
      badRequest(new MissingParamError('any_field')),
    );
  });
});
