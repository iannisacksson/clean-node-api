import { MissingParamError } from '../../errors';
import { IValidation } from '../../protocols/validation';
import { ValidationComposite } from './validation-composite';

interface ISutTypes {
  validationComposite: ValidationComposite;
  validationStubs: IValidation[];
}

const makeValidation = (): IValidation => {
  class ValidationStub implements IValidation {
    validate(): Error {
      return null;
    }
  }

  return new ValidationStub();
};

const makeSut = (): ISutTypes => {
  const validationStubs = [makeValidation(), makeValidation()];
  const validationComposite = new ValidationComposite(validationStubs);

  return {
    validationComposite,
    validationStubs,
  };
};

describe('Validation Composite', () => {
  test('Should return an error if any validation fails', () => {
    const { validationComposite, validationStubs } = makeSut();

    jest
      .spyOn(validationStubs[1], 'validate')
      .mockReturnValueOnce(new MissingParamError('field'));

    const error = validationComposite.validate({ field: 'any_value' });

    expect(error).toEqual(new MissingParamError('field'));
  });

  test('Should return the first error if mote the one validation fails', () => {
    const { validationComposite, validationStubs } = makeSut();

    jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new Error());
    jest
      .spyOn(validationStubs[1], 'validate')
      .mockReturnValueOnce(new MissingParamError('field'));

    const error = validationComposite.validate({ field: 'any_value' });

    expect(error).toEqual(new Error());
  });

  test('Should not return if validation succeeds', () => {
    const { validationComposite } = makeSut();

    const error = validationComposite.validate({ field: 'any_value' });

    expect(error).toBeFalsy();
  });
});
