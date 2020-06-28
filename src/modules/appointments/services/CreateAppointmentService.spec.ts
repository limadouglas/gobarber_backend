import AppError from '@shared/error/AppError';
import FakeAppointmentRepository from '../repositories/FakeAppointmentsRepository';
import CreateAppointment from './CreateAppointmentService';

describe('CreateAppointment', () => {
  it('should be able to create a new appointment', async () => {
    const fakeAppointmentRepository = new FakeAppointmentRepository();
    const createAppointment = new CreateAppointment(fakeAppointmentRepository);

    const appointment = await createAppointment.execute({
      provider_id: '123123',
      date: new Date(),
    });

    expect(appointment.provider_id).toBe('123123');
    expect(appointment).toHaveProperty('id');
  });

  it('should not be able to create two appointments on the same time', async () => {
    const fakeAppointmentRepository = new FakeAppointmentRepository();
    const createAppointment = new CreateAppointment(fakeAppointmentRepository);

    const date = new Date(2020, 4, 10, 11);

    await createAppointment.execute({
      provider_id: '123123',
      date,
    });

    expect(
      createAppointment.execute({
        provider_id: '123123',
        date,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
