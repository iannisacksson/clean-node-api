import { Collection } from 'mongodb';
import { MongoHelper } from '../helpers/mongo-helper';
import { AccountMongoRepository } from './account';

let accountCollection: Collection;

describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts');

    await accountCollection.deleteMany({});
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  const makeAccountMongoRepository = (): AccountMongoRepository => {
    return new AccountMongoRepository();
  };

  test('should return an account on add success', async () => {
    const accountMongoRepository = makeAccountMongoRepository();

    const account = await accountMongoRepository.add({
      name: 'any_name',
      email: 'any_email',
      password: 'any_password',
    });

    expect(account).toBeTruthy();
    expect(account.id).toBeTruthy();
    expect(account.email).toBe('any_email');
    expect(account.password).toBe('any_password');
  });

  test('should return an account on loadByEmail success', async () => {
    const accountMongoRepository = makeAccountMongoRepository();
    await accountCollection.insertOne({
      name: 'any_name',
      email: 'any_email',
      password: 'any_password',
    });

    const account = await accountMongoRepository.loadByEmail('any_email');

    expect(account).toBeTruthy();
    expect(account.id).toBeTruthy();
    expect(account.email).toBe('any_email');
    expect(account.password).toBe('any_password');
  });

  test('should return null if loadByEmail fails', async () => {
    const accountMongoRepository = makeAccountMongoRepository();

    const account = await accountMongoRepository.loadByEmail('any_email');

    expect(account).toBeFalsy();
  });
});
