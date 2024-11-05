/** Routes for stocks. */

const express = require("express");
const Stock = require("../models/stock");
const router = express.Router();

// find stock data by symbol search query
router.get('/:symbol', async (req, res) => {
    const symbol = req.params.symbol.toUpperCase();
    try {
        const stock = await Stock.getStock(symbol);
        res.json(stock)
    }   catch (error) {
        res.status(404).json({ error: 'Invalid stock or API error', message: error.message });
    }
});

module.exports = router;