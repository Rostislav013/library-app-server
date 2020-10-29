"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findByFilter = exports.findAll = exports.findById = exports.deleteBook = exports.updateBook = exports.createBook = void 0;
const Book_1 = __importDefault(require("../models/Book"));
const book_1 = __importDefault(require("../services/book"));
const apiError_1 = require("../helpers/apiError");
// POST /books
exports.createBook = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { isbn, title, description, publisher, author, isAvailable, statusProperty, publishedDate, categories, } = req.body;
        const book = new Book_1.default({
            isbn,
            title,
            description,
            publisher,
            author,
            isAvailable,
            statusProperty,
            publishedDate,
            categories,
        });
        yield book_1.default.create(book);
        res.json(book);
    }
    catch (error) {
        if (error.name === 'ValidationError') {
            next(new apiError_1.BadRequestError('Invalid Request', error));
        }
        else {
            next(new apiError_1.InternalServerError('Internal Server Error', error));
        }
    }
});
// PUT /books/:bookId
exports.updateBook = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const update = req.body;
        const bookId = req.params.bookId;
        const updatedBook = yield book_1.default.update(bookId, update);
        res.json(updatedBook);
    }
    catch (error) {
        next(new apiError_1.NotFoundError('Book not found', error));
    }
});
// DELETE /books/:bookId
exports.deleteBook = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield book_1.default.deleteBook(req.params.bookId);
        res.status(204).end();
    }
    catch (error) {
        next(new apiError_1.NotFoundError('Book not found', error));
    }
});
// GET /books/:bookId
exports.findById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.json(yield book_1.default.findById(req.params.bookId));
    }
    catch (error) {
        next(new apiError_1.NotFoundError('Book not found', error));
    }
});
// GET /books
exports.findAll = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.json(yield book_1.default.findAll());
    }
    catch (error) {
        next(new apiError_1.NotFoundError('Books not found', error));
    }
});
exports.findByFilter = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const params = req.query;
        res.json(yield book_1.default.findByQuery(params));
    }
    catch (error) {
        next(new apiError_1.NotFoundError('Books not found', error));
    }
});
//# sourceMappingURL=book.js.map