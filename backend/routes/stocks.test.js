"use strict";

const request = require('supertest');
const app = require('../app');
const Stock = require("../models/stock");
const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
} = require("../models/_testCommon.js");

jest.mock("../models/stock");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/** fetching stock data tests */

describe("GET /stocks/:symbol", function() {
    test("works", async function() {
        // mock data that would be returned from Stock.getStock
        const mockStockData = {
            symbol: "TST1",
            data: [
                { date: "2024-10-23", price: 150.00 },
                { date: "2024-10-22", price: 145.00 },
                { date: "2024-10-21", price: 140.00 },
            ]
        };

        Stock.getStock.mockResolvedValueOnce(mockStockData);

        const resp = await request(app).get(`/stocks/TS1`);
        expect(resp.statusCode).toEqual(200);
        expect(resp.body).toEqual(mockStockData);
    });
})