/** Express app for WallStreetSim. */

const express = require('express');
const cors = require("cors");

const stocksRoutes = require('./routes/stocks'); 
const usersRoutes = require('./routes/users');
const { authenticateJWT } = require('./ middleware/auth');

const app = express();

// frontend
app.use(cors({origin: "http://localhost:3001"}));
app.use(express.json());
app.use(authenticateJWT);

app.use('/stocks', stocksRoutes);
app.use('/users', usersRoutes);

app.use((req, res, next) => {
    res.status(404).json({ error: "Not Found" });
});

// error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: err.message });
});

app.listen(3000, () => { 
    console.log('server running on port 3000')
});

module.exports = app;