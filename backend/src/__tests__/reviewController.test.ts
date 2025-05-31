// src/__tests__/reviewController.test.ts
import request from 'supertest';
import app from '../server';
import { ClientSingleton } from '../lib/prisma';

describe('Review Controller', () => {
  let userId: string;
  let postId: string;
  let reviewId: string;
  let token: string;

  beforeAll(async () => {
    // Crear usuario y token
    const user = await ClientSingleton.getInstance().user.create({
      data: {
        name: 'Review User',
        email: 'reviewuser@example.com',
        password: 'password',
        phone: '1234567890',
      }
    });
    userId = user.id;
    const authResponse = await request(app)
      .post('/login')
      .send({
        email: 'reviewuser@example.com',
        password: 'password',
      });
    token = authResponse.body.token;

    // Crear publicacion
    const post = await ClientSingleton.getInstance().post.create({
      data: {
        title: 'Review Post',
        description: 'Testing reviews',
        user_id: userId,
        location: {
          city: 'City',
          country: 'Country',
          location: 'Location'
        },
        type: 'Type',
        night_cost: 100,
      }
    });
    postId = post.id;

    // Crear una reseña
    const review = await ClientSingleton.getInstance().review.create({
      data: {
        comment: 'Nice place',
        qualification: 5,
        user_id: userId,
        post_id: postId,
        date_review: new Date(),
      }
    });
    reviewId = review.id;
  });

  afterAll(async () => {
    await ClientSingleton.getInstance().review.deleteMany({});
    await ClientSingleton.getInstance().booking.deleteMany({});
    await ClientSingleton.getInstance().post.deleteMany({});
    await ClientSingleton.getInstance().user.deleteMany({});
    await ClientSingleton.getInstance().$disconnect();
  });

  it('should create a review', async () => {
    const res = await request(app)
      .post('/reviews')
      .set('Authorization', `Bearer ${token}`)
      .send({
        comment: 'Great review',
        qualification: 5,
        user_id: userId,
        post_id: postId,
        date_review: new Date(),
      });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
  });

  it('should update review by id', async () => {
    const res = await request(app)
      .put(`/reviews/${reviewId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        comment: 'Updated review',
        qualification: 4,
        date_review: new Date(),
      });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', reviewId);
  });

  it('should delete review by id', async () => {
    const res = await request(app)
      .delete(`/reviews/${reviewId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', reviewId);
  });
});
