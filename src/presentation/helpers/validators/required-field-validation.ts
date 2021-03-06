import { MissingParamError } from '../../errors';
import { IValidation } from '../../protocols/validation';

export class RequiredFieldValidation implements IValidation {
  constructor(private readonly fieldName: string) {}

  public validate(input: any): Error | null {
    if (!input[this.fieldName]) {
      return new MissingParamError(this.fieldName);
    }

    return null;
  }
}
