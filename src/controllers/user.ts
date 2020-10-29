import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import User from '../models/User'
import UserService from '../services/user'
import validateRegisterInput from '../Validation/register'
import { secretOrKey } from '../config/keys'
import validateLoginInput from '../Validation/login'
import {
  NotFoundError,
  BadRequestError,
  InternalServerError,
} from '../helpers/apiError'

// POST /users
export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      admin,
      password,
      firstName,
      lastName,
      email,
      booksProperties,
    } = req.body

    const creationDate = new Date()
    const user = new User({
      admin,
      password,
      firstName,
      lastName,
      email,
      booksProperties,
      creationDate,
    })
    const { errors, isValid } = validateRegisterInput(req.body) // ? check this
    //Check validation
    if (!isValid) {
      return res.status(400).json(errors)
    }
    await User.findOne({ email: req.body.email }).then((userDB) => {
      //Check if user alr exists
      if (userDB) {
        return res.status(400).json({ email: 'Email already exists' })
      } else {
        // Hash password before saving in database
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(user.password, salt, async (err, hash) => {
            if (err) throw err
            user.password = hash
            await UserService.create(user) //.then((user) => res.json(user))
            res.json(user)
          })
        })
      }
    })
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(new InternalServerError('Internal Server Error', error))
    }
  }
}

// PUT /users/:userId
export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const update = req.body
    const userId = req.params.userId
    const userAuth = req.user
    // console.log('update', update)
    const updatedUser = await UserService.update(userId, update, userAuth)
    res.json(updatedUser)
  } catch (error) {
    next(new NotFoundError('User not found', error))
  }
}

// Login user
export const loginUser = async (req: Request, res: Response) => {
  const { errors, isValid } = validateLoginInput(req.body)

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors)
  }
  const email = req.body.email
  const myPlaintextPassword: string = req.body.password
  // Find user by email
  User.findOne({ email }).then((user) => {
    // Check if user exists
    if (!user) {
      return res.status(404).json({ emailnotfound: 'Email not found' })
    }

    // Check password
    bcrypt.compare(myPlaintextPassword, user.password).then((result) => {
      if (result) {
        // Create JWT Payload
        const payload = {
          id: user.id,
          email: user.email,
          admin: user.admin,
          firstName: user.firstName,
        }
        // Sign token
        jwt.sign(
          payload,
          secretOrKey,
          {
            expiresIn: 31556926,
          },
          (err, token) => {
            res.json({
              success: true,
              token: 'Bearer ' + token,
            })
          }
        )
      } else {
        return res.status(400).json({ passwordincorrect: 'Password incorrect' })
      }
    })
  })
}

// DELETE /users/:userId
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await UserService.deleteUser(req.params.userId)
    res.status(204).end()
  } catch (error) {
    next(new NotFoundError('User not found', error))
  }
}

// GET /users/:userId
export const findById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.json(await UserService.findById(req.params.userId))
  } catch (error) {
    next(new NotFoundError('User not found', error))
  }
}

// GET /users
export const findAll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.json(await UserService.findAll())
  } catch (error) {
    next(new NotFoundError('Users not found', error))
  }
}
