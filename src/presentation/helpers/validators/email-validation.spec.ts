import { InvalidParamError } from '../../errors';
import { IEmailValidator } from '../../protocols/email-validator';
import { EmailValidation } from './email-validation';

interface ISut {
  emailValidation: EmailValidation;
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

const makeSut = (): ISut => {
  const emailValidatorStub = makeEmailValidator();

  const emailValidation = new EmailValidation('email', emailValidatorStub);

  return {
    emailValidation,
    emailValidatorStub,
  };
};

describe('Email Validation', () => {
  test('should return an errir if EmailValidation returns false', () => {
    const { emailValidation, emailValidatorStub } = makeSut();

    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);

    const error = emailValidation.validate({ email: 'any_email@mail.com' });

    expect(error).toEqual(new InvalidParamError('email'));
  });

  test('should call EmailValidator with correct email', () => {
    const { emailValidation, emailValidatorStub } = makeSut();

    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');

    emailValidation.validate({ email: 'any_email@mail.com' });

    expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com');
  });

  test('should throw if EmailValidator throws', () => {
    const { emailValidation, emailValidatorStub } = makeSut();

    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error();
    });

    expect(emailValidation.validate).toThrow();
  });
});
