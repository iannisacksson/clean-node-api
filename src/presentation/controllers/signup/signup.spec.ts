import { IAddAccount, IHttpRequest, IValidation } from './signup-protocols';
import { MissingParamError, ServerError } from '../../errors';
import { SignUpController } from './signup';
import { IAccountModel } from '../../../domain/models/account';
import { ok, serverError, badRequest } from '../../helpers/http-helper';

interface ISignUpControllerTypes {
  signUpController: SignUpController;
  addAccountStub: IAddAccount;
  validationStub: IValidation;
}

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
  const addAccountStub = makeAddAccount();
  const validationStub = makeValidation();

  const signUpController = new SignUpController(addAccountStub, validationStub);

  return {
    signUpController,
    addAccountStub,
    validationStub,
  };
};

describe('SignUp Controller', () => {
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
