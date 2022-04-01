import {
  IAuthenticationModel,
  IAuthentication,
} from '../../../domain/usecases/authentication';
import { ILoadAccountByEmailRepository } from '../../protocols/load-account-by-email-repository';

export class DbAuthentication implements IAuthentication {
  private readonly loadAccountByEmailRepository: ILoadAccountByEmailRepository;

  constructor(loadAccountByEmailRepository: ILoadAccountByEmailRepository) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository;
  }

  public async auth(data: IAuthenticationModel): Promise<string> {
    await this.loadAccountByEmailRepository.load(data.email);

    return null;
  }
}
