import { Request, Response, NextFunction } from 'express'

import { secretOrKey } from '../config/keys'
import jwt from 'jsonwebtoken'


function isAdmin(req: Request, res: Response, next: NextFunction) {
  const token: string | undefined = req.header('auth-token')
  if (!token) {
    return res.status(401).json({
      msg: 'auth denied',
    })
  }
  try {
    const decoded= jwt.verify(token.slice(7), secretOrKey)
    req.user = decoded
    
    next()
  } catch (err) {
    console.log(err.message)
    res.status(400).json({ msg: 'token not valid' })
  }
}

export default isAdmin
