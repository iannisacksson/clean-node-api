import jwt from 'jsonwebtoken';

import { IEncrypter } from '../../../data/protocols/criptography/encrypter';

export class JwtAdapter implements IEncrypter {
  private readonly secret: string;

  constructor(secret: string) {
    this.secret = secret;
  }

  public async encrypt(value: string): Promise<string> {
    const accessToken = jwt.sign({ id: value }, this.secret);
    return accessToken;
  }
}
