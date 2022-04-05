import { Collection } from 'mongodb';
import { MongoHelper } from '../helpers/mongo-helper';
import { LogMongoRepository } from './log-repository';

const makeLogMongoRepository = () => {
  return new LogMongoRepository();
};

describe('Log Mongo Reposiroty', () => {
  let errorCollection: Collection;

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  beforeEach(async () => {
    errorCollection = await MongoHelper.getCollection('errors');

    await errorCollection.deleteMany({});
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  test('Should create an error log on success', async () => {
    const logMongoRepository = makeLogMongoRepository();

    await logMongoRepository.logError('any_error');

    const count = await errorCollection.countDocuments();

    expect(count).toBe(1);
  });
});
