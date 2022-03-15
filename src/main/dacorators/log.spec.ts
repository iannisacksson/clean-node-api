import {
  IController,
  IHttpRequest,
  IHttpResponse,
} from '../../presentation/protocols';
import { LogControllerDecorator } from './log';
import { serverError, ok } from '../../presentation/helpers/http/http-helper';
import { ILogErrorRepository } from '../../data/protocols/log-error-repository';
import { IAccountModel } from '../../domain/models/account';

interface ISutTypes {
  logControllerDecorator: LogControllerDecorator;
  controllerStub: IController;
  logErrorRepositoryStub: ILogErrorRepository;
}

const makeFakeAccount = (): IAccountModel => ({
  id: 'valid_id',
  name: 'any_name',
  email: 'invalid_email@mail.com',
  password: 'any_password',
});

const makeFakeServerError = (): IHttpResponse => {
  const fakeError = new Error();

  fakeError.stack = 'any_stack';

  return serverError(fakeError);
};

const makeController = (): IController => {
  class ControllerStub implements IController {
    public async handle(): Promise<IHttpResponse> {
      return ok(makeFakeAccount());
    }
  }

  return new ControllerStub();
};

const makeLogErrorRepository = (): ILogErrorRepository => {
  class LogErrorRepositoryStub implements ILogErrorRepository {
    public async logError(): Promise<void> {
      return null;
    }
  }

  return new LogErrorRepositoryStub();
};

const makeFakeRequest = (): IHttpRequest => ({
  body: {
    name: 'any_name',
    email: 'invalid_email@mail.com',
    password: 'any_password',
    passwordConfirmation: 'any_password',
  },
});

const makeLogControllerDecorator = (): ISutTypes => {
  const controllerStub = makeController();
  const logErrorRepositoryStub = makeLogErrorRepository();

  const logControllerDecorator = new LogControllerDecorator(
    controllerStub,
    logErrorRepositoryStub,
  );

  return { logControllerDecorator, controllerStub, logErrorRepositoryStub };
};

describe('Log Controller Decorator', () => {
  test('Should call controller handle', async () => {
    const { controllerStub, logControllerDecorator } =
      makeLogControllerDecorator();

    const handleSpy = jest.spyOn(controllerStub, 'handle');

    await logControllerDecorator.handle(makeFakeRequest());

    expect(handleSpy).toHaveBeenCalledWith(makeFakeRequest());
  });

  test('Should return the same result of the controller', async () => {
    const { logControllerDecorator } = makeLogControllerDecorator();

    const httpResponse = await logControllerDecorator.handle(makeFakeRequest());

    expect(httpResponse).toEqual(ok(makeFakeAccount()));
  });

  test('Should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { logControllerDecorator, controllerStub, logErrorRepositoryStub } =
      makeLogControllerDecorator();

    const logSpy = jest.spyOn(logErrorRepositoryStub, 'logError');

    jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(
      new Promise(resolve => {
        resolve(makeFakeServerError());
      }),
    );

    await logControllerDecorator.handle(makeFakeRequest());

    expect(logSpy).toHaveBeenCalledWith('any_stack');
  });
});
