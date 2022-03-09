import { ILogErrorRepository } from '../../data/protocols/log-error-repository';
import {
  IController,
  IHttpRequest,
  IHttpResponse,
} from '../../presentation/protocols';

class LogControllerDecorator implements IController {
  private readonly controller: IController;
  private readonly logErrorRepository: ILogErrorRepository;

  constructor(
    controller: IController,
    logErrorRepository: ILogErrorRepository,
  ) {
    this.controller = controller;
    this.logErrorRepository = logErrorRepository;
  }

  public async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const httpResponse = await this.controller.handle(httpRequest);

    if (httpResponse.statusCode === 500) {
      await this.logErrorRepository.log(httpResponse.body.stack);
    }

    return httpResponse;
  }
}

export { LogControllerDecorator };
