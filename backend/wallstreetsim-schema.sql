-- table for users 
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(25) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL
        CHECK (position ('@' IN email) > 1)
);

-- table for stocks
CREATE TABLE stocks (
    id SERIAL PRIMARY KEY,
    symbol VARCHAR(10) UNIQUE NOT NULL
);

-- table for watchlist
-- many-to-many relationship between users and stocks  
CREATE TABLE watchlist (
    id SERIAL PRIMARY KEY,
    user_username VARCHAR(25) REFERENCES users(username) ON DELETE CASCADE,
    stock_symbol VARCHAR(10),
    -- prevents duplicates 
    UNIQUE (user_username, stock_symbol)
);

-- cache data 
CREATE TABLE stock_history (
    stock_id INT REFERENCES stocks(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    UNIQUE (stock_id, date)
);

-- user portfolio data
CREATE TABLE portfolio (
    purchase_id SERIAL PRIMARY KEY,
    user_username VARCHAR(25) REFERENCES users(username) ON DELETE CASCADE,
    stock_symbol VARCHAR(10),
    quantity INT NOT NULL,
    purchase_price DECIMAL(10, 2),
    purchase_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);