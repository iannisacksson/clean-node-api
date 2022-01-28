import { IAddAccountRepository } from '../../../../data/protocols/add-account-repository';
import { IAddAccountModel } from '../../../../domain/usecases/add-account';
import { IAccountModel } from '../../../../domain/models/account';
import { MongoHelper } from '../helpers/mongo-helper';

export class AccountMongoRepository implements IAddAccountRepository {
  public async add(accountData: IAddAccountModel): Promise<IAccountModel> {
    const accountCollection = MongoHelper.getCollection('accounts');

    const result = await accountCollection.insertOne(accountData);

    const { _id, ...accountWithoutId } = await accountCollection.findOne({
      _id: result.insertedId,
    });

    const account = {
      ...accountWithoutId,
      id: _id.toHexString(),
    } as IAccountModel;

    return account;
  }
}
