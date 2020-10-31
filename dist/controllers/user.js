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
exports.findAll = exports.findById = exports.deleteUser = exports.loginUser = exports.updateUser = exports.createUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const user_1 = __importDefault(require("../services/user"));
const register_1 = __importDefault(require("../Validation/register"));
const keys_1 = require("../config/keys");
const login_1 = __importDefault(require("../Validation/login"));
const apiError_1 = require("../helpers/apiError");
// POST /users
exports.createUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { admin, password, firstName, lastName, email, booksProperties, } = req.body;
        const creationDate = new Date();
        const user = new User_1.default({
            admin,
            password,
            firstName,
            lastName,
            email,
            booksProperties,
            creationDate,
        });
        const { errors, isValid } = register_1.default(req.body); // ? check this
        //Check validation
        if (!isValid) {
            return res.status(400).json(errors);
        }
        yield User_1.default.findOne({ email: req.body.email }).then((userDB) => {
            //Check if user alr exists
            if (userDB) {
                return res.status(400).json({ email: 'Email already exists' });
            }
            else {
                // Hash password before saving in database
                bcryptjs_1.default.genSalt(10, (err, salt) => {
                    bcryptjs_1.default.hash(user.password, salt, (err, hash) => __awaiter(void 0, void 0, void 0, function* () {
                        if (err)
                            throw err;
                        user.password = hash;
                        yield user_1.default.create(user); //.then((user) => res.json(user))
                        res.json(user);
                    }));
                });
            }
        });
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
// PUT /users/:userId
exports.updateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const update = req.body;
        const userId = req.params.userId;
        const userAuth = req.user;
        // console.log('update', update)
        const updatedUser = yield user_1.default.update(userId, update, userAuth);
        res.json(updatedUser);
    }
    catch (error) {
        next(new apiError_1.NotFoundError('User not found', error));
    }
});
// Login user
exports.loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { errors, isValid } = login_1.default(req.body);
    // Check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }
    const email = req.body.email;
    const myPlaintextPassword = req.body.password;
    // Find user by email
    User_1.default.findOne({ email }).then((user) => {
        // Check if user exists
        if (!user) {
            return res.status(404).json({ emailnotfound: 'Email not found' });
        }
        // Check password
        bcryptjs_1.default.compare(myPlaintextPassword, user.password).then((result) => {
            if (result) {
                // Create JWT Payload
                const payload = {
                    id: user.id,
                    email: user.email,
                    admin: user.admin,
                    firstName: user.firstName,
                };
                // Sign token
                jsonwebtoken_1.default.sign(payload, keys_1.secretOrKey, {
                    expiresIn: 31556926,
                }, (err, token) => {
                    res.json({
                        success: true,
                        token: 'Bearer ' + token,
                    });
                });
            }
            else {
                return res.status(400).json({ passwordincorrect: 'Password incorrect' });
            }
        });
    });
});
// DELETE /users/:userId
exports.deleteUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield user_1.default.deleteUser(req.params.userId);
        res.status(204).end();
    }
    catch (error) {
        next(new apiError_1.NotFoundError('User not found', error));
    }
});
// GET /users/:userId
exports.findById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.json(yield user_1.default.findById(req.params.userId));
    }
    catch (error) {
        next(new apiError_1.NotFoundError('User not found', error));
    }
});
// GET /users
exports.findAll = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userAuth = req.user;
    if (userAuth) {
        // FIX
    }
    try {
        //res.json(await UserService.findAll())
        const updatedUser = yield user_1.default.findAll(userAuth);
        res.json(updatedUser);
    }
    catch (error) {
        next(new apiError_1.NotFoundError('Users not found', error));
    }
});
//# sourceMappingURL=user.js.map