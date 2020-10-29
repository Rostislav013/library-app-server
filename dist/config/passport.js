"use strict";
/* eslint-disable @typescript-eslint/camelcase */
// import passport from 'passport'
// import passportLocal from 'passport-local'
// import passportFacebook from 'passport-facebook'
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import { Request, Response, NextFunction } from 'express'
// const LocalStrategy = passportLocal.Strategy
// const FacebookStrategy = passportFacebook.Strategy
const passport_jwt_1 = __importDefault(require("passport-jwt"));
const passport_1 = __importDefault(require("passport"));
const User_1 = __importDefault(require("../models/User"));
const keys_1 = require("./keys");
const JwtStrategy = passport_jwt_1.default.Strategy;
const ExtractJwt = passport_jwt_1.default.ExtractJwt;
const key = keys_1.secretOrKey;
passport_1.default.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: key,
}, (jwt_payload, done // void?
) => {
    User_1.default.findById(jwt_payload.id)
        .then((user) => {
        if (user) {
            return done(null, user);
        }
        return done(null, false);
    })
        .catch((err) => console.log(err));
}));
//# sourceMappingURL=passport.js.map