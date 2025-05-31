// src/__tests__/bookingController.test.ts
import request from 'supertest';
import app from '../server';
import { ClientSingleton } from '../lib/prisma';

describe('Booking Controller', () => {
  let userId: string;
  let postId: string;
  let bookingId: string;
  let token: string;

  beforeAll(async () => {
    // Crear usuario y token
    const user = await ClientSingleton.getInstance().user.create({
      data: {
        name: 'Booking User',
        email: 'bookinguser@example.com',
        password: 'password',
        phone: '1234567890',
      }
    });
    userId = user.id;

    const authResponse = await request(app)
      .post('/login')
      .send({
        email: 'bookinguser@example.com',
        password: 'password',
      });
    token = authResponse.body.token;

    // Crear publicacion
    const post = await ClientSingleton.getInstance().post.create({
      data: {
        title: 'Booking Post',
        description: 'Test description',
        user_id: userId,
        location: {
          city: 'Booking City',
          country: 'Booking Country',
          location: 'Booking Location',
        },
        type: 'Booking Type',
        night_cost: 100,
      }
    });
    postId = post.id;

    // Crear booking
    const booking = await ClientSingleton.getInstance().booking.create({
      data: {
        post_id: postId,
        end_date: new Date('2024-07-05T00:00:00.000Z'),
        init_date: new Date('2024-07-01T00:00:00.000Z'),
        service_cost: 50000,
        total_cost: 350000,
        users: [userId],
      }
    });
    bookingId = booking.id;
  });

  afterAll(async () => {
    // Limpieza en orden para evitar conflictos de restricción
    await ClientSingleton.getInstance().review.deleteMany({});
    await ClientSingleton.getInstance().booking.deleteMany({});
    await ClientSingleton.getInstance().post.deleteMany({});
    await ClientSingleton.getInstance().user.deleteMany({});
    await ClientSingleton.getInstance().$disconnect();
  });

  it('should create a booking', async () => {
    const res = await request(app)
      .post('/bookings')
      .set('Authorization', `Bearer ${token}`)
      .send({
        post_id: postId,
        end_date: new Date('2024-07-05T00:00:00.000Z'),
        init_date: new Date('2024-07-01T00:00:00.000Z'),
        service_cost: 50000,
        total_cost: 350000,
        users: [userId],
      });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
  });

  it('should delete booking by id', async () => {
    const res = await request(app)
      .delete(`/bookings/${bookingId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', bookingId);
  });
});
