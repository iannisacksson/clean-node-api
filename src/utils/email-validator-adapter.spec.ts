import validator from 'validator';

import { EmailValidatorAdapter } from './email-validator';

jest.mock('validator', () => ({
  isEmail(): boolean {
    return true;
  },
}));

describe('EmailValidator Adapter', () => {
  test('Should return false if validator returns false', () => {
    const emailValidatorAdapter = new EmailValidatorAdapter();

    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false);

    const isValid = emailValidatorAdapter.isValid('invalid_email');

    expect(isValid).toBe(false);
  });

  test('Should return false if validator returns true', () => {
    const emailValidatorAdapter = new EmailValidatorAdapter();

    const isValid = emailValidatorAdapter.isValid('invalid_email@mail.com');

    expect(isValid).toBe(true);
  });

  test('Should call validator with correct email', () => {
    const emailValidatorAdapter = new EmailValidatorAdapter();

    const isEmailSpy = jest.spyOn(validator, 'isEmail');

    emailValidatorAdapter.isValid('any_email@mail.com');

    expect(isEmailSpy).toHaveBeenCalledWith('any_email@mail.com');
  });
});
