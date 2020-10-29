import Book from '../../src/models/Book'
import BookService from '../../src/services/book'
import * as dbHelper from '../db-helper'

const nonExistingBookId = '5e57b77b5744fa0b461c7906'

async function createBook() {
  const book = new Book({
    isbn: 9781593279509,
    title: 'Eloquent JavaScript',
    description:
      'This is a book about JavaScript, programming, and the wonders of the digital.',
    publisher: 'Some company or ?',
    author: ['Marijn Haverbeke'],
    isAvailable: true,
    statusProperty: {
      borrowerId: 'userId',
      borrowDate: new Date(),
      returnDate: new Date(),
    },
    publishedDate: 2018,
    categories: ['JavaScript', 'programming'],
  })
  return await BookService.create(book)
}

describe('book service', () => {
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
    const book = await createBook()
    expect(book).toHaveProperty('_id')
    expect(book).toHaveProperty('title', 'Eloquent JavaScript')
    expect(book).toHaveProperty('publishedDate', 2018)
  })

  it('should get a book with id', async () => {
    const book = await createBook()
    const found = await BookService.findById(book._id)
    expect(found.title).toEqual(book.title)
    expect(found._id).toEqual(book._id)
  })

  // Check https://jestjs.io/docs/en/asynchronous for more info about
  // how to test async code, especially with error
  it('should not get a non-existing book', async () => {
    expect.assertions(1)
    return BookService.findById(nonExistingBookId).catch((e) => {
      expect(e.message).toMatch(`Book ${nonExistingBookId} not found`)
    })
  })

  it('should update an existing book', async () => {
    const book = await createBook()
    const update = {
      title: 'JS for Kids',
      publishedDate: 2020,
    }
    const updated = await BookService.update(book._id, update)
    expect(updated).toHaveProperty('_id', book._id)
    expect(updated).toHaveProperty('title', 'JS for Kids')
    expect(updated).toHaveProperty('publishedDate', 2020)
  })

  it('should not update a non-existing book', async () => {
    expect.assertions(1)
    const update = {
      title: 'JS for Kids',
      publishedDate: 2020,
    }
    return BookService.update(nonExistingBookId, update).catch((e) => {
      expect(e.message).toMatch(`Book ${nonExistingBookId} not found`)
    })
  })

  it('should delete an existing book', async () => {
    expect.assertions(1)
    const book = await createBook()
    await BookService.deleteBook(book._id)
    return BookService.findById(book._id).catch((e) => {
      expect(e.message).toBe(`Book ${book._id} not found`)
    })
  })
})
