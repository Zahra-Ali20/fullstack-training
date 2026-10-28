process.env.JWT_SECRET = 'test-only-secret-for-jwt';

jest.mock('../models', () => ({
  Ticket: {
    create: jest.fn(),
    findByPk: jest.fn(),
    findAll: jest.fn(),
    destroy: jest.fn(),
  },
  User: {
    findByPk: jest.fn(),
  },
}));

const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../app');
const { Ticket } = require('../models');

const createToken = (user) =>
  jwt.sign(user, process.env.JWT_SECRET);

describe('Tickets API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test 1: Missing authentication
  test('GET /api/tickets returns 401 without a token', async () => {
    const response = await request(app).get('/api/tickets');

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Access token is required');
    expect(Ticket.findAll).not.toHaveBeenCalled();
  });

  // Test 2: Authenticated user creates a ticket
  test('POST /api/tickets sets created_by from the authenticated user', async () => {
    const token = createToken({ id: 7, role: 'user' });

    Ticket.create.mockImplementation(async (data) => ({
      id: 101,
      ...data,
    }));

    const response = await request(app)
      .post('/api/tickets')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test ticket',
        description: 'Created by an authenticated user',
        status: 'open',
        priority: 'medium',
      });

    expect(response.status).toBe(201);
    expect(Ticket.create).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Test ticket',
        created_by: 7,
      })
    );
    expect(response.body).toMatchObject({
      id: 101,
      title: 'Test ticket',
      created_by: 7,
    });
  });

  // Test 3: Unassigned user cannot update a ticket
  test('PUT /api/tickets/:id returns 403 for a user not assigned to the ticket', async () => {
    const token = createToken({ id: 9, role: 'user' });

    Ticket.findByPk.mockResolvedValue({
      id: 101,
      assigned_to: 7,
      status: 'open',
      update: jest.fn(),
    });

    const response = await request(app)
      .put('/api/tickets/101')
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'resolved' });

    expect(response.status).toBe(403);
    expect(response.body.message).toBe(
      'You are not allowed to update this ticket'
    );
  });

  // Test 4: Normal users cannot delete tickets
  test('DELETE /api/tickets/:id returns 403 for a normal user', async () => {
    const token = createToken({ id: 9, role: 'user' });

    const response = await request(app)
      .delete('/api/tickets/101')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(403);
    expect(Ticket.destroy).not.toHaveBeenCalled();
  });
});
