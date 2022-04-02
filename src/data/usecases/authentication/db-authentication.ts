import {
  IAuthenticationModel,
  IAuthentication,
  IHashComparer,
  ILoadAccountByEmailRepository,
  ITokenGenerator,
  IUpdateAccessTokenRepository,
} from './db-authentication-protocols';

export class DbAuthentication implements IAuthentication {
  private readonly loadAccountByEmailRepository: ILoadAccountByEmailRepository;
  private readonly hashComparer: IHashComparer;
  private readonly tokenGenerator: ITokenGenerator;
  private readonly updateAccessTokenRepository: IUpdateAccessTokenRepository;

  constructor(
    loadAccountByEmailRepository: ILoadAccountByEmailRepository,
    hashComparer: IHashComparer,
    tokenGenerator: ITokenGenerator,
    updateAccessTokenRepository: IUpdateAccessTokenRepository,
  ) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository;
    this.hashComparer = hashComparer;
    this.tokenGenerator = tokenGenerator;
    this.updateAccessTokenRepository = updateAccessTokenRepository;
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

    await this.updateAccessTokenRepository.update(account.id, accessToken);

    return accessToken;
  }
}
