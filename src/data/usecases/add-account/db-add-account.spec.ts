import { IEncrypter } from '../../protocols/encrypter';
import { DbAddAccount } from './db-add-account';

interface ISutTypes {
  dbAddAccount: DbAddAccount;
  encrypterStub: IEncrypter;
}

const makeDbAddAccount = (): ISutTypes => {
  class EncrypterStub {
    async encrypt(): Promise<string> {
      return 'hashed_password';
    }
  }

  const encrypterStub = new EncrypterStub();
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
