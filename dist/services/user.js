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
const User_1 = __importDefault(require("../models/User"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
function create(user) {
    return user.save();
}
function findById(userId) {
    return User_1.default.findById(userId)
        .exec() // .exec() will return a true Promise
        .then((user) => {
        if (!user) {
            throw new Error(`User ${userId} not found`);
        }
        return user;
    });
}
function findAll() {
    return User_1.default.find().sort({ firstName: 1 }).exec(); // Return a Promise
}
function update(userId, update, userAuth) {
    console.log(userAuth);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let pass = update.password;
    pass && bcryptjs_1.default.genSalt(10, (err, salt) => {
        bcryptjs_1.default.hash(pass, salt, (err, hash) => __awaiter(this, void 0, void 0, function* () {
            if (err)
                throw err;
            pass = hash;
            console.log('hash', pass);
        }));
    });
    return User_1.default.findById(userId)
        .exec()
        .then((user) => __awaiter(this, void 0, void 0, function* () {
        console.log(userAuth === null || userAuth === void 0 ? void 0 : userAuth.id);
        console.log(user === null || user === void 0 ? void 0 : user._id);
        if (!user) {
            throw new Error(`User ${userId} not found`);
        }
        if (user._id != (userAuth === null || userAuth === void 0 ? void 0 : userAuth.id) && (userAuth === null || userAuth === void 0 ? void 0 : userAuth.admin) == false) {
            throw new Error('Denied');
        }
        if ((user === null || user === void 0 ? void 0 : user._id) == (userAuth === null || userAuth === void 0 ? void 0 : userAuth.id) || (userAuth === null || userAuth === void 0 ? void 0 : userAuth.admin) == true) {
            if (update.admin) {
                user.admin = update.admin;
            }
            if (update.password && update.currentPassword) {
                //user.password = pass
                yield bcryptjs_1.default.compare(update.currentPassword, user.password).then((result) => {
                    console.log(result);
                    if (result) {
                        console.log('gonna change pass');
                        user.password = pass;
                        console.log(user.password);
                        console.log(pass);
                    }
                    else {
                        throw new Error('Password incorrect');
                    }
                });
            }
            if (update.firstName) {
                user.firstName = update.firstName;
            }
            if (update.lastName) {
                user.lastName = update.lastName;
            }
            if (update.email) {
                user.email = update.email;
            }
            if (update.booksProperties) {
                user.booksProperties = update.booksProperties;
            }
            // Add more fields here if needed
        }
        console.log('return');
        return user.save();
    }));
}
function deleteUser(userId) {
    return User_1.default.findByIdAndDelete(userId).exec();
}
exports.default = {
    create,
    findById,
    findAll,
    update,
    deleteUser,
};
//# sourceMappingURL=user.js.map