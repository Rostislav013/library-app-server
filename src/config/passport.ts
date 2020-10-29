/* eslint-disable @typescript-eslint/camelcase */
// import passport from 'passport'
// import passportLocal from 'passport-local'
// import passportFacebook from 'passport-facebook'

// import { Request, Response, NextFunction } from 'express'

// const LocalStrategy = passportLocal.Strategy
// const FacebookStrategy = passportFacebook.Strategy

import passportJWT from 'passport-jwt'
import passport from 'passport'

import User, { UserDocument } from '../models/User'
import { secretOrKey } from './keys'

const JwtStrategy = passportJWT.Strategy
const ExtractJwt = passportJWT.ExtractJwt
const key = secretOrKey

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: key,
    },
    (
      jwt_payload: { id: string },
      done: (arg0: null, arg1: boolean | UserDocument) => void // void?
    ) => {
      User.findById(jwt_payload.id)
        .then((user) => {
          if (user) {
            return done(null, user)
          }
          return done(null, false)
        })
        .catch((err) => console.log(err))
    }
  )
)
