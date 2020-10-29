import Book, { BookDocument } from '../models/Book'

function create(book: BookDocument): Promise<BookDocument> {
  
  return book.save()
}

function findById(bookId: string): Promise<BookDocument> {
  return Book.findById(bookId)
    .exec() // .exec() will return a true Promise
    .then((book) => {
      if (!book) {
        throw new Error(`Book ${bookId} not found`)
      }
      return book
    })
}

function findAll(): Promise<BookDocument[]> {
  return Book.find().sort({ title: 1, publishedDate: -1 }).exec() // Return a Promise
}

function update(
  bookId: string,
  update: Partial<BookDocument>
): Promise<BookDocument> {
  return Book.findById(bookId)
    .exec()
    .then((book) => {
      if (!book) {
        throw new Error(`Book ${bookId} not found`)
      }
      if (update.isbn) {
        book.isbn = update.isbn
      }
      if (update.title) {
        book.title = update.title
      }
      if (update.description) {
        book.description = update.description
      }
      if (update.publisher) {
        book.publisher = update.publisher
      }
      if (update.author) {
        book.author = update.author
      }
      if (update.isAvailable) {
        book.isAvailable = update.isAvailable
      }
      if (update.statusProperty) {
        book.statusProperty = update.statusProperty
      }
      if (update.publishedDate) {
        book.publishedDate = update.publishedDate
      }
      if (update.categories) {
        book.categories = update.categories
      }
      return book.save()
    })
}

function deleteBook(bookId: string): Promise<BookDocument | null> {
  return Book.findByIdAndDelete(bookId).exec()
}

type Params = {
  author?: unknown;
  title?: unknown;
  categories?: unknown;
  isAvailable?: string | boolean;
}

function findByQuery(params: Params): Promise<BookDocument[]> {
 // console.log('params from service', params)
  params.author
    ? (params.author = { $regex: params.author, $options: 'i' })
    : params.author
  params.title
    ? (params.title = { $regex: params.title, $options: 'i' })
    : params.title
  params.isAvailable === 'true' ? (params.isAvailable = true) : false
  params.categories
    ? (params.categories = { $regex: params.categories, $options: 'i' })
    : params.categories

  return Book.find(params)
    .exec()
    .then((book) => {
      if (!book) {
        throw new Error('Book not found')
      }
      return book
    })
}

export default {
  create,
  findById,
  findAll,
  update,
  deleteBook,
  findByQuery,
}
