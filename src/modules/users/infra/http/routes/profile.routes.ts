import { Router } from 'express';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/EnsureAuthenticated';
import UpdateController from '@modules/users/infra/http/controllers/ProfileController';

const profileRouter = Router();
const updateController = new UpdateController();

profileRouter.use(ensureAuthenticated);

profileRouter.put('/', updateController.update);
profileRouter.get('/', updateController.show);

export default profileRouter;
