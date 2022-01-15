import { IAccountModel } from '../../../domain/models/account';
import { IEncrypter } from '../../protocols/encrypter';
import {
  IAddAccount,
  IAddAccountModel,
} from '../../../domain/usecases/add-account';

export class DbAddAccount implements IAddAccount {
  private readonly encrypter: IEncrypter;

  constructor(encrypter: IEncrypter) {
    this.encrypter = encrypter;
  }

  public async add(account: IAddAccountModel): Promise<IAccountModel> {
    await this.encrypter.encrypt(account.password);

    return null;
  }
}
