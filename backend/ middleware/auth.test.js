"use strict";

/** Tests for user authorization. */

const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const { authenticateJWT, ensureLoggedIn } = require("./auth");

const testJwt = jwt.sign({ username: "test"}, SECRET_KEY);
const badJwt = jwt.sign({ username: "test"}, "wrong");

describe("authenticateJWT", function() {
    test("works: via header", function() {
        expect.assertions(2);
        const req = { headers: { authorization: `Bearer ${testJwt}` } };
        const res = { locals: {} };
        const next = function(err) {
            expect(err).toBeFalsy();
        };
        authenticateJWT(req, res, next); 
        expect(res.locals).toEqual({
            user: {
                iat: expect.any(Number),
                username: "test"
            },
        });
    });
    test("works: invalid token", function() {
        expect.assertions(2);
        const req = { headers: { authorrization: `Bearer ${badJwt}` } };
        const res = { locals: {} };
        const next = function(err) {
            expect(err).toBeFalsy()
        };
        authenticateJWT(req, res, next);
        expect(res.locals).toEqual({});
    });
});

describe("ensureLoggedIn", function() {
    test("works", function() {
        expect.assertions(1);
        const req = {};
        const res = { locals: { user: { username: "test" } } };
        const next = function(err) {
            expect(err).toBeFalsy();
        };
        ensureLoggedIn(req, res, next);
    });
    test("unauth if no login", function() {
        expect.assertions(1);
        const req = {};
        const res = { locals: {} };
        const next = function(err) {
            expect(err).toBeTruthy();
        };
        ensureLoggedIn(req, res, next);
    });
});