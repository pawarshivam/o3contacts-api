const mongoose = require('mongoose');
const request = require('supertest');

const userBL = require('@bl/user');
const contactBL = require('@bl/contact');
const mongodb = require('@loaders/mongoose');
const app = require('@root/index');
const seeds = require('@tests/seeds');

let token = '';

beforeAll(async () => {
  await mongodb();

  await contactBL.deleteMany();
  await userBL.deleteMany();

  token = (await userBL.registerForTest({
    user: seeds.users.shivam,
  })).token;
});

afterAll(async () => {
  await contactBL.deleteMany();
  await userBL.deleteMany();

  await app.close(async () => {
    await mongoose.connection.close();
  });
});

test('contact', async () => {
  let response = {};

  // add
  response = await request(app)
    .put('/contact')
    .send({
      contact: seeds.contacts.margot,
    })
    .set({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    })
    .expect('Content-Type', /json/)
    .expect(200);

  expect(response.body.contact).toMatchObject(seeds.contacts.margot);

  // getAll
  response = await request(app)
    .get('/contact')
    .set({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    })
    .expect('Content-Type', /json/)
    .expect(200);

  expect(response.body.contacts).toEqual(
    expect.arrayContaining([
      expect.objectContaining(seeds.contacts.margot),
    ]),
  );

  // search
  response = await request(app)
    .post('/contact/search')
    .send({
      query: seeds.contacts.margot.firstName,
    })
    .set({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    })
    .expect('Content-Type', /json/)
    .expect(200);

  expect(response.body.contacts).toEqual(
    expect.arrayContaining([
      expect.objectContaining(seeds.contacts.margot),
    ]),
  );

  // delete
  response = await request(app)
    .delete(`/contact/${response.body.contacts[0]._id}`)
    .set({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    })
    .expect('Content-Type', /json/)
    .expect(200);

  expect(response.body.contact).toEqual(
    expect.arrayContaining([
    ]),
  );
});
