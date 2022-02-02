import { IController, IHttpResponse } from '../../presentation/protocols';
import { LogControllerDecorator } from './log';

interface ISutTypes {
  logControllerDecorator: LogControllerDecorator;
  controllerStub: IController;
}

const makeController = (): IController => {
  class ControllerStub implements IController {
    public async handle(): Promise<IHttpResponse> {
      const httpResponse: IHttpResponse = {
        statusCode: 200,
        body: {
          name: 'João',
        },
      };

      return httpResponse;
    }
  }

  return new ControllerStub();
};

const makeLogControllerDecorator = (): ISutTypes => {
  const controllerStub = makeController();

  const logControllerDecorator = new LogControllerDecorator(controllerStub);

  return { logControllerDecorator, controllerStub };
};

describe('Log Controller Decorator', () => {
  test('Should call controller handle', async () => {
    const { controllerStub, logControllerDecorator } =
      makeLogControllerDecorator();

    const handleSpy = jest.spyOn(controllerStub, 'handle');

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };

    await logControllerDecorator.handle(httpRequest);

    expect(handleSpy).toHaveBeenCalledWith(httpRequest);
  });
});
