const mongoose = require('mongoose');
const request = require('supertest');

const userBL = require('@bl/user');
const mongodb = require('@loaders/mongoose');
const app = require('@root/index');
const seeds = require('@tests/seeds');

beforeAll(async () => {
  await mongodb();

  await userBL.deleteMany();
});

afterAll(async () => {
  await userBL.deleteMany();

  await app.close(async () => {
    await mongoose.connection.close();
  });
});

test('user', async () => {
  let response = {};

  // register
  response = await request(app)
    .post('/user/register')
    .send({
      user: seeds.users.shivam,
    })
    .set('Content-Type', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200);

  response.body.user.password = seeds.users.shivam.password;

  expect(response.body).toHaveProperty('token');
  expect(response.body.user).toMatchObject(seeds.users.shivam);
  expect(response.body.user.verified).toBe(false);

  // verify
  response = await request(app)
    .get(`/user/verify/${response.body.token}`)
    .set('Content-Type', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200);

  response.body.user.password = seeds.users.shivam.password;

  expect(response.body.user).toMatchObject(seeds.users.shivam);
  expect(response.body.user.verified).toBe(true);

  // login
  response = await request(app)
    .post('/user/login')
    .send({
      user: seeds.users.shivam,
    })
    .set('Content-Type', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200);

  response.body.user.password = seeds.users.shivam.password;

  expect(response.body).toHaveProperty('token');
  expect(response.body.user).toMatchObject(seeds.users.shivam);
});
