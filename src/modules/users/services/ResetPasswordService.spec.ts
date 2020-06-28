import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import AppError from '@shared/error/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import ResetPasswordService from './ResetPasswordService';

describe('ResetPassword', () => {
  let fakeUsersRepository: FakeUsersRepository;
  let fakeUserTokensRepository: FakeUserTokensRepository;
  let resetPassword: ResetPasswordService;
  let fakeHashProvider: FakeHashProvider;

  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserTokensRepository = new FakeUserTokensRepository();
    fakeHashProvider = new FakeHashProvider();
    resetPassword = new ResetPasswordService(
      fakeUsersRepository,
      fakeUserTokensRepository,
      fakeHashProvider,
    );
  });
  it('should be able to reset the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456',
    });

    const userToken = await fakeUserTokensRepository.generate(user.id);
    const generatedHash = jest.spyOn(fakeHashProvider, 'generatedHash');

    await resetPassword.execute({ password: '123123', token: userToken.token });
    const userUpdate = await fakeUsersRepository.findById(user.id);

    expect(generatedHash).toHaveBeenCalledWith('123123');
    expect(userUpdate?.password).toBe('123123');
  });

  it('should be able to reset the password with non-existings token', async () => {
    await expect(
      resetPassword.execute({
        password: '123456',
        token: 'non-existings-token',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to reset the password with non-existings user', async () => {
    const { token } = await fakeUserTokensRepository.generate(
      'non-existings-user',
    );

    await expect(
      resetPassword.execute({
        password: '123456',
        token,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset password if passed more than 2 hours', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456',
    });

    const { token } = await fakeUserTokensRepository.generate(user.id);

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customDate = new Date();
      return customDate.setHours(customDate.getHours() + 3);
    });

    await expect(
      resetPassword.execute({
        password: '123456',
        token,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
