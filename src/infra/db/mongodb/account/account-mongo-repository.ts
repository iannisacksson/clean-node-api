import { IAddAccountRepository } from '../../../../data/protocols/db/account/add-account-repository';
import { IAddAccountModel } from '../../../../domain/usecases/add-account';
import { IAccountModel } from '../../../../domain/models/account';
import { MongoHelper } from '../helpers/mongo-helper';
import { ILoadAccountByEmailRepository } from '../../../../data/protocols/db/account/load-account-by-email-repository';
import { IUpdateAccessTokenRepository } from '../../../../data/protocols/db/account/update-access-token-repository';

export class AccountMongoRepository
  implements
    IAddAccountRepository,
    ILoadAccountByEmailRepository,
    IUpdateAccessTokenRepository
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

  public async updateAccessToken(id: string, token: string): Promise<void> {
    const accountCollection = await MongoHelper.getCollection('accounts');

    await accountCollection.updateOne(
      { _id: MongoHelper.objectId(id) },
      { $set: { accessToken: token } },
    );
  }
}
