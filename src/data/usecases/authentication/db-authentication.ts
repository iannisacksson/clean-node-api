import {
  IAuthenticationModel,
  IAuthentication,
  IHashComparer,
  ILoadAccountByEmailRepository,
  IEncrypter,
  IUpdateAccessTokenRepository,
} from './db-authentication-protocols';

export class DbAuthentication implements IAuthentication {
  constructor(
    private readonly loadAccountByEmailRepository: ILoadAccountByEmailRepository,
    private readonly hashComparer: IHashComparer,
    private readonly encrypter: IEncrypter,
    private readonly updateAccessTokenRepository: IUpdateAccessTokenRepository,
  ) {}

  public async auth(data: IAuthenticationModel): Promise<string> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(
      data.email,
    );

    if (!account) return null;

    const isValid = await this.hashComparer.compare(
      data.password,
      account.password,
    );

    if (!isValid) return null;

    const accessToken = await this.encrypter.encrypt(account.id);

    await this.updateAccessTokenRepository.updateAccessToken(
      account.id,
      accessToken,
    );

    return accessToken;
  }
}
