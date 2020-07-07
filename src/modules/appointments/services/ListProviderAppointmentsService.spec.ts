import FakeAppointmentsRepository from '../repositories/FakeAppointmentsRepository';
import ListProviderAppointmentsService from './ListProviderAppointmentsService';

describe('ListProvidersAppointments', () => {
  let listProvidersAppointments: ListProviderAppointmentsService;
  let fakeAppointmentsRepository: FakeAppointmentsRepository;
  beforeAll(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProvidersAppointments = new ListProviderAppointmentsService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to list appointments on a specific day', async () => {
    const appointment1 = await fakeAppointmentsRepository.create({
      provider_id: 'provider',
      user_id: 'user',
      date: new Date(2020, 4, 20, 14, 0, 0),
    });
    const appointment2 = await fakeAppointmentsRepository.create({
      provider_id: 'provider',
      user_id: 'user',
      date: new Date(2020, 4, 20, 15, 0, 0),
    });

    const appointments = await listProvidersAppointments.execute({
      provider_id: 'provider',
      day: 20,
      month: 5,
      year: 2020,
    });

    expect(appointments).toEqual([appointment1, appointment2]);
  });
});
