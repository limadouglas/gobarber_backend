import { injectable, inject } from 'tsyringe';
import AppError from '@shared/error/AppError';
import { differenceInHours } from 'date-fns';
import IUsersRepository from '../repositories/IUserRepository';
import IUserTokensRepository from '../repositories/IUserTokensRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface IRequest {
  password: string;
  token: string;
}

@injectable()
class ResetPasswordService {
  constructor(
    @inject('UsersRepository')
    private userRepository: IUsersRepository,
    @inject('UserTokensRepository')
    private userTokenRepository: IUserTokensRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({ password, token }: IRequest): Promise<void> {
    const userToken = await this.userTokenRepository.findByToken(token);

    if (!userToken) {
      throw new AppError('user token does not exists');
    }

    const user = await this.userRepository.findById(userToken.user_id);

    if (!user) {
      throw new AppError('user does not exists');
    }

    if (differenceInHours(Date.now(), userToken.created_at) > 2) {
      throw new AppError('token expired');
    }

    user.password = await this.hashProvider.generatedHash(password);

    this.userRepository.save(user);
  }
}

export default ResetPasswordService;
