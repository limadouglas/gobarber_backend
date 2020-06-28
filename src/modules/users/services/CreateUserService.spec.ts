import AppError from '@shared/error/AppError';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import FakeUserRepository from '../repositories/fakes/FakeUsersRepository';
import CreateUser from './CreateUserService';

describe('CreateUser', () => {
  let fakeUserRepository: FakeUserRepository;
  let fakeHashProvider: FakeHashProvider;
  let createUser: CreateUser;

  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    fakeHashProvider = new FakeHashProvider();
    createUser = new CreateUser(fakeUserRepository, fakeHashProvider);
  });

  it('should be able to create a new user', async () => {
    const user = await createUser.execute({
      name: 'Douglas Henrique',
      email: 'd@d.com',
      password: '123456',
    });

    expect(user).toHaveProperty('id');
  });

  it('should not be able to create new user with same email from another', async () => {
    await createUser.execute({
      name: 'Douglas Henrique',
      email: 'd@d.com',
      password: '123456',
    });

    await expect(
      createUser.execute({
        name: 'Douglas Henrique',
        email: 'd@d.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
