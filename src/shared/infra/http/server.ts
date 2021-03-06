import 'reflect-metadata';

import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';

import cors from 'cors';

import '../typeorm';

import routes from '@shared/infra/http/routes';
import uploadConfig from '@config/upload';
import AppError from '@shared/error/AppError';
import { errors } from 'celebrate';
import rateLimiter from './middlewares/rateLimiter';

import '@shared/container/index';
import 'dotenv/config';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/files', express.static(uploadConfig.uploadsFolder));
app.use(rateLimiter);
app.use(routes);
app.use(errors());
app.use(
  (error: Error, request: Request, response: Response, _: NextFunction) => {
    if (error instanceof AppError) {
      return response
        .status(error.statusCode)
        .json({ status: 'error', message: error.message });
    }

    console.error(error);

    return response
      .status(500)
      .json({ status: 'error', message: 'Internal Server Error' });
  },
);

app.listen(process.env.PORT_SERVER, () => {
  console.log('Servidor em Funcionamento!!!!');
});
