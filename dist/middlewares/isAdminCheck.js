"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const keys_1 = require("../config/keys");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function isAdmin(req, res, next) {
    const token = req.header('auth-token');
    console.log(token);
    if (!token) {
        return res.status(401).json({
            msg: 'auth denied'
        });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token.slice(7), keys_1.secretOrKey);
        req.user = decoded;
        next();
    }
    catch (err) {
        console.log(err.message);
        res.status(400).json({ msg: 'token not valid' });
    }
}
exports.default = isAdmin;
//# sourceMappingURL=isAdminCheck.js.map