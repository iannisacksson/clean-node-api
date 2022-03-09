import {
  IAccountModel,
  IEncrypter,
  IAddAccountRepository,
  IAddAccountModel,
} from './db-add-account-protocols';
import { DbAddAccount } from './db-add-account';

interface ISutTypes {
  dbAddAccount: DbAddAccount;
  encrypterStub: IEncrypter;
  addAccountRepositoryStub: IAddAccountRepository;
}

const makeEncrypter = (): IEncrypter => {
  class EncrypterStub implements IEncrypter {
    async encrypt(): Promise<string> {
      return 'hashed_password';
    }
  }

  return new EncrypterStub();
};

const makeFakeAccount = (): IAccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email',
  password: 'hashed_password',
});

const makeAddAccountRepository = (): IAddAccountRepository => {
  class AddAccountRepositoryStub implements IAddAccountRepository {
    async add(): Promise<IAccountModel> {
      return makeFakeAccount();
    }
  }

  return new AddAccountRepositoryStub();
};

const makeDbAddAccount = (): ISutTypes => {
  const encrypterStub = makeEncrypter();
  const addAccountRepositoryStub = makeAddAccountRepository();

  const dbAddAccount = new DbAddAccount(
    encrypterStub,
    addAccountRepositoryStub,
  );

  return { encrypterStub, dbAddAccount, addAccountRepositoryStub };
};

const makeFakeAccountData = (): IAddAccountModel => ({
  name: 'valid_name',
  email: 'valid_email',
  password: 'valid_password',
});

describe('DbAddAccount UseCase', () => {
  test('Should call Encrypter with correct password', async () => {
    const { dbAddAccount, encrypterStub } = makeDbAddAccount();

    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt');

    await dbAddAccount.add(makeFakeAccountData());

    expect(encryptSpy).toHaveBeenCalledWith('valid_password');
  });

  test('Should throw if Encrypter throws', async () => {
    const { dbAddAccount, encrypterStub } = makeDbAddAccount();

    jest.spyOn(encrypterStub, 'encrypt').mockImplementationOnce(() => {
      throw new Error();
    });

    const promise = dbAddAccount.add(makeFakeAccountData());

    await expect(promise).rejects.toThrow();
  });

  test('Should call AddAccountRepository with correct values', async () => {
    const { dbAddAccount, addAccountRepositoryStub } = makeDbAddAccount();

    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add');

    await dbAddAccount.add(makeFakeAccountData());

    expect(addSpy).toHaveBeenCalledWith({
      name: 'valid_name',
      email: 'valid_email',
      password: 'hashed_password',
    });
  });

  test('Should throw if AddAccountRepository throws', async () => {
    const { dbAddAccount, addAccountRepositoryStub } = makeDbAddAccount();

    jest.spyOn(addAccountRepositoryStub, 'add').mockImplementationOnce(() => {
      throw new Error();
    });

    const promise = dbAddAccount.add(makeFakeAccountData());

    await expect(promise).rejects.toThrow();
  });

  test('Should return an account on success', async () => {
    const { dbAddAccount } = makeDbAddAccount();

    const account = await dbAddAccount.add(makeFakeAccountData());

    expect(account).toEqual(makeFakeAccount());
  });
});
