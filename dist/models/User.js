"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// change schema for user
const userSchema = new mongoose_1.default.Schema({
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
});
exports.default = mongoose_1.default.model('User', userSchema);
//# sourceMappingURL=User.js.map