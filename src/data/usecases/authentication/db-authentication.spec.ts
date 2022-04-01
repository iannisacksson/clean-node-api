import { ILoadAccountByEmailRepository } from '../../protocols/load-account-by-email-repository';
import { IAccountModel } from '../add-account/db-add-account-protocols';
import { DbAuthentication } from './db-authentication';

describe('DbAuthentication UseCase', () => {
  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    class LoadAccountByEmailRepositoryStub
      implements ILoadAccountByEmailRepository
    {
      async load(): Promise<IAccountModel> {
        const account: IAccountModel = {
          id: 'any_id',
          name: 'any_name',
          email: 'any_email@mail.com',
          password: 'any_password',
        };
        return account;
      }
    }

    const loadAccountByEmailRepositoryStub =
      new LoadAccountByEmailRepositoryStub();
    const dbAuthentication = new DbAuthentication(
      loadAccountByEmailRepositoryStub,
    );

    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load');

    dbAuthentication.auth({
      email: 'any_email@mail.com',
      password: 'any_password',
    });

    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com');
  });
});
