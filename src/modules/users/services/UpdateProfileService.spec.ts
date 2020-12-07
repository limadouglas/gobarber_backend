import AppError from '@shared/error/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateProfile from './UpdateProfileService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let fakeHashProvider: FakeHashProvider;
let fakeUsersRepository: FakeUsersRepository;
let updateProfile: UpdateProfile;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeHashProvider = new FakeHashProvider();
    fakeUsersRepository = new FakeUsersRepository();
    updateProfile = new UpdateProfile(fakeUsersRepository, fakeHashProvider);
  });

  it('should be able update the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: 'abc@123',
    });

    const updateUser = await updateProfile.execute({
      user_id: user.id,
      name: 'John Trê',
      email: 'johntre@email.com',
    });

    expect(updateUser.name).toBe('John Trê');
    expect(updateUser.email).toBe('johntre@email.com');
  });

  it('shold not be able update the profile from not-existings user ', async () => {
    await expect(
      updateProfile.execute({
        user_id: 'user-not-exists',
        name: 'John Doe',
        email: 'johndoe@email.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to change to another user email', async () => {
    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: 'abc@123',
    });

    const user = await fakeUsersRepository.create({
      name: 'teste',
      email: 'teste@email.com',
      password: 'teste@123',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'john Doe',
        email: 'johndoe@email.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able update password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: 'abc@123',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'John Trê',
      email: 'johntre@email.com',
      old_password: 'abc@123',
      password: '123123',
    });

    expect(updatedUser.password).toBe('123123');
  });

  it('should not be able update the password without old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: 'abc@123',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'John Trê',
        email: 'johntre@email.com',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able update the password without wrong old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: 'abc@123',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'John Trê',
        email: 'johntre@email.com',
        old_password: 'password-wrong',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
