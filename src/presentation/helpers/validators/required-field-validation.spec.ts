import { MissingParamError } from '../../errors';
import { RequiredFieldValidation } from './required-field-validation';

const makeSut = (): RequiredFieldValidation => {
  return new RequiredFieldValidation('field');
};

describe('RequiredField Validation', () => {
  test('Should return a MissingParamError if validation fails', () => {
    const requiredFieldValidation = makeSut();

    const error = requiredFieldValidation.validate({ name: 'any_name' });

    expect(error).toEqual(new MissingParamError('field'));
  });

  test('Should not return if validation succeeds', () => {
    const requiredFieldValidation = makeSut();

    const error = requiredFieldValidation.validate({ field: 'any_name' });

    expect(error).toBeFalsy();
  });
});
