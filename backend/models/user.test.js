"use strict";

const db = require("../db.js");
const User = require("./user.js");
const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
} = require("./_testCommon.js");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/** authentication tests */

describe("authenticate", function() {
    test("works", async function() {
        const user = await User.authenticate("user1", "password1");
        expect(user).toEqual({
            username: "user1",
            first_name: "user1F",
            last_name: "user1L",
            email: "user1@mail.com", 
        });
    });
    
    test("unauth if no such user", async function() {
        try {
            await User.authenticate("nope", "password");
            fail();
        }   catch (err) {
            expect(err).toBeTruthy();
        }
    });

    test("unauth if wrong password", async function() {
        try {
            await User.authenticate("user1", "wrong");
            fail();
        }   catch (err) {
            expect(err).toBeTruthy();
        }
    });
})

/** register test */

describe("register", function() {
    const newUser = {
        username: "user3",
        first_name: "user3F",
        last_name: "user3L",
        email: "user3@mail.com"
    };

    test("works", async function() {
        let user = await User.register({
            ...newUser,
            password: "password3",
        });
        expect(user).toEqual(newUser);
        const found = await db.query(`SELECT * FROM users WHERE username = 'user3'`);
        expect(found.rows.length).toEqual(1);
        expect(found.rows[0].password.startsWith("$2b$")).toEqual(true);
    });
})

/** watchlist tests */

describe("addToWatchlist", function() {
    test("works", async function() {
        await User.addToWatchlist("user1", "TST1");

        const res = await db.query(
            "SELECT * FROM watchlist WHERE stock_symbol = 'TST1' AND user_username = 'user1'"
        );

        // get the stock_id of 'TST1'
        const stockRes = await db.query(
            "SELECT id FROM watchlist WHERE stock_symbol = 'TST1' AND user_username = 'user1'"
        );

        expect(res.rows).toEqual([{
            id: stockRes.rows[0].id,
            user_username: "user1",
            stock_symbol: "TST1",
        }]);
    });
})

describe("removeFromWatchlist", function() {
    test("works", async function() {
        await User.removeFromWatchlist("user1", "TST1");

        const res = await db.query(
            "SELECT * FROM watchlist WHERE stock_symbol = 'TST1' AND user_username = 'user1'"
        );

        expect(res.rows.length).toEqual(0);
    });
})

/** portfolio tests */

describe("addToPortfolio", function() {
    test("works", async function() {
    await User.addToPortfolio("user2", "TST2", 5, 100);

    const res = await db.query(
        "SELECT * FROM portfolio WHERE user_username = 'user2'"
    );

    // const currentTime = new Date();

    expect(res.rows).toEqual([{
        user_username: "user2",
        stock_symbol: "TST2",
        quantity: 5,
        purchase_date: expect.any(Date),
        purchase_price: "100.00"
    }]);
    })
})