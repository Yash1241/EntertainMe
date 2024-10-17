const request = require('supertest');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('../index'); // Use relative path to index.js

dotenv.config();

beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('API Tests', () => {
    it('GET /api/items should return items', async () => {
        const response = await request(app).get('/api/items');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    it('POST /api/items should create an item', async () => {
        const response = await request(app)
            .post('/api/items')
            .send({ name: 'New Item', description: 'New Description' });
        expect(response.status).toBe(201);
        expect(response.body.name).toBe('New Item');
    });

    // Add more tests as needed...
});
