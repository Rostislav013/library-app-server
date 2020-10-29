"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// change schema for book
const bookSchema = new mongoose_1.default.Schema({
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
});
exports.default = mongoose_1.default.model('Book', bookSchema);
//# sourceMappingURL=Book.js.map