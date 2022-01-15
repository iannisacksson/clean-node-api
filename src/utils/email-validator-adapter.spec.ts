import { EmailValidatorAdapter } from './email-validator';

describe('EmailValidator Adapter', () => {
  test('Should return false if validator returns false', () => {
    const emailValidatorAdapter = new EmailValidatorAdapter();

    const isValid = emailValidatorAdapter.isValid('invalid_email@mail.com');

    expect(isValid).toBe(false);
  });
});
