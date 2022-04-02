import {
  IAuthenticationModel,
  IAuthentication,
} from '../../../domain/usecases/authentication';
import { IHashComparer } from '../../protocols/criptography/hash-comparer';
import { ITokenGenerator } from '../../protocols/criptography/token-generator';
import { ILoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository';

export class DbAuthentication implements IAuthentication {
  private readonly loadAccountByEmailRepository: ILoadAccountByEmailRepository;
  private readonly hashComparer: IHashComparer;
  private readonly tokenGenerator: ITokenGenerator;

  constructor(
    loadAccountByEmailRepository: ILoadAccountByEmailRepository,
    hashComparer: IHashComparer,
    tokenGenerator: ITokenGenerator,
  ) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository;
    this.hashComparer = hashComparer;
    this.tokenGenerator = tokenGenerator;
  }

  public async auth(data: IAuthenticationModel): Promise<string> {
    const account = await this.loadAccountByEmailRepository.load(data.email);

    if (!account) return null;

    const isValid = await this.hashComparer.compare(
      data.password,
      account.password,
    );

    if (!isValid) return null;

    const accessToken = await this.tokenGenerator.generate(account.id);

    return accessToken;
  }
}
