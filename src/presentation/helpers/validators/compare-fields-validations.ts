import { InvalidParamError } from '../../errors';
import { IValidation } from './validation';

export class CompareFieldValidations implements IValidation {
  private readonly fieldName: string;
  private readonly fieldToCompareName: string;

  constructor(fieldName: string, fieldToCompareName: string) {
    this.fieldName = fieldName;
    this.fieldToCompareName = fieldToCompareName;
  }

  public validate(input: any): Error | null {
    if (input[this.fieldName] !== input[this.fieldToCompareName]) {
      return new InvalidParamError(this.fieldToCompareName);
    }

    return null;
  }
}
