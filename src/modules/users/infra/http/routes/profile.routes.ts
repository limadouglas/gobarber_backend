import { Router } from 'express';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/EnsureAuthenticated';
import UpdateController from '@modules/users/infra/http/controllers/ProfileController';
import { celebrate, Joi, Segments } from 'celebrate';

const profileRouter = Router();
const updateController = new UpdateController();

profileRouter.use(ensureAuthenticated);

profileRouter.put(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      old_password: Joi.string(),
      password: Joi.string(),
      password_confirmation: Joi.string().valid(Joi.ref('password')),
    },
  }),
  updateController.update,
);
profileRouter.get('/', updateController.show);

export default profileRouter;
