import { Collection, MongoClient, ObjectId } from 'mongodb';

export const MongoHelper = {
  client: MongoClient,
  url: null as string,

  async connect(uri: string): Promise<void> {
    this.uri = uri;
    this.client = await MongoClient.connect(this.uri);
  },

  async disconnect(): Promise<void> {
    await this.client.close();
    this.client = null;
  },

  async getCollection(name: string): Promise<Collection> {
    if (!this.client) {
      await this.connect(this.uri);
    }

    return this.client.db().collection(name);
  },

  map: (collection: any): any => {
    const { _id, ...collectionWithoutId } = collection;

    const account = { ...collectionWithoutId, id: _id.toHexString() };

    return account;
  },

  objectId(id: string): ObjectId {
    return new ObjectId(id);
  },
};
