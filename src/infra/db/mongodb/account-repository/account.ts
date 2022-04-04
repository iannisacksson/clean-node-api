import { IAddAccountRepository } from '../../../../data/protocols/db/add-account-repository';
import { IAddAccountModel } from '../../../../domain/usecases/add-account';
import { IAccountModel } from '../../../../domain/models/account';
import { MongoHelper } from '../helpers/mongo-helper';
import { ILoadAccountByEmailRepository } from '../../../../data/protocols/db/load-account-by-email-repository';

export class AccountMongoRepository
  implements IAddAccountRepository, ILoadAccountByEmailRepository
{
  public async add(accountData: IAddAccountModel): Promise<IAccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts');

    const { insertedId } = await accountCollection.insertOne(accountData);

    const account = await accountCollection.findOne({ _id: insertedId });

    return MongoHelper.map(account);
  }

  public async loadByEmail(email: string): Promise<IAccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts');

    const account = await accountCollection.findOne({ email });

    return account && MongoHelper.map(account);
  }
}
