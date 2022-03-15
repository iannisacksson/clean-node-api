import { MissingParamError } from '../../errors';
import { IValidation } from './validation';
import { ValidationComposite } from './validation-composite';

describe('Validation Composite', () => {
  test('Should return an error if any validation fails', () => {
    class ValidationStub implements IValidation {
      validate(): Error {
        return new MissingParamError('field');
      }
    }

    const validationStub = new ValidationStub();
    const validationComposite = new ValidationComposite([validationStub]);

    const error = validationComposite.validate({ field: 'any_value' });

    expect(error).toEqual(new MissingParamError('field'));
  });
});
