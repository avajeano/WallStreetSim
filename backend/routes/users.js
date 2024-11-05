"use strict";

/** Route for users. */

const express = require("express");
const User = require("../models/user");
const Stock = require("../models/stock");
const { ensureLoggedIn } = require('../ middleware/auth'); 
const router = express.Router();
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");

// return signed JWT from user data
function createToken(user) {
    let payload = { username: user.username };
    return jwt.sign(payload, SECRET_KEY);
};

/** POST /register 
 * 
 * user must include { username, password, first_name, last_name, email }
 * 
*/

router.post("/register", async function (req, res, next) {
    try {
        const { username, password, firstName, lastName, email } = req.body;
        const user = await User.register({
            username,
            password,
            first_name: firstName,
            last_name: lastName,
            email
        });
        const token = createToken(user);
        console.log(`register token: ${token}`)
        return res.status(201).json({ token });
    }   catch (err) {
        console.log(err);
        return next(err);
    }
});

/** POST /login:  { username, password } => { token }
 *
 * Returns JWT token which can be used to authenticate further requests.
 *
 * Authorization required: none
 */

router.post("/login", async function (req, res, next) {
    try {
        const { username, password } = req.body;

        // authenticate the user using the user model's authentication method
        const user = await User.authenticate(username, password);

        // if the usre exists and is authenticated, create a JWT token
        const token = createToken(user);
        console.log(`login token: ${token}`);

        return res.json({ token });
    }   catch (err) {
        console.log(err);
        return next(err);
    }
});

/** GET /[username] => { user } 
 * 
 *  Returns { username, first_name, last_name }
 * 
 * Authorization required: user
*/

router.get('/:username', ensureLoggedIn, async function (req, res, next) {
    try {
        const user = await User.get(req.params.username);
        return res.json({ user });
    }   catch (err) {
        return next(err);
    }
});

/** POST /[username]/watchlist/[symbol] 
 * 
 * Authorization required: user
*/

router.post("/:username/watchlist/:symbol", ensureLoggedIn, async function (req, res, next) {
    try {
        const { username, symbol } = req.params;
        await User.addToWatchlist(username, symbol);
        return res.json({ message: `${symbol} added to watchlist` });
    }   catch (err) {
        return next(err);
    }
});

module.exports = router, { createToken };

/** DELETE /[username]/watchlist/[symbol] 
 * 
 * Remove stock from user's watchlist
 * 
 * Authorization required: user
*/

router.delete("/:username/watchlist/:symbol", ensureLoggedIn, async function (req, res, next) {
    try {
        const { username, symbol } = req.params;
        await User.removeFromWatchlist(username, symbol);
        return res.json({ message: `${symbol} removed from watchlist` });
    }   catch (err) {
        return next(err)
    }
});

/** GET /[username]/watchlist => { watchlist }
 * 
 *  Returns an array of stock symbols in the user's watchlist
 * 
 *  Returns watchlist stocks latest prices in ticker banner 
 * 
 *  Authorization required: user
 */

router.get("/:username/watchlist", ensureLoggedIn, async function (req, res, next) {
    try {
        const { username } = req.params;
        const watchlist = await User.getWatchlist(username);

        // fetch latest prices for all stocks in stock_history for stock ticker
        const latestPrices = await Stock.getAllStocksWithLatestPrices(username);
        return res.json({ watchlist, latestPrices });
    }   catch (err) {
        return next(err);
    }
});

/** POST /[username]/portfolio/[symbol] 
 * 
 * 'Buy' stock and add to user's portfolio
 * 
 * Authorization required: user
*/

router.post("/:username/portfolio/:symbol", ensureLoggedIn, async function (req, res, next) {
    try {
        const { username, symbol } = req.params;
        const { quantity, latestPrice } = req.body;

        await User.addToPortfolio(username, symbol, quantity, latestPrice);
        
        return res.json({ message: `${quantity} shares of ${symbol} added to portfolio at $${latestPrice}` });
    }   catch (err) {
        return next(err);
    }
});

/** GET /[username]/portfolio
 * 
 * Returns total 'investments'
 * 
 * Authorization required: user
 */

router.get("/:username/portfolio", ensureLoggedIn, async function (req, res, next) {
    try {
        const portfolio = await User.getPortfolio(req.params.username);
        return res.json({ portfolio });
    }   catch (err) {
        return next(err);
    }
});