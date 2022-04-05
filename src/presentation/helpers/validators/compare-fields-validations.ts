import { InvalidParamError } from '../../errors';
import { IValidation } from '../../protocols/validation';

export class CompareFieldValidations implements IValidation {
  constructor(
    private readonly fieldName: string,
    private readonly fieldToCompareName: string,
  ) {}

  public validate(input: any): Error | null {
    if (input[this.fieldName] !== input[this.fieldToCompareName]) {
      return new InvalidParamError(this.fieldToCompareName);
    }

    return null;
  }
}
