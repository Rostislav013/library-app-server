import mongoose, { Document } from 'mongoose'

type booksProperties = {
  bookId: string;
  borrowDate: Date;
  returnDate: Date;
}

export type UserDocument = Document & {
  admin: boolean;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  booksProperties: booksProperties[];
  creationDate: Date;
}

// change schema for user
const userSchema = new mongoose.Schema({
  admin: {
    type: Boolean,
    default: false,
  },
  password: {
    type: String,
    required: true,
  },

  firstName: {
    type: String,
    required: true,
  },

  lastName: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },

  booksProperties: {
    type: Array,
    bookId: {
      type: String,
    },
    borrowDate: {
      type: Date,
    },
    returnDate: {
      type: Date,
    },
  },
  creationDate: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.model<UserDocument>('User', userSchema)
