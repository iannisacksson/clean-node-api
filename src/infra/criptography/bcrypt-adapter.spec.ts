import bcrypt from 'bcrypt';
import { BcryptAdapter } from './bcrypt-adapter';

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return 'hash';
  },
}));

const salt = 12;

const makeBcryptAdapter = (): BcryptAdapter => {
  return new BcryptAdapter(salt);
};

describe('Bcrypt Adapter', () => {
  test('Should call bcrypt with correct values', async () => {
    const bcryptAdapter = makeBcryptAdapter();

    const hashSpy = jest.spyOn(bcrypt, 'hash');

    await bcryptAdapter.encrypt('any_value');

    expect(hashSpy).toHaveBeenCalledWith('any_value', salt);
  });

  test('Should return a hash on success', async () => {
    const bcryptAdapter = makeBcryptAdapter();

    const hash = await bcryptAdapter.encrypt('any_value');

    expect(hash).toBe('hash');
  });
});
