import { IController, IHttpResponse } from '../../presentation/protocols';
import { LogControllerDecorator } from './log';

describe('Log Controller Decorator', () => {
  test('Should call controller handle', async () => {
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
    const controllerStub = new ControllerStub();

    const handleSpy = jest.spyOn(controllerStub, 'handle');

    const logControllerDecorator = new LogControllerDecorator(controllerStub);

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
