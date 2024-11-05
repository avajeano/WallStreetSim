"use strict";

const axios = require('axios');
const Stock = require("./stock.js");
const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
} = require("./_testCommon.js");

jest.mock('axios');

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/** API request tests */

describe("fetchFromAPI", function() {
    test("fetches data from external API", async function() {
        const mockApiResponse = {
            data: {
                "Time Series (Daily)": {
                    "2024-10-23": { "1. open": "150.00" },
                    "2024-10-22": { "1. open": "145.00" },
                    "2024-10-21": { "1. open": "140.00" },
                }
            }
        };

        axios.get.mockResolvedValueOnce(mockApiResponse);

        const result = await Stock.fetchFromAPI("TST1");

        const expectedData = [
            { date: "2024-10-23", price: 150.00 },
            { date: "2024-10-22", price: 145.00 },
            { date: "2024-10-21", price: 140.00 },
        ];

        expect(result).toEqual(expectedData);

        expect(axios.get).toHaveBeenCalledWith(
            `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=TST1&apikey=4ON4JY2HJ0LAQ66Z`
        );

    })
})