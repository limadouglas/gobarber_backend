import AppError from '@shared/error/AppError';
import Users from '@modules/users/infra/typeorm/entities/User';
import { injectable, inject } from 'tsyringe';
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
    return user;
  }
}

export default CreateUserService;
