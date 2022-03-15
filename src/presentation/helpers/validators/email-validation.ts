import { InvalidParamError } from '../../errors';
import { IEmailValidator } from '../../protocols/email-validator';
import { IValidation } from '../../protocols/validation';

export class EmailValidation implements IValidation {
  private readonly fieldName: string;
  private readonly emailValidator: IEmailValidator;

  constructor(fieldName: string, emailValidator: IEmailValidator) {
    this.fieldName = fieldName;
    this.emailValidator = emailValidator;
  }

  public validate(input: any): Error | null {
    const isValid = this.emailValidator.isValid(input[this.fieldName]);

    if (!isValid) {
      return new InvalidParamError(this.fieldName);
    }

    return null;
  }
}
