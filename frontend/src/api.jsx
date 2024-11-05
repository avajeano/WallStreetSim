import axios from "axios";

const BASE_URL = import.meta.env.VITE_APP_BASE_URL || "http://localhost:3000";

/** API Class. */

class WallStreetSimApi {
    static token;

    static async request(endpoint, data = {}, method = "get") {
        const url = `${BASE_URL}/${endpoint}`;
        const headers = { Authorization: `Bearer ${WallStreetSimApi.token}`}
        const params = (method === "get")
            ? data
            : {};
        try {
            return (await axios({ url, method, data, params, headers })).data;
        }   catch (err) {
            console.error("API Error:", err.response);
            throw err;
        }
    }

    // return details on a stock
    static async getStock(symbol) {
        let res = await this.request(`stocks/${symbol}`);
        return res;
    }
    
    // register new user
    static async registerUser(data) {
        let res = await this.request('users/register', data, "POST");
        return res.token;
    }

    // send login details to the server and receive a token
    // credentails is an object containing username and password
    static async loginUser(credentails) {
        let res = await this.request('users/login', credentails, "POST");
        return res.token;
    }

    // get user details by username
    static async getUser(username) {
        let res = await this.request(`users/${username}`);
        return res.user;
    }

    // logged in user adds stock to their watchlist
    static async addToWatchlist(username, symbol) {
        let res = await this.request(`users/${username}/watchlist/${symbol}`, {}, "POST");
        return res;
    }

    // logged in user removes stock from their watchlist
    static async removeFromWatchlist(username, symbol) {
        let res = await this.request(`users/${username}/watchlist/${symbol}`, {}, "DELETE")
        return res;
    }

    // get user watchlists and stock ticker data
    static async getWatchlistWithPrices(username) {
        let res = await this.request(`users/${username}/watchlist`);
        console.log('Watchlist data with prices:', res);
        return res;
    }

    // add 'investment' to user's portfolio
    static async addToPortfolio(username, symbol, quantity, latestPrice) {
        let res = await this.request(`users/${username}/portfolio/${symbol}`,{ quantity, latestPrice }, "POST");
        return res;
    }

    // retrieve user's portfolio
    static async getPortfolio(username) {
        let res = await this.request(`users/${username}/portfolio`);
        return res.portfolio;
    }
}

export default WallStreetSimApi;