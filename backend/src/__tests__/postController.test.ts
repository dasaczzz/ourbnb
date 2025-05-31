// src/__tests__/postController.test.ts
import request from 'supertest';
import app from '../server'; // Asegúrate de que esta ruta sea correcta
import { ClientSingleton } from '../lib/prisma'; // Asegúrate de que esta ruta sea correcta

describe('Post Controller', () => {
  let userId: string;
  let postId: string;

  beforeAll(async () => {
    // Crear un usuario de prueba
    const user = await ClientSingleton.getInstance().user.create({
      data: {
        name: 'Test User',
        email: 'testuser@example.com',
        password: 'password',
        phone: '1234567890',
      },
    });
    userId = user.id; // userId ahora es de tipo string

    // Crear una publicación de prueba
    const post = await ClientSingleton.getInstance().post.create({
      data: {
        title: 'Test Post',
        description: 'Test Description',
        user_id: userId,
        location: {
          city: 'Test City',
          country: 'Test Country',
          location: 'Test Location',
        },
        type: 'Test Type',
        night_cost: 100,
      },
    });
    postId = post.id; // postId ahora es de tipo string
  });

  afterAll(async () => {
    // Limpiar la base de datos
    await ClientSingleton.getInstance().review.deleteMany({}); // Eliminar reseñas primero
    await ClientSingleton.getInstance().booking.deleteMany({});
    await ClientSingleton.getInstance().post.deleteMany({});
    await ClientSingleton.getInstance().user.deleteMany({});
    await ClientSingleton.getInstance().$disconnect(); // Cerrar la conexión de Prisma
  });

  it('should create a post', async () => {
    const response = await request(app)
      .post('/posts')
      .send({
        title: 'New Post',
        description: 'New Description',
        user_id: userId,
        location: {
          city: 'New City',
          country: 'New Country',
          location: 'New Location',
        },
        type: 'New Type',
        night_cost: 150,
      });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
  });

  it('should get post by id', async () => {
    const response = await request(app).get(`/posts/${postId}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', postId);
  });

  it('should delete post by id', async () => {
    const response = await request(app).delete(`/posts/${postId}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('deletedPost.id', postId);
  });
});
