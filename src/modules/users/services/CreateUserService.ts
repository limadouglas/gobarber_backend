import AppError from '@shared/error/AppError';
import Users from '@modules/users/infra/typeorm/entities/User';
import { injectable, inject } from 'tsyringe';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IUsersRepository from '../repositories/IUserRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface IRequest {
  name: string;
  email: string;
  password: string;
}

@injectable()
class CreateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider,
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ name, email, password }: IRequest): Promise<Users> {
    const checkUserExist = await this.usersRepository.findByEmail(email);
    if (checkUserExist) {
      throw new AppError('email address already used.');
    }

    const hashPassword = await this.hashProvider.generatedHash(password);

    const user = await this.usersRepository.create({
      name,
      email,
      password: hashPassword,
    });

    await this.cacheProvider.invalidatePrefix('providers-list');

    return user;
  }
}

export default CreateUserService;
