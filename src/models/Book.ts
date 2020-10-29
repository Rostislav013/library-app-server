import mongoose, { Document } from 'mongoose'

type StatProperties = {
  borrowerId: string;
  borrowDate: Date;
  returnDate: Date;
}

export type BookDocument = Document & {
  isbn: number;
  title: string;
  description: string;
  publisher: string;
  author: string;
  isAvailable: boolean;
  statusProperty: StatProperties[];
  publishedDate: number;
  categories: string[];
}

// change schema for book
const bookSchema = new mongoose.Schema({
  isbn: {
    type: Number,
    index: true,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  publisher: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  isAvailable: {
    type: Boolean,
    required: true,
  },
  statusProperty: {
    type: Array,
    borrowerId: {
      type: String,
    },
    borrowDate: {
      type: Date,
    },
    returnDate: {
      type: Date,
    },
  },
  publishedDate: {
    type: Number,
    required: true,
  },
  categories: [String],
})

export default mongoose.model<BookDocument>('Book', bookSchema)
