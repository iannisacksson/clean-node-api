import { IAddAccountRepository } from '../../../../data/protocols/db/add-account-repository';
import { IAddAccountModel } from '../../../../domain/usecases/add-account';
import { IAccountModel } from '../../../../domain/models/account';
import { MongoHelper } from '../helpers/mongo-helper';

export class AccountMongoRepository implements IAddAccountRepository {
  public async add(accountData: IAddAccountModel): Promise<IAccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts');

    const { insertedId } = await accountCollection.insertOne(accountData);

    const account = await accountCollection.findOne({ _id: insertedId });

    return MongoHelper.map(account);
  }
}
