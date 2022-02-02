import {
  IController,
  IHttpRequest,
  IHttpResponse,
} from '../../presentation/protocols';

class LogControllerDecorator implements IController {
  private readonly controller: IController;

  constructor(controller: IController) {
    this.controller = controller;
  }

  public async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.controller.handle(httpRequest);
  }
}

export { LogControllerDecorator };
