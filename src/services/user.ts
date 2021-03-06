import User, { UserDocument } from '../models/User'
import bcrypt from 'bcryptjs'

export type userAuth = {
  id: string;
  email: string;
  admin: boolean;
  firstName: string;
  iat: number;
  exp: number;
}

function create(user: UserDocument) {
  return user.save()
}

function findById(userId: string): Promise<UserDocument> {
  return User.findById(userId)
    .exec()
    .then((user) => {
      if (!user) {
        throw new Error(`User ${userId} not found`)
      }
      return user
    })
}

function findAll(userAuth?: Partial<userAuth>): Promise<UserDocument[]> {
  if (userAuth?.admin === false) {
    throw new Error('Denied')
  } else {
    return User.find().sort({ firstName: 1 }).exec() // Return a Promise
  }
}

interface Update extends Partial<UserDocument> {
  currentPassword?: string;
}

function update(
  userId: string,
  update: Update,
  userAuth?: Partial<userAuth>
): Promise<UserDocument> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let pass: any = update.password
  pass &&
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(pass, salt, async (err, hash) => {
        if (err) throw err
        pass = hash
      })
    })

  return User.findById(userId)
    .exec()
    .then(async (user) => {
      if (!user) {
        throw new Error(`User ${userId} not found`)
      }

      if (user._id != userAuth?.id && userAuth?.admin === false) {
        throw new Error('Denied')
      }
      if (user?._id == userAuth?.id || userAuth?.admin === true) {
        if (update.admin) {
          user.admin = update.admin
        }
        if (update.password && update.currentPassword) {
          await bcrypt
            .compare(update.currentPassword, user.password)
            .then((result) => {
              console.log(result)
              if (result) {
                console.log('gonna change pass')
                user.password = pass
                console.log(user.password)
                console.log(pass)
              } else {
                throw new Error('Password incorrect')
              }
            })
        }
        if (update.firstName) {
          user.firstName = update.firstName
        }
        if (update.lastName) {
          user.lastName = update.lastName
        }
        if (update.email) {
          user.email = update.email
        }
        if (update.booksProperties) {
          user.booksProperties = update.booksProperties
        }
      }
      return user.save()
    })
}

function deleteUser(userId: string): Promise<UserDocument | null> {
  return User.findByIdAndDelete(userId).exec()
}

export default {
  create,
  findById,
  findAll,
  update,
  deleteUser,
}
