import { container } from 'tsyringe';
import SESMailProvider from './implementations/SESMailProvider';
import EtherealMailProvider from './implementations/EtherealMailProvider';
import mailConfig from '../../../../config/mail';
import IMailProvider from './models/IMailProvider';

const providers = {
  ethereal: container.resolve(EtherealMailProvider),
  ses: container.resolve(SESMailProvider),
};

container.registerInstance<IMailProvider>(
  'MailProvider',
  providers[mailConfig.driver],
);
