import express from 'express'

import {
  createBook,
  findById,
  deleteBook,
  findAll,
  findByFilter,
  updateBook,
} from '../controllers/book'

const router = express.Router()

// Every path we define here will get /api/v1/books prefix
router.get('/', findAll)
router.get('/search', findByFilter)
router.get('/:bookId', findById)
router.put('/:bookId', updateBook)
router.delete('/:bookId', deleteBook)
router.post('/', createBook)

export default router
