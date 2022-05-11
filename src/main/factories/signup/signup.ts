import env from '../../config/env';
import { SignUpController } from '../../../presentation/controllers/signup/signup-controller';
import { DbAddAccount } from '../../../data/usecases/add-account/db-add-account';
import { BcryptAdapter } from '../../../infra/criptography/bcrypt-adapter/bcrypt-adapter';
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/account-mongo-repository';
import { IController } from '../../../presentation/protocols';
import { LogMongoRepository } from '../../../infra/db/mongodb/log/log-repository';
import { LogControllerDecorator } from '../../dacorators/log-controller-decorator';
import { makeSignUpValidation } from './signup-validation-factory';
import { DbAuthentication } from '../../../data/usecases/authentication/db-authentication';
import { JwtAdapter } from '../../../infra/criptography/jwt-adapter/jwt-adapter';

export const makeSignUpController = (): IController => {
  const salt = 12;

  const jwtAdapter = new JwtAdapter(env.jwtSecret);
  const bcryptAdapter = new BcryptAdapter(salt);
  const accountMongoRepository = new AccountMongoRepository();

  const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository);

  const dbAuthentication = new DbAuthentication(
    accountMongoRepository,
    bcryptAdapter,
    jwtAdapter,
    accountMongoRepository,
  );

  const signUpController = new SignUpController(
    dbAddAccount,
    makeSignUpValidation(),
    dbAuthentication,
  );

  const logMongoRepository = new LogMongoRepository();

  return new LogControllerDecorator(signUpController, logMongoRepository);
};
