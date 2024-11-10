# Wall Street Sim
https://wallstreetsim-live.onrender.com/

## Overview
WallStreetSim is a web application that simulates investing in the New York Stock Exchange. Users can view stock details, "buy" stocks, and add stocks to their watchlist. Purchased stocks are added to a user’s portfolio, where they can track and analyze their return on investment over time. 

### Features
- Login/logout authentication
  - Bcrypt
- Home page
  - Displays username if logged in
  - ![Home Page](https://drive.google.com/uc?export=view&id=1v0OONuQmKbiYewiLYxvdSRM0tZggFV26)
- Search stocks
  - No user authentication
- Stock Details
  - User authentication
  - 'Buy' stocks
  - Add/remove from watchlist
  - Analyze rendered graph 
  - ![Stock Details](https://drive.google.com/uc?export=view&id=1Woia6TgnF8yb6TN7sus27WNA43GGJCYj)
- Watchlist
  - User authentication
  -  ![Stock Details](https://drive.google.com/uc?export=view&id=1_HlZb6-wLtAzaBC2woEafCFJgY-4o0wR)
- Portfolio
  - User authentication
  - ![Stock Details](https://drive.google.com/uc?export=view&id=1vIbksq6wRfgBRVvKB_twGEcYiYJUqITw)

## Database Schema
![Database Schema](https://drive.google.com/uc?export=view&id=1xLZGAEijBZGbzk3vi6tyy_I_57TYIlw6)

## API
[Alpha Vantage TIME_SERIES_DAILY](https://www.alphavantage.co/documentation/#daily)

## Tech Stack
- Javascript
  - Express.js
  - Node.js
  - React.js
  - Vite
- PostgreSQL
- Bootstrap
- CSS
- HTML

## Installation Instructions
1. Clone and download rep
2. Create virtual environment for backend
3. ```node app.js```
4. Create virtual environment for frontend
5. ```npm run dev```
