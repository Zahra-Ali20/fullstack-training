
process.env.JWT_SECRET = 'test-only-secret-for-jwt';

const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../app');

describe('Products API', () => {
  describe('GET /api/products', () => {
    test('should return products for an authenticated user', async () => {
      const token = jwt.sign(
        { id: 1, role: 'user' },
        process.env.JWT_SECRET
      );

      const response = await request(app)
        .get('/api/products')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /api/products/:id', () => {
    test('should return a product when it exists', async () => {
      const token = jwt.sign(
        { id: 1, role: 'user' },
        process.env.JWT_SECRET
      );

      const response = await request(app)
        .get('/api/products/1')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        id: 1,
      });

      expect(response.body.name).toEqual(expect.any(String));
    });

    test('should return the expected error contract when the product does not exist', async () => {
      const token = jwt.sign(
        { id: 1, role: 'user' },
        process.env.JWT_SECRET
      );

      const response = await request(app)
        .get('/api/products/999999')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body).toMatchObject({
        message: 'Product not found',
      });
    });
  });

  describe('POST /api/products', () => {
    test('should return 401 when authentication is missing', async () => {
      const response = await request(app)
        .post('/api/products')
        .send({
          name: 'Test Product',
          description: 'A product for testing',
          price: 100,
          category: 'Electronics',
          stock: 10,
        });

      expect(response.status).toBe(401);
    });

    test('should return 401 when authentication is missing and product data is invalid', async () => {
      const response = await request(app)
        .post('/api/products')
        .send({
          description: 'A product for testing',
          price: -100,
          category: '',
          stock: -5,
        });

      expect(response.status).toBe(401);
    });

    test('should return 403 when a normal user tries to create a product', async () => {
      const token = jwt.sign(
        { id: 1, role: 'user' },
        process.env.JWT_SECRET
      );

      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Test Product',
          description: 'A product for testing',
          price: 100,
          category: 'Electronics',
          stock: 10,
        });

      expect(response.status).toBe(403);
      expect(response.body).toMatchObject({
        message: 'Forbidden: insufficient permissions',
      });
    });

    test('should return the expected error contract when manager omits product name', async () => {
      const token = jwt.sign(
        { id: 1, role: 'manager' },
        process.env.JWT_SECRET
      );

      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${token}`)
        .send({
          description: 'A product for testing',
          price: 100,
          category: 'Electronics',
          stock: 10,
        });

      expect(response.status).toBe(422);
      expect(Array.isArray(response.body.errors)).toBe(true);

      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: 'name',
            message: expect.any(String),
          }),
        ])
      );
    });


  });


  });
