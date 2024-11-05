const bcrypt = require("bcrypt");

const db = require("../db.js");
const { BCRYPT_WORK_FACTOR } = require('../config.js');

const testStockIds = [];

async function commonBeforeAll() {
    await db.query("DELETE FROM stocks");
    await db.query("DELETE FROM watchlist");
    await db.query("DELETE FROM stock_history");
    await db.query("DELETE FROM portfolio");
    await db.query("DELETE FROM users");

    const resultsStocks = await db.query(`
        INSERT INTO stocks(symbol)
        VALUES('TST1'),('TST2'),('TST3')
        RETURNING id`);
    testStockIds.splice(0, 0, ...resultsStocks.rows.map(r => r.id));
    
    await db.query(`
    INSERT INTO users(username, password, first_name, last_name, email)
    VALUES('user1', $1, 'user1F', 'user1L', 'user1@mail.com'),('user2', $2, 'user2F', 'user2L', 'user2@mail.com')
    RETURNING username`,
    [
        await bcrypt.hash("password1", BCRYPT_WORK_FACTOR),
        await bcrypt.hash("password2", BCRYPT_WORK_FACTOR)
    ]);

    await db.query(`
        INSERT INTO watchlist(user_username, stock_symbol)
        VALUES('user1', 'TST1')`);

    await db.query(`
        INSERT INTO stock_history(date, price)
        VALUES('2024-10-22', 105), ('2024-10-21', 100)`);

    await db.query(`
        INSERT INTO portfolio(user_username, stock_symbol, quantity, purchase_price, purchase_date)
        VALUES('user1', 'TST1', 5, 100, '2024-10-21')`);

    
}

async function commonBeforeEach() {
    await db.query("BEGIN");
  }
  
  async function commonAfterEach() {
    await db.query("ROLLBACK");
  }
  
  async function commonAfterAll() {
    await db.end();
  }
  
  
  module.exports = {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
    testStockIds,
  };