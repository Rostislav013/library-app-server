import request from 'supertest'

import User, { UserDocument } from '../../src/models/User'
import app from '../../src/app'
import * as dbHelper from '../db-helper'

const nonExistingUserId = '5e57b77b5744fa0b461c7906'

async function createUser(override?: Partial<UserDocument>) {
  let user: Partial<UserDocument> = {
    admin: false,
    password: '5566778888Kz',
    firstName: 'Stepashka',
    lastName: 'Sobakov',
    email: 'stepshka1996@gmail.com',
    booksProperties: [
      {
        bookId: 'bookID',
        borrowDate: new Date(),
        returnDate: new Date(),
      },
    ],
    creationDate: new Date(),
  }

  if (override) {
    user = { ...user, ...override }
  }

  return await request(app).post('/api/v1/users/register').send(user)
}

describe('user controller', () => {
  beforeEach(async () => {
    await dbHelper.connect()
  })

  afterEach(async () => {
    await dbHelper.clearDatabase()
  })

  afterAll(async () => {
    await dbHelper.closeDatabase()
  })

  it('should create a user', async () => {
    const res = await createUser()
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('_id')
    expect(res.body.firstName).toBe('Stepashka')
  })

  it('should not create a user with wrong data', async () => {
    const res = await request(app).post('/api/v1/users/register').send({
      // admin: false,
      password: '5566778888Kz',
      //firstName: 'Stepashka',
      //lastName: 'Sobakov',
      email: 'stepshka1996@gmail.com',
      // booksProperties: [
      //   {
      //     bookId: 'bookID',
      //     borrowDate: new Date(),
      //     returnDate: new Date(),
      //   },
      // ],
      creationDate: new Date(),
    })
    expect(res.status).toBe(400)
  })

  it('should get back an existing user', async () => {
    let res = await createUser({
      email: 'stepshka91@gmail.com',
    })
    expect(res.status).toBe(200)

    const userId = res.body._id
    res = await request(app).get(`/api/v1/users/${userId}`)

    expect(res.body._id).toEqual(userId)
  })

  it('should not get back a non-existing user', async () => {
    const res = await request(app).get(`/api/v1/users/${nonExistingUserId}`)
    expect(res.status).toBe(404)
  })

  it('should get back all users', async () => {
    const res1 = await createUser({
      email: 'q1stepshka1996@gmail.com',
      password: 'erdgd4545tf',
    })
    console.log(res1.body)
    const res2 = await createUser({
      email: 'qstepshka1996@gmail.com',
      password: 'erdgd4545tf',
    })

    const res3 = await request(app).get('/api/v1/users')
    console.log('res3', res3.body)
    expect(res3.body.length).toEqual(2)
    expect(res3.body[0]._id).toEqual(res1.body._id)
    expect(res3.body[1]._id).toEqual(res2.body._id)
  })

  it('should update an existing user', async () => {
    let res = await createUser()
    expect(res.status).toBe(200)

    const userId = res.body._id
    const update = {
      firstName: 'Karkusha',
      lastName: 'Voronova',
    }

    res = await request(app).put(`/api/v1/users/${userId}`).send(update)

    expect(res.status).toEqual(200)
    expect(res.body.firstName).toEqual('Karkusha')
    expect(res.body.lastName).toEqual('Voronova')
  })

  it('should delete an existing user', async () => {
    let res = await createUser()
    expect(res.status).toBe(200)
    const userId = res.body._id

    res = await request(app).delete(`/api/v1/users/${userId}`)
    expect(res.status).toEqual(204)

    res = await request(app).get(`/api/v1/users/${userId}`)
    expect(res.status).toBe(404)
  })

  it('should login an existing user', async () => {
    const res2 = await createUser({
      email: 'qstepshka1996@gmail.com',
      password: 'erdgd4545tf',
    })
    const loginData = {
      email: 'qstepshka1996@gmail.com',
      password: 'erdgd4545tf',
    }
    const res = await request(app).post('/api/v1/users/login').send(loginData)

    expect(res.status).toBe(200)
  })

  it('should login an unexisting user', async () => {
    const loginData = {
      email: 'noname@gmail.com',
      password: 'ercdgd4545tf',
    }
    const res = await request(app).post('/api/v1/users/login').send(loginData)

    expect(res.status).toBe(404)
  })

  it('should login with incorrect password', async () => {
    const res2 = await createUser({
      email: 'qstepshka1996@gmail.com',
      password: 'erdgd4545tf',
    })
    const loginData = {
      email: 'qstepshka1996@gmail.com',
      password: 'wrongPassword5575',
    }
    const res = await request(app).post('/api/v1/users/login').send(loginData)

    expect(res.status).toBe(400)
  })
})
