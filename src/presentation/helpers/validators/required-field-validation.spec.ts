import { MissingParamError } from '../../errors';
import { RequiredFieldValidation } from './required-field-validation';

describe('RequiredField Validation', () => {
  test('Should return a MissingParamError if validation fails', () => {
    const requiredFieldValidation = new RequiredFieldValidation('field');

    const error = requiredFieldValidation.validate({ name: 'any_name' });

    expect(error).toEqual(new MissingParamError('field'));
  });
});