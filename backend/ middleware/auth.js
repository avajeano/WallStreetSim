"use strict";

/** Middleware to handle common auth cases in routes. */

require('dotenv').config();

const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;

/** Middleware: Authenticate user.
 * 
 * If a token was provided, verify it, and if valid, store the token payload.
 * 
 * If it's an error if no token was provided of if the token is not valed. 
 */

function authenticateJWT(req, res, next) {
    try {
        const authHeader = req.headers && req.headers.authorization;
        if (authHeader) {
            const token = authHeader.replace(/^[Bb]earer /, "").trim();
            res.locals.user = jwt.verify(token, SECRET_KEY);
        }
        return next();
    }   catch (err) {
        return next();
    }
}

function ensureLoggedIn(req, res, next) {
    try {
        if (!res.locals.user) throw error;
        return next();
    }   catch (err) {
        return next(err);
    }
}

module.exports = {
    authenticateJWT,
    ensureLoggedIn
}