import { InvalidParamError } from '../../errors';
import { CompareFieldValidations } from './compare-fields-validations';

const makeSut = (): CompareFieldValidations => {
  return new CompareFieldValidations('field', 'fieldToCompare');
};

describe('CompareFields Validation', () => {
  test('Should return a InvalidParamError if validation fails', () => {
    const CompareFieldValidation = makeSut();

    const error = CompareFieldValidation.validate({
      field: 'any_value',
      fieldToCompare: 'wrong_value',
    });

    expect(error).toEqual(new InvalidParamError('fieldToCompare'));
  });

  test('Should not return if validation succeeds', () => {
    const CompareFieldValidation = makeSut();

    const error = CompareFieldValidation.validate({
      field: 'any_value',
      fieldToCompare: 'any_value',
    });

    expect(error).toBeFalsy();
  });
});
