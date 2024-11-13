"use strict;"

/** Model for WallStreetSim users. */

const bcrypt = require("bcrypt");
const db = require('../db');
const { BCRYPT_WORK_FACTOR } = require("../config");
const Stock = require('./stock');   

class User {
    /** Register new user. 
     * 
     * Returns { username, first_name, last_name, email }
     * 
    */
    static async register({username, password, first_name, last_name, email}) {
        const duplicateCheck = await db.query(
            `SELECT username 
            FROM users 
            WHERE username = $1`, 
            [username],
        );
        
        if (duplicateCheck.rows[0]) {
            throw new err('username not available');
        }

        const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

        const result = await db.query(
            `INSERT INTO users
            (username, password, first_name, last_name, email)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING username, first_name, last_name, email`,
            [
                username,
                hashedPassword,
                first_name,
                last_name,
                email
            ]
        );
        const user = result.rows[0];
        return user;
    }

    /** Authenticate user with username and password.
     * 
     * Returns { username, first_name, last_name, email }
     * 
     */
    static async authenticate(username, password) {
        console.log(username, password);
        // try to find the user first
        const result = await db.query(
            `SELECT username,
            password,
            first_name,
            last_name,
            email
            FROM users
            WHERE username = $1`,
            [username],
        );
        const user = result.rows[0];
        console.log(`user: ${user}`);

        if (user) {
            // compare hashed password to a new hash from password
            const isValid = await bcrypt.compare(password, user.password);
            console.log(`isvalid: ${isValid}`);
            if (isValid === true) {
                delete user.password;
                return user;
            }
        }
        throw new err('invalid username/password');
    }

    /** Given a username, return data about user. 
     * 
     * Returns { username, first_name, last_name, email }
     * 
     * */ 

    static async get(username) {
        const userRes = await db.query(
            `SELECT username,
            first_name,
            last_name,
            email
            FROM users
            WHERE username = $1`,
            [username],
        );
        const user = userRes.rows[0];
        
        if (!user) throw new Error(`${username} not found`);

        return user;
    }

    /** Add stock to watch list
     * 
     * - username 
     * - symbol
     */

    static async addToWatchlist(username, symbol) {
        try {
            await Stock.getStock(symbol);
            
            // add to watchlist 
            await db.query(
                `INSERT INTO watchlist (user_username, stock_symbol)
                VALUES ($1, $2) ON CONFLICT DO NOTHING`,
                [username, symbol]
            );
            
        }   catch (error) {
            console.log(`error adding ${symbol} to watchlist`, error);
        }
    }

    /** Remove stock from watchlist
     * 
     * - username
     * - symbol
     */
    static async removeFromWatchlist(username, symbol) {
        try {
            await db.query(
                `DELETE FROM watchlist
                WHERE user_username = $1 AND stock_symbol = $2`,
                [username, symbol]
            );
        }   catch (error) {
            console.log(`error removing $(symbol) from watchlist`, error);
            throw new Error(`error removing ${symbol} from watchlist`);
        }
    }

    /** Get user's watchlist
     * 
     * - username
     * 
     *  Returns an array of stock symbols in the user's watchlist
     */
    static async getWatchlist(username) {
        const result = await db.query(
            `SELECT stock_symbol
            FROM watchlist w
            JOIN users u ON w.user_username = u.username
            WHERE u.username = $1`,
            [username]
        );
        // return the stock symbols 
        return result.rows.map(r => r.stock_symbol);
    }

    /** Add user's stock to portfolio
     * 
     * - username
     * - symbol
     */
    static async addToPortfolio(username, symbol, quantity, latestPrice) {
        const result = await db.query(
            `INSERT INTO portfolio (user_username, stock_symbol, quantity, purchase_price)
            VALUES ($1, $2, $3, $4)
            RETURNING stock_symbol, quantity, purchase_price`,
            [username, symbol, quantity, latestPrice]
        );
        return result.rows[0];
    }

    /** Get user's portfolio
     * 
     * - username
     * 
     * Returns sum of 'investments' and average purchase price 
     */
    static async getPortfolio(username) {
        const result = await db.query(
            `SELECT 
            p.stock_symbol,
            SUM(p.quantity) as quantity,
            SUM(p.quantity * p.purchase_price) / SUM(p.quantity) as purchase_price,
            sh.price AS latest_price
        FROM portfolio p
        JOIN stocks s ON p.stock_symbol = s.symbol
        JOIN stock_history sh ON s.id = sh.stock_id
        WHERE p.user_username = $1
        AND sh.date = (SELECT MAX(date) FROM stock_history WHERE stock_id = s.id)
        GROUP BY p.stock_symbol, sh.price`,
        [username]
        );
        return result.rows;
    }

}

module.exports = User;