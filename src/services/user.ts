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
    .exec() // .exec() will return a true Promise
    .then((user) => {
      if (!user) {
        throw new Error(`User ${userId} not found`)
      }
      return user
    })
}

function findAll(): Promise<UserDocument[]> {
  return User.find().sort({ firstName: 1 }).exec() // Return a Promise
}

interface Update extends Partial < UserDocument > {
  currentPassword?: string;
}

function update(
  userId: string,
  update: Update,
  userAuth?: Partial<userAuth>,
): Promise<UserDocument> {
  console.log(userAuth)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let pass: any = update.password
  pass &&  bcrypt.genSalt(10, (err, salt) => {
  bcrypt.hash(pass, salt, async (err, hash) => {
    if (err) throw err
    pass = hash
    console.log('hash', pass)
    })
  })
  
 


  return User.findById(userId)
    .exec()
    .then(async (user) => {
      console.log(userAuth?.id)
      console.log(user?._id)
      if (!user) {
        throw new Error(`User ${userId} not found`)
      }
      
      if (user._id != userAuth?.id && userAuth?.admin == false) {
        throw new Error('Denied')
      }
      if (user?._id == userAuth?.id || userAuth?.admin == true) {
        if (update.admin) {
        user.admin = update.admin
      }
      if (update.password && update.currentPassword) {
        //user.password = pass
        await bcrypt.compare(update.currentPassword, user.password).then((result) => {
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
      // Add more fields here if needed
      
      }
      console.log('return')
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
