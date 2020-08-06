import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import AppError from '@shared/error/AppError';
import FakeUserRepository from '../repositories/fakes/FakeUsersRepository';
import CreateUser from './CreateUserService';
import AuthenticateUserService from './AuthenticateUserService';

describe('AuthenticateUser', () => {
  let fakeUserRepository: FakeUserRepository;
  let fakeHashProvider: FakeHashProvider;
  let createUser: CreateUser;
  let authenticateUser: AuthenticateUserService;

  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    fakeHashProvider = new FakeHashProvider();
    authenticateUser = new AuthenticateUserService(
      fakeUserRepository,
      fakeHashProvider,
    );
  });
  it('shold be able to authenticate', async () => {
    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: 'abc123@',
    });
    const response = await authenticateUser.execute({
      email: 'johndoe@email.com',
      password: 'abc123@',
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('shold not be able to authenticate with non existing user', async () => {
    await expect(
      authenticateUser.execute({
        email: 'johndoe@email.com',
        password: 'abc123@',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('shold not be able to authenticate with wrong password', async () => {
    await fakeUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: 'abc123@',
    });

    await expect(
      authenticateUser.execute({
        email: 'johndoe@email.com',
        password: 'senhaerrada',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
