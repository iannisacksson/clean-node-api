import { CompareFieldValidations } from '../../presentation/helpers/validators/compare-fields-validations';
import { RequiredFieldValidation } from '../../presentation/helpers/validators/required-field-validation';
import { IValidation } from '../../presentation/helpers/validators/validation';
import { ValidationComposite } from '../../presentation/helpers/validators/validation-composite';

export const makeSignUpValidation = (): ValidationComposite => {
  const validations: IValidation[] = [];

  for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
    validations.push(new RequiredFieldValidation(field));
  }

  validations.push(
    new CompareFieldValidations('password', 'passwordConfirmation'),
  );

  return new ValidationComposite(validations);
};
