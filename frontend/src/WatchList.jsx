/**
 * Users stock watch list. 
 */

import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "./UserContext";
import API from './api';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import ListGroup from 'react-bootstrap/ListGroup';
import { Link } from 'react-router-dom';
import StockTicker from "./StockTicker";
import './WatchList.css';

function WatchList () {
    const { currentUser } = useContext(UserContext);
    const [watchlist, setWatchlist] = useState([]);
    const [latestPrices, setLatestPrices] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!currentUser) {
            // if user is not logged in, redirect
            alert('login to access watchlist');
            setIsLoading(false);
            navigate('/');
            return;
        }

        async function fetchWatchlist() {
            try {
                const { watchlist, latestPrices } = await API.getWatchlistWithPrices(currentUser.username);
                setWatchlist(watchlist);
                setLatestPrices(latestPrices);
                setIsLoading(false);
            }   catch (err) {
                setError('failed to load watchlist');
                setIsLoading(false);
            }
        }
        fetchWatchlist();
    }, [currentUser, navigate]);

    if (isLoading) return <Spinner animation="border" />;
    if (error) return <Alert variant="danger">{error} </Alert>

    return (
        <div className="watchlist">
            {/* stock ticker banner */}
            <StockTicker tickerData={latestPrices} />
            <div style={{width: '100%' }}>
                {watchlist.length == 0 ? (
                    <Alert variant="secondary">no stocks here</Alert>
                ) : (
                    <ListGroup >
                        {watchlist.map((stockSymbol) => {
                            const stockData = latestPrices.find(stock => stock.symbol === stockSymbol);
                            const latestPrice = stockData ? stockData.latest_price : "n/a";
                            const previousPrice = stockData ? stockData.previous_price : null;

                            // determine if the price went up or down
                            const isPriceUp = previousPrice && latestPrice > previousPrice;
                            const isPriceDown = previousPrice && latestPrice < previousPrice;

                            return (
                                <Link to={`/stocks/${stockSymbol}`} key={stockSymbol} style={{ textDecoration: 'none' }}>
                                <ListGroup.Item variant="secondary" className="list-item" style={{ display: 'flex', alignItems: 'center', margin: '3px 0px 3px' }} action as="li">
                                    <span style={{ flex: '2', textAlign: 'center', fontWeight: 'bold' }}>{stockSymbol}</span>
                                    <span style={{ flex: '1', textAlign: 'left' }}>
                                        {isPriceUp && <span style={{ color: 'green', marginRight: '5px' }}>▲</span>}
                                        {isPriceDown && <span style={{ color: 'red', marginRight: '5px' }}>▼</span>}
                                        ${latestPrice}
                                    </span>
                                </ListGroup.Item>
                                </Link>
                            );
                        })}
                    </ListGroup>
                )}
            </div>
            <p>note: select stock to update data API limits apply</p>
        </div>
    );
}

export default WatchList;