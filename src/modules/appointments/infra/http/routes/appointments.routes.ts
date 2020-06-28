import { Router } from 'express';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/EnsureAuthenticated';
import AppointmentsController from '../controllers/AppointmentsController';

const appointmentsRouter = Router();
const appointmentsController = new AppointmentsController();

appointmentsRouter.use(ensureAuthenticated);

appointmentsRouter.post('/', appointmentsController.create);

// appointmentsRouter.get('/', async (request, response) => {
//  const appointmentsRepository = new AppointmentsRepository();
//   const appointmentsRepository = getCustomRepository(AppointmentsRepository);
//   const appointments = await appointmentsRepository.find();
//   return response.json(appointments);
// });

export default appointmentsRouter;
