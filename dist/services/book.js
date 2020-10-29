"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Book_1 = __importDefault(require("../models/Book"));
function create(book) {
    return book.save();
}
function findById(bookId) {
    return Book_1.default.findById(bookId)
        .exec() // .exec() will return a true Promise
        .then((book) => {
        if (!book) {
            throw new Error(`Book ${bookId} not found`);
        }
        return book;
    });
}
function findAll() {
    return Book_1.default.find().sort({ title: 1, publishedDate: -1 }).exec(); // Return a Promise
}
function update(bookId, update) {
    return Book_1.default.findById(bookId)
        .exec()
        .then((book) => {
        if (!book) {
            throw new Error(`Book ${bookId} not found`);
        }
        if (update.isbn) {
            book.isbn = update.isbn;
        }
        if (update.title) {
            book.title = update.title;
        }
        if (update.description) {
            book.description = update.description;
        }
        if (update.publisher) {
            book.publisher = update.publisher;
        }
        if (update.author) {
            book.author = update.author;
        }
        if (update.isAvailable) {
            book.isAvailable = update.isAvailable;
        }
        if (update.statusProperty) {
            book.statusProperty = update.statusProperty;
        }
        if (update.publishedDate) {
            book.publishedDate = update.publishedDate;
        }
        if (update.categories) {
            book.categories = update.categories;
        }
        return book.save();
    });
}
function deleteBook(bookId) {
    return Book_1.default.findByIdAndDelete(bookId).exec();
}
function findByQuery(params) {
    // console.log('params from service', params)
    params.author
        ? (params.author = { $regex: params.author, $options: 'i' })
        : params.author;
    params.title
        ? (params.title = { $regex: params.title, $options: 'i' })
        : params.title;
    params.isAvailable === 'true' ? (params.isAvailable = true) : false;
    params.categories
        ? (params.categories = { $regex: params.categories, $options: 'i' })
        : params.categories;
    return Book_1.default.find(params)
        .exec()
        .then((book) => {
        if (!book) {
            throw new Error('Book not found');
        }
        return book;
    });
}
exports.default = {
    create,
    findById,
    findAll,
    update,
    deleteBook,
    findByQuery,
};
//# sourceMappingURL=book.js.map