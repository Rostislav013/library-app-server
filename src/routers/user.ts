import express from 'express'
import auth from '../middlewares/auth'
import isAdmin from '../middlewares/isAdmin'

import {
  findById,
  deleteUser,
  findAll,
  updateUser,
  createUser,
  loginUser,
} from '../controllers/user'

const router = express.Router()

// Every path we define here will get /api/v1/users prefix
router.get('/', isAdmin, findAll)
router.get('/:userId', findById)
router.put('/:userId', auth, updateUser)
router.delete('/:userId', deleteUser)
router.post('/register', createUser)
router.post('/login', loginUser)

export default router
