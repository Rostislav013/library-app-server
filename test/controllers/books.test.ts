import request from 'supertest'

import Book, { BookDocument } from '../../src/models/Book'
import app from '../../src/app'
import * as dbHelper from '../db-helper'

const nonExistingBookId = '5e57b77b5744fa0b461c7906'

async function createBook(override?: Partial<BookDocument>) {
  let book: Partial<BookDocument> = {
    isbn: 9781593279509,
    title: 'Eloquent JavaScript',
    description:
      'This is a book about JavaScript, programming, and the wonders of the digital.',
    publisher: 'Some company or ?',
    author: 'Marijn Haverbeke',
    isAvailable: true,
    statusProperty: [
      {
        borrowerId: 'userId',
        borrowDate: new Date(),
        returnDate: new Date(),
      },
    ],
    publishedDate: 2018,
    categories: ['JavaScript', 'programming'],
  }

  if (override) {
    book = { ...book, ...override }
    console.log('book after ovverride', book)
  }

  return await request(app).post('/api/v1/books').send(book)
}

describe('book controller', () => {
  beforeEach(async () => {
    await dbHelper.connect()
  })

  afterEach(async () => {
    await dbHelper.clearDatabase()
  })

  afterAll(async () => {
    await dbHelper.closeDatabase()
  })

  it('should create a book', async () => {
    const res = await createBook()
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('_id')
    expect(res.body.title).toBe('Eloquent JavaScript')
  })

  it('should not create a book with wrong data', async () => {
    const res = await request(app)
      .post('/api/v1/books')
      .send({
        isbn: 9781593279509,
        title: 'Eloquent JavaScript',
        // description:
        //   'This is a book about JavaScript, programming, and the wonders of the digital.',
        // publisher: 'Some company or ?',
        // author: ['Marijn Haverbeke'],
        // isAvailable: true,
        // statusProperty: {
        //   borrowerId: 'userId',
        //   borrowDate: '',
        //   returnDate: '',
        // },
        //publishedDate: 2018,
        categories: ['JavaScript', 'programming'],
      })
    expect(res.status).toBe(400)
  })

  it('should get back an existing book', async () => {
    let res = await createBook()
    expect(res.status).toBe(200)

    const bookId = res.body._id
    res = await request(app).get(`/api/v1/books/${bookId}`)

    expect(res.body._id).toEqual(bookId)
  })

  it('should not get back a non-existing book', async () => {
    const res = await request(app).get(`/api/v1/books/${nonExistingBookId}`)
    expect(res.status).toBe(404)
  })

  it('should get back all books', async () => {
    const res1 = await createBook({
      title: 'JavaScript for kids',
      publishedDate: 2016,
    })
    const res2 = await createBook({
      title: 'Eloquent JavaScript',
      publishedDate: 2018,
    })

    const res3 = await request(app).get('/api/v1/books')

    expect(res3.body.length).toEqual(2)
    // Pay attention to sort()
    expect(res3.body[0]._id).toEqual(res2.body._id)
    expect(res3.body[1]._id).toEqual(res1.body._id)
  })

  it('should get books by author', async () => {
    const res1 = await createBook({
      author: 'Kesha Big, Stepasha Lil',
      title: 'JavaScript for kids',
      publishedDate: 2016,
    })

    const res2 = await createBook()
    const res = await createBook({
      author: 'Stepasha Lil, Hrusha',
      title: 'JavaScript for kids',
      publishedDate: 2016,
    })

    const res3 = await request(app).get('/api/v1/books/search?author=Kesha')
    const res4 = await request(app).get('/api/v1/books/search?author=BIG')
    const res5 = await request(app).get('/api/v1/books/search?author=hrusha')

    expect(res3.body.length).toEqual(1)
    expect(res4.body.length).toEqual(1)
    expect(res5.body.length).toEqual(1)
  })

  it('should get books by title', async () => {
    const res1 = await createBook({
      author: 'Kesha Big, Stepasha Lil, Hrusha',
      title: 'JavaScript for kids',
      publishedDate: 2016,
    })

    const res2 = await createBook({
      author: 'Stepasha Lil, Hrusha',
      title: 'OOP for everyone',
      publishedDate: 2016,
    })

    const res3 = await request(app).get('/api/v1/books/search?title=JavaScript')
    const res4 = await request(app).get(
      '/api/v1/books/search?author=Hrusha&title=OOP'
    )
    const res5 = await request(app).get(
      '/api/v1/books/search?author=Big&title=JavaScript'
    )

    expect(res3.body.length).toEqual(1)
    expect(res4.body.length).toEqual(1)
    expect(res5.body.length).toEqual(1)
  })

  it('should get books by availability and categories', async () => {
    const res = await createBook({
      author: 'Stepasha Lil, Hrusha',
      isAvailable: true,
      categories: ['fiction'],
    })

    const res1 = await createBook({
      author: 'Kesha Big, Stepasha Lil, Hrusha',
      title: 'JavaScript for kids',
      publishedDate: 2016,
      categories: ['JavaScript', 'programming'],
      isAvailable: true,
    })

    const res2 = await createBook({
      author: 'Stepasha Lil, Hrusha',
      title: 'OOP for everyone',
      publishedDate: 2016,
      categories: ['software developing', 'programming'],
      isAvailable: false,
    })

    const res3 = await request(app).get('/api/v1/books/search?isAvailable=true')
    const res4 = await request(app).get(
      '/api/v1/books/search?isAvailable=false'
    )
    const res5 = await request(app).get(
      '/api/v1/books/search?author=Big&title=JavaScript&isAvailable=true'
    )
    const res6 = await request(app).get(
      '/api/v1/books/search?author=Big&title=JavaScript&categories=programming&isAvailable=true'
    )
    const res7 = await request(app).get(
      '/api/v1/books/search?categories=programming'
    )

    expect(res3.body.length).toEqual(2)
    expect(res4.body.length).toEqual(1)
    expect(res5.body.length).toEqual(1)
    expect(res6.body.length).toEqual(1)
    expect(res7.body.length).toEqual(2)
  })

  it('should update an existing book', async () => {
    let res = await createBook()
    expect(res.status).toBe(200)

    const bookId = res.body._id
    const update = {
      title: 'super new title',
      publishedDate: 2020,
    }

    res = await request(app).put(`/api/v1/books/${bookId}`).send(update)

    expect(res.status).toEqual(200)
    expect(res.body.title).toEqual('super new title')
    expect(res.body.publishedDate).toEqual(2020)
  })

  it('should delete an existing book', async () => {
    let res = await createBook()
    expect(res.status).toBe(200)
    const bookId = res.body._id

    res = await request(app).delete(`/api/v1/books/${bookId}`)

    expect(res.status).toEqual(204)

    res = await request(app).get(`/api/v1/books/${bookId}`)
    expect(res.status).toBe(404)
  })
})
