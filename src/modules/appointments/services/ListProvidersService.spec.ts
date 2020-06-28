import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ListProvidersService from './ListProvidersService';

describe('ListProviders', () => {
  let fakeUsersRepository: FakeUsersRepository;
  let listProviders: ListProvidersService;
  beforeAll(() => {
    fakeUsersRepository = new FakeUsersRepository();
    listProviders = new ListProvidersService(fakeUsersRepository);
  });

  it('list providers', async () => {
    const user1 = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456',
    });
    const user2 = await fakeUsersRepository.create({
      name: 'John Trê',
      email: 'johntre@email.com',
      password: '123456',
    });
    const loggedUser = await fakeUsersRepository.create({
      name: 'John Qua',
      email: 'johnqua@email.com',
      password: '123456',
    });
    const providers = await listProviders.execute({ user_id: loggedUser.id });

    expect(providers).toEqual([user1, user2]);
  });
});
