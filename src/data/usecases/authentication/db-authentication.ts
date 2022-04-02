import {
  IAuthenticationModel,
  IAuthentication,
} from '../../../domain/usecases/authentication';
import { IHashComparer } from '../../protocols/criptography/hash-comparer';
import { ILoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository';

export class DbAuthentication implements IAuthentication {
  private readonly loadAccountByEmailRepository: ILoadAccountByEmailRepository;
  private readonly hashComparer: IHashComparer;

  constructor(
    loadAccountByEmailRepository: ILoadAccountByEmailRepository,
    hashComparer: IHashComparer,
  ) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository;
    this.hashComparer = hashComparer;
  }

  public async auth(data: IAuthenticationModel): Promise<string> {
    const account = await this.loadAccountByEmailRepository.load(data.email);

    if (!account) {
      return null;
    }

    await this.hashComparer.compare(data.password, account.password);

    return null;
  }
}
