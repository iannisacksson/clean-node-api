import {
  IAccountModel,
  IHasher,
  IAddAccountRepository,
  IAddAccountModel,
} from './db-add-account-protocols';
import { DbAddAccount } from './db-add-account';

interface ISutTypes {
  dbAddAccount: DbAddAccount;
  hashStub: IHasher;
  addAccountRepositoryStub: IAddAccountRepository;
}

const makeHasher = (): IHasher => {
  class HasherStub implements IHasher {
    async hash(): Promise<string> {
      return 'hashed_password';
    }
  }

  return new HasherStub();
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
  const hashStub = makeHasher();
  const addAccountRepositoryStub = makeAddAccountRepository();

  const dbAddAccount = new DbAddAccount(hashStub, addAccountRepositoryStub);

  return { hashStub, dbAddAccount, addAccountRepositoryStub };
};

const makeFakeAccountData = (): IAddAccountModel => ({
  name: 'valid_name',
  email: 'valid_email',
  password: 'valid_password',
});

describe('DbAddAccount UseCase', () => {
  test('Should call Hasher with correct password', async () => {
    const { dbAddAccount, hashStub } = makeDbAddAccount();

    const hashSpy = jest.spyOn(hashStub, 'hash');

    await dbAddAccount.add(makeFakeAccountData());

    expect(hashSpy).toHaveBeenCalledWith('valid_password');
  });

  test('Should throw if Hasher throws', async () => {
    const { dbAddAccount, hashStub } = makeDbAddAccount();

    jest.spyOn(hashStub, 'hash').mockImplementationOnce(() => {
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
