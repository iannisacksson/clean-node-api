import bcrypt from 'bcrypt';
import { IHashComparer } from '../../../data/protocols/criptography/hash-comparer';

import { IHasher } from '../../../data/protocols/criptography/hasher';

export class BcryptAdapter implements IHasher, IHashComparer {
  constructor(private readonly salt: number) {
    this.salt = salt;
  }

  public async hash(value: string): Promise<string> {
    const hash = await bcrypt.hash(value, this.salt);

    return hash;
  }

  public async compare(value: string, hash: string): Promise<boolean> {
    const isValid = bcrypt.compare(value, hash);

    return isValid;
  }
}
