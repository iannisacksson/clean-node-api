import { DbAddAccount } from './db-add-account';

describe('DbAddAccount UseCase', () => {
  test('Should call Encrypter with correct password', async () => {
    class EncrypterStub {
      async encrypt(): Promise<string> {
        return 'hashed_password';
      }
    }

    const encrypterStub = new EncrypterStub();
    const dbAddAccount = new DbAddAccount(encrypterStub);

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
