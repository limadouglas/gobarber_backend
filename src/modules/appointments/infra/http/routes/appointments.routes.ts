import { Router } from 'express';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/EnsureAuthenticated';
import { celebrate, Joi, Segments } from 'celebrate';
import AppointmentsController from '../controllers/AppointmentsController';
import ProviderAppointmentsController from '../controllers/ProviderAppointmentsController';

const appointmentsRouter = Router();

const appointmentsController = new AppointmentsController();
const providerAppointmentsController = new ProviderAppointmentsController();

appointmentsRouter.use(ensureAuthenticated);

appointmentsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      provider_id: Joi.string().uuid().required(),
      date: Joi.date(),
    },
  }),
  appointmentsController.create,
);
appointmentsRouter.get('/me', providerAppointmentsController.index);

// appointmentsRouter.get('/', async (request, response) => {
//  const appointmentsRepository = new AppointmentsRepository();
//   const appointmentsRepository = getCustomRepository(AppointmentsRepository);
//   const appointments = await appointmentsRepository.find();
//   return response.json(appointments);
// });

export default appointmentsRouter;
