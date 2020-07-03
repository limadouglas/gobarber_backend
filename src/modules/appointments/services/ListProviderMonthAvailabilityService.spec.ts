import ListProviderMonthAvailabilityService from './ListProviderMonthAvailabilityService';
import FakeAppointmentsRepository from '../repositories/FakeAppointmentsRepository';

describe('ListProviderMonthAvailability', () => {
  let listProviderMonthAvailabilityService: ListProviderMonthAvailabilityService;
  let fakeAppointmentsRepository: FakeAppointmentsRepository;

  beforeAll(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderMonthAvailabilityService = new ListProviderMonthAvailabilityService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to list the month availability from provider', async () => {
    [8, 9, 10, 11, 12, 13, 14, 15, 16, 17].forEach(async (appointment) => {
      await fakeAppointmentsRepository.create({
        provider_id: 'user',
        user_id: '123123',
        date: new Date(2020, 4, 20, appointment, 0, 0),
      });
    });

    await fakeAppointmentsRepository.create({
      provider_id: 'user',
      user_id: '123123',
      date: new Date(2020, 4, 21, 8, 0, 0),
    });

    const availability = await listProviderMonthAvailabilityService.execute({
      provider_id: 'user',
      month: 5,
      year: 2020,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { day: 19, available: true },
        { day: 20, available: false },
        { day: 21, available: true },
        { day: 22, available: true },
      ]),
    );
  });
});
