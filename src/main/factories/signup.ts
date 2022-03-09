import { SignUpController } from '../../presentation/controllers/signup/signup';
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter';
import { DbAddAccount } from '../../data/usecases/add-account/db-add-account';
import { BcryptAdapter } from '../../infra/criptography/bcrypt-adapter';
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account';
import { IController } from '../../presentation/protocols';
import { LogControllerDecorator } from '../dacorators/log';
import { ILogErrorRepository } from '../../data/protocols/log-error-repository';

const makeLogErrorRepository = (): ILogErrorRepository => {
  class LogErrorRepositoryStub implements ILogErrorRepository {
    public async log(): Promise<void> {
      return null;
    }
  }

  return new LogErrorRepositoryStub();
};

export const makeSignUpController = (): IController => {
  const salt = 12;
  const emailValidatorAdapter = new EmailValidatorAdapter();

  const bcryptAdapter = new BcryptAdapter(salt);
  const accountMongoRepository = new AccountMongoRepository();

  const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository);

  const signUpController = new SignUpController(
    emailValidatorAdapter,
    dbAddAccount,
  );

  return new LogControllerDecorator(signUpController, makeLogErrorRepository());
};
