// src/__tests__/postController.test.ts
import request from 'supertest';
import app from '../server'; // Asegúrate de que esta ruta sea correcta
import { ClientSingleton } from '../lib/prisma'; // Asegúrate de que esta ruta sea correcta

describe('Post Controller', () => {
  let userId: string;
  let postId: string;
  let token: string;

  beforeAll(async () => {
    // Crear usuario para test
    const user = await ClientSingleton.getInstance().user.create({
      data: {
        name: 'Post User',
        email: 'postuser@example.com',
        password: 'password',
        phone: '1234567890',
      }
    });
    userId = user.id;

    // Obtener un token de autenticación
    const authResponse = await request(app)
      .post('/login') // Cambia esto a tu endpoint de autenticación
      .send({
        email: 'postuser@example.com',
        password: 'password',
      });
    token = authResponse.body.token;

    // Crear una publicación
    const post = await ClientSingleton.getInstance().post.create({
      data: {
        title: 'Test Post',
        description: 'Test description',
        user_id: userId,
        location: {
          city: 'Test city',
          country: 'Test country',
          location: 'Test location',
        },
        type: 'Test type',
        night_cost: 100,
      }
    });
    postId = post.id;
  });

  afterAll(async () => {
    // Limpiar la base de datos
    await ClientSingleton.getInstance().review.deleteMany({});
    await ClientSingleton.getInstance().booking.deleteMany({});
    await ClientSingleton.getInstance().post.deleteMany({});
    await ClientSingleton.getInstance().user.deleteMany({});
    await ClientSingleton.getInstance().$disconnect(); // Cerrar la conexión de Prisma
  });

  it('should create a post', async () => {
    const res = await request(app)
      .post('/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'New Post',
        description: 'New description',
        user_id: userId,
        location: {
          city: 'New city',
          country: 'New country',
          location: 'New location',
        },
        type: 'New type',
        night_cost: 150,
      });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
  });

  it('should delete post by id', async () => {
    const res = await request(app)
      .delete(`/posts/${postId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('deletedPost.id', postId);
  });
});
