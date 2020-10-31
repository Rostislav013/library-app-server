import express from 'express'
import compression from 'compression'
import bodyParser from 'body-parser'
import lusca from 'lusca'
import mongoose from 'mongoose'
import passport from 'passport'
import bluebird from 'bluebird'

import { MONGODB_URI } from './util/secrets'
import cors from 'cors'


import bookRouter from './routers/book'
import userRouter from './routers/user'

import apiErrorHandler from './middlewares/apiErrorHandler'

const app = express()
const mongoUrl = MONGODB_URI

app.use(cors())

mongoose.Promise = bluebird
mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    /** ready to use. The `mongoose.connect()` promise resolves to undefined. */
  })
  .catch((err: Error) => {
    console.log(
      'MongoDB connection error. Please make sure MongoDB is running. ' + err
    )
    process.exit(1)
  })

// Express configuration
app.set('port', process.env.PORT || 3001)

//// Passport middleware
app.use(passport.initialize())

// I don't remember what this is about, but probable for smooth converstatoin between client n server
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  next()
})

// Use common 3rd-party middlewares
app.use(compression())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(lusca.xframe('SAMEORIGIN'))
app.use(lusca.xssProtection(true))


// Use book router
app.use('/api/v1/books', bookRouter)

// Use user router
app.use('/api/v1/users', userRouter)

// Custom API error handler
app.use(apiErrorHandler)

export default app
