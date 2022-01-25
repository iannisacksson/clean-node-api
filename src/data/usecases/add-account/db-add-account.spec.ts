import { IEncrypter } from '../../protocols/encrypter';
import { DbAddAccount } from './db-add-account';

interface ISutTypes {
  dbAddAccount: DbAddAccount;
  encrypterStub: IEncrypter;
}

const makeEncrypter = (): IEncrypter => {
  class EncrypterStub implements IEncrypter {
    async encrypt(): Promise<string> {
      return 'hashed_password';
    }
  }

  return new EncrypterStub();
};

const makeDbAddAccount = (): ISutTypes => {
  const encrypterStub = makeEncrypter();
  const dbAddAccount = new DbAddAccount(encrypterStub);

  return { encrypterStub, dbAddAccount };
};

describe('DbAddAccount UseCase', () => {
  test('Should call Encrypter with correct password', async () => {
    const { dbAddAccount, encrypterStub } = makeDbAddAccount();

    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt');

    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password',
    };

    await dbAddAccount.add(accountData);

    expect(encryptSpy).toHaveBeenCalledWith('valid_password');
  });
});
