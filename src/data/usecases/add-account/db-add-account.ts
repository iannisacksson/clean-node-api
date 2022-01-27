import {
  IAccountModel,
  IEncrypter,
  IAddAccount,
  IAddAccountModel,
  IAddAccountRepository,
} from './db-add-account-protocols';

export class DbAddAccount implements IAddAccount {
  private readonly encrypter: IEncrypter;
  private readonly addAccountRepository: IAddAccountRepository;

  constructor(
    encrypter: IEncrypter,
    addAccountRepository: IAddAccountRepository,
  ) {
    this.encrypter = encrypter;
    this.addAccountRepository = addAccountRepository;
  }

  public async add(account: IAddAccountModel): Promise<IAccountModel> {
    const hashedPassword = await this.encrypter.encrypt(account.password);

    await this.addAccountRepository.add({
      ...account,
      password: hashedPassword,
    });

    return null;
  }
}