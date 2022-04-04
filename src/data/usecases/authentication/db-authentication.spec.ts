import { DbAuthentication } from './db-authentication';
import {
  IAuthenticationModel,
  IAccountModel,
  IHashComparer,
  ILoadAccountByEmailRepository,
  IEncrypter,
  IUpdateAccessTokenRepository,
} from './db-authentication-protocols';

interface ISutTypes {
  loadAccountByEmailRepositoryStub: ILoadAccountByEmailRepository;
  dbAuthentication: DbAuthentication;
  hashComparerStub: IHashComparer;
  encrypterStub: IEncrypter;
  updateAccessTokenRepositoryStub: IUpdateAccessTokenRepository;
}

const makeFakeAccount = (): IAccountModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'hashed_password',
});

const makeFakeAuthentication = (): IAuthenticationModel => ({
  email: 'any_email@mail.com',
  password: 'any_password',
});

const makeLoadAccountByEmailRepository = (): ILoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub
    implements ILoadAccountByEmailRepository
  {
    async load(): Promise<IAccountModel> {
      return makeFakeAccount();
    }
  }

  return new LoadAccountByEmailRepositoryStub();
};

const makeHashComparer = (): IHashComparer => {
  class HashedComparerStub implements IHashComparer {
    async compare(): Promise<boolean> {
      return true;
    }
  }

  return new HashedComparerStub();
};

const makeEncrypter = (): IEncrypter => {
  class EncrypterStub implements IEncrypter {
    async encrypt(): Promise<string> {
      return 'any_token';
    }
  }

  return new EncrypterStub();
};

const makeUpdateAccessTokenRepository = (): IUpdateAccessTokenRepository => {
  class UpdateAccessTokenRepository implements IUpdateAccessTokenRepository {
    async updateAccessToken(): Promise<void> {
      return new Promise(resolve => resolve());
    }
  }

  return new UpdateAccessTokenRepository();
};

const makeSut = (): ISutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository();
  const hashComparerStub = makeHashComparer();
  const encrypterStub = makeEncrypter();
  const updateAccessTokenRepositoryStub = makeUpdateAccessTokenRepository();

  const dbAuthentication = new DbAuthentication(
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    encrypterStub,
    updateAccessTokenRepositoryStub,
  );

  return {
    loadAccountByEmailRepositoryStub,
    dbAuthentication,
    hashComparerStub,
    encrypterStub,
    updateAccessTokenRepositoryStub,
  };
};

describe('DbAuthentication UseCase', () => {
  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { dbAuthentication, loadAccountByEmailRepositoryStub } = makeSut();

    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load');

    await dbAuthentication.auth(makeFakeAuthentication());

    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com');
  });

  test('Should throw if LoadAccountByEmailRepository throws', async () => {
    const { dbAuthentication, loadAccountByEmailRepositoryStub } = makeSut();

    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'load')
      .mockImplementationOnce(() => {
        throw new Error();
      });

    const promise = dbAuthentication.auth(makeFakeAuthentication());

    await expect(promise).rejects.toThrow();
  });

  test('Should return null if LoadAccountByEmailRepository returns null', async () => {
    const { dbAuthentication, loadAccountByEmailRepositoryStub } = makeSut();

    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'load')
      .mockReturnValueOnce(null);

    const accessToken = await dbAuthentication.auth(makeFakeAuthentication());

    expect(accessToken).toBeNull();
  });

  test('Should call HashComparer with correct values', async () => {
    const { dbAuthentication, hashComparerStub } = makeSut();

    const compareSpy = jest.spyOn(hashComparerStub, 'compare');

    await dbAuthentication.auth(makeFakeAuthentication());

    expect(compareSpy).toHaveBeenCalledWith('any_password', 'hashed_password');
  });

  test('Should throw if HashComparer throws', async () => {
    const { dbAuthentication, hashComparerStub } = makeSut();

    jest.spyOn(hashComparerStub, 'compare').mockImplementationOnce(() => {
      throw new Error();
    });

    const promise = dbAuthentication.auth(makeFakeAuthentication());

    await expect(promise).rejects.toThrow();
  });

  test('Should return null if HashComparer returns false', async () => {
    const { dbAuthentication, hashComparerStub } = makeSut();

    jest
      .spyOn(hashComparerStub, 'compare')
      .mockReturnValueOnce(new Promise(resolve => resolve(false)));

    const accessToken = await dbAuthentication.auth(makeFakeAuthentication());

    expect(accessToken).toBeNull();
  });

  test('Should call Encrypter with correct id', async () => {
    const { dbAuthentication, encrypterStub } = makeSut();

    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt');

    await dbAuthentication.auth(makeFakeAuthentication());

    expect(encryptSpy).toHaveBeenCalledWith('any_id');
  });

  test('Should throw if Encrypter throws', async () => {
    const { dbAuthentication, encrypterStub } = makeSut();

    jest.spyOn(encrypterStub, 'encrypt').mockImplementationOnce(() => {
      throw new Error();
    });

    const promise = dbAuthentication.auth(makeFakeAuthentication());

    await expect(promise).rejects.toThrow();
  });

  test('Should returns a token on success', async () => {
    const { dbAuthentication } = makeSut();

    const accessToken = await dbAuthentication.auth(makeFakeAuthentication());

    expect(accessToken).toBe('any_token');
  });

  test('Should call UpdateAccessTokenRepository with correct values', async () => {
    const { dbAuthentication, updateAccessTokenRepositoryStub } = makeSut();

    const updateSpy = jest.spyOn(
      updateAccessTokenRepositoryStub,
      'updateAccessToken',
    );

    await dbAuthentication.auth(makeFakeAuthentication());

    expect(updateSpy).toHaveBeenCalledWith('any_id', 'any_token');
  });

  test('Should throw if UpdateAccessTokenRepository throws', async () => {
    const { dbAuthentication, updateAccessTokenRepositoryStub } = makeSut();

    jest
      .spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken')
      .mockImplementationOnce(() => {
        throw new Error();
      });

    const promise = dbAuthentication.auth(makeFakeAuthentication());

    await expect(promise).rejects.toThrow();
  });
});
