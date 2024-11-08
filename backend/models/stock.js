"use strict";

/** Model for WallStreetSim stocks. */

const axios = require('axios');
const db = require('../db');

// generate today's date in YYYY-MM-DD format in local time
function getLocalTodayDate() {
    const today = new Date();
    // set to midnight in local time
    today.setHours(0, 0, 0, 0); 
    // get today's date in YYYY-MM-DD format
    return today.toISOString().split('T')[0];
}

class Stock {
    constructor(symbol, data) {
        this.symbol = symbol
        this.data = data 
    }

    // retrieve cached data from the database 
    static async getCachedData(stockId) {
        const today = getLocalTodayDate();
        console.log("today's date:", today);


        // check if the data for the latest date is alredy in the stock_history table
        const cachedDataCheck = await db.query(
            `SELECT date, price
            FROM stock_history 
            WHERE stock_id = $1 
            ORDER BY date DESC 
            LIMIT 30`,
            [stockId]
        );

        console.log('Most recent cached date:', cachedDataCheck.rows[0]?.date.toISOString().split('T')[0]);
        console.log('Date comparison result:', cachedDataCheck.rows[0]?.date.toISOString().split('T')[0] === today);

        // if today's data is found in the cache, return it
        if (cachedDataCheck.rows.length > 0 && cachedDataCheck.rows[0].date.toISOString().split('T')[0] === today) {
            console.log('returning cached data for today')
            return cachedDataCheck.rows;
        }

        // otherwise, return null to indicate missing or stale data
        return null;
    }

    // function to fetch stock from the the external API
    static async fetchFromAPI(symbol) {
        console.log('fetching from API');
        const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=4ON4JY2HJ0LAQ66Z`; 
        const response = await axios.get(url);

        // handle API errors 
        if(response.data['Error Message']) {
            throw new Error(response.data['Error Message']);
        }

        const timeSeriesData = response.data['Time Series (Daily)'];
        console.log(timeSeriesData);
        const processedData = Object.entries(timeSeriesData).map(([date, value]) => ({
            date,
            price: parseFloat(value['1. open'])
        }));

        return processedData;
    }

    // insert new stock data into the stock_history table
    static async insertStockData(stockId, stockData) {
        for (let data of stockData) {
            await db.query(
                `INSERT INTO stock_history (stock_id, date, price)
                VALUES ($1, $2, $3)
                ON CONFLICT (stock_id, date) DO NOTHING`,
                [stockId, data.date, data.price]
            );
        }
    }

    // main function to get stock data, from cache or API
    static async getStock(symbol) {
        try {
            // check if the stock is already in the database
            let stockId;
            const stockCheck = await db.query(
                `SELECT id FROM stocks WHERE symbol = $1`,
                [symbol]
            );

            if(stockCheck.rows.length === 0 ) {
                // if stock doesn't exist insert it 
                const insertResult = await db.query(
                    `INSERT INTO stocks (symbol) 
                    VALUES ($1) 
                    ON CONFLICT (symbol) DO NOTHING
                    RETURNING id`,
                    [symbol]
                );
                
                if (insertResult.rows.length > 0) {
                    stockId = insertResult.rows[0].id;
                }   else {
                    const existingStock = await db.query(`SELECT id FROM stocks WHERE symbol = $1`, [symbol]);
                    stockId = existingStock.rows[0].id
                }
            }   else {
                stockId = stockCheck.rows[0].id;
            }

            // attempt to retrieve cached data
            console.log('attempting to retrieve cached data');
            const cachedData = await Stock.getCachedData(stockId);

            // if we have valid cached data return it
            if (cachedData) {
                return new Stock(symbol, cachedData);
            }

            // otherwise fetch new data from the API
            const newStockData = await Stock.fetchFromAPI(symbol);

            // insert new data into the database
            await Stock.insertStockData(stockId, newStockData);

            // return the last 30 data points from the new data
            return new Stock(symbol, newStockData.slice(0, 30));
        }   catch (error) {
            console.error(`error fetching stock ${symbol}:`, error.message);

            // if an error occurs fallback to cached data
            const fallbackCachedData = await db.query(
                `SELECT date, price
                FROM stock_history
                WHERE stock_id = (SELECT id FROM stocks WHERE symbol = $1)
                ORDER BY date DESC
                LIMIT 30`,
                [symbol]
            );

            if (fallbackCachedData.rows.length > 0) {
                console.log('returning cached data due to API error');
                return new Stock(symbol, fallbackCachedData.rows);
            }

            // if no cached data is available, throw an error
            throw new Error('reached API limit for today and no cached data available');
        }
    }

    // get the two latest prices from the stock history table
    static async getAllStocksWithLatestPrices(username) {
        const stockPricesQuery = await db.query(
            `SELECT s.symbol,
                sh.price AS latest_price,
                sh_prev.price AS previous_price
            FROM watchlist w
            JOIN stocks s ON w.stock_symbol = s.symbol
            JOIN stock_history sh ON s.id = sh.stock_id
            LEFT JOIN stock_history sh_prev ON s.id = sh_prev.stock_id
            AND sh_prev.date = (
                SELECT MAX(sh2.date)
                FROM stock_history sh2
                WHERE sh2.stock_id = s.id
                AND sh2.date < sh.date
            )
            WHERE w.user_username = $1
            AND sh.date = (
            SELECT MAX(sh2.date)
            FROM stock_history sh2
            WHERE sh2.stock_id = s.id
        )
        ORDER BY s.symbol;`,
        [username]
        );
        return stockPricesQuery.rows; 
    }
}

module.exports = Stock;