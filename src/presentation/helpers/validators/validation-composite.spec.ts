import { MissingParamError } from '../../errors';
import { IValidation } from './validation';
import { ValidationComposite } from './validation-composite';

interface ISutTypes {
  validationComposite: ValidationComposite;
  validationStub: IValidation;
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
  const validationStub = makeValidation();
  const validationComposite = new ValidationComposite([validationStub]);

  return {
    validationComposite,
    validationStub,
  };
};

describe('Validation Composite', () => {
  test('Should return an error if any validation fails', () => {
    const { validationComposite, validationStub } = makeSut();

    jest
      .spyOn(validationStub, 'validate')
      .mockReturnValueOnce(new MissingParamError('field'));

    const error = validationComposite.validate({ field: 'any_value' });

    expect(error).toEqual(new MissingParamError('field'));
  });
});
