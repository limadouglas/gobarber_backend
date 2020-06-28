import IUserRepository from '@modules/users/repositories/IUserRepository';
import { uuid } from 'uuidv4';
import IFindAllProvidersDTO from '@modules/users/dtos/IFindAllProvidersDTO';
import User from '../../infra/typeorm/entities/User';
import ICreateUserDTO from '../../dtos/ICreateUserDTO';

class FakeUsersRepository implements IUserRepository {
  private users: User[] = [];

  public async findByEmail(email: string): Promise<User | undefined> {
    const user = this.users.find((userFind) => userFind.email === email);
    return user || undefined;
  }

  public async findById(id: string): Promise<User | undefined> {
    const user = this.users.find((userFind) => userFind.id === id);
    return user || undefined;
  }

  public async findAllProviders({
    except_user_id,
  }: IFindAllProvidersDTO): Promise<User[]> {
    let { users } = this;

    if (except_user_id) {
      users = this.users.filter((user) => user.id !== except_user_id);
    }

    return users;
  }

  public async create(userData: ICreateUserDTO): Promise<User> {
    const user = new User();
    Object.assign(user, { id: uuid() }, userData);
    this.users.push(user);
    return user;
  }

  public async save(user: User): Promise<User> {
    const findIndex = this.users.findIndex(
      (userFind) => userFind.id === user.id,
    );
    this.users[findIndex] = user;

    return user;
  }
}

export default FakeUsersRepository;
