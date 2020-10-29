import { Request, Response, NextFunction } from 'express'

import Book from '../models/Book'
import BookService from '../services/book'
import {
  NotFoundError,
  BadRequestError,
  InternalServerError,
} from '../helpers/apiError'

// POST /books
export const createBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      isbn,
      title,
      description,
      publisher,
      author,
      isAvailable,
      statusProperty,
      publishedDate,
      categories,
    } = req.body

    const book = new Book({
      isbn,
      title,
      description,
      publisher,
      author,
      isAvailable,
      statusProperty,
      publishedDate,
      categories,
    })

    await BookService.create(book)
    res.json(book)
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(new InternalServerError('Internal Server Error', error))
    }
  }
}

// PUT /books/:bookId
export const updateBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const update = req.body
    const bookId = req.params.bookId
    const updatedBook = await BookService.update(bookId, update)
    res.json(updatedBook)
  } catch (error) {
    next(new NotFoundError('Book not found', error))
  }
}

// DELETE /books/:bookId
export const deleteBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await BookService.deleteBook(req.params.bookId)
    res.status(204).end()
  } catch (error) {
    next(new NotFoundError('Book not found', error))
  }
}

// GET /books/:bookId
export const findById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.json(await BookService.findById(req.params.bookId))
  } catch (error) {
    next(new NotFoundError('Book not found', error))
  }
}

// GET /books
export const findAll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.json(await BookService.findAll())
  } catch (error) {
    next(new NotFoundError('Books not found', error))
  }
}

type Params = {
  author?: string;
  title?: string;
  category?: string | string[];
  available?: string;
}

export const findByFilter = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const params: Params = req.query
    res.json(await BookService.findByQuery(params))
  } catch (error) {
    next(new NotFoundError('Books not found', error))
  }
}
