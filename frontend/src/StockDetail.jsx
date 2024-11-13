/**
 * Individual stock.
 * /stocks/:symbol
 */

import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import API from "./api";
import UserContext from "./UserContext";
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import Table from 'react-bootstrap/Table';
import Button from "react-bootstrap/esm/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function StockDetail() {
    const { symbol } = useParams();
    const [stock, setStock] = useState(null);
    const [isInWatchlist, setIsInWatchlist] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [error, setError] = useState(null);
    const { currentUser } = useContext(UserContext);

    useEffect(() => {
        async function fetchStock() {
            try {
                const stockData = await API.getStock(symbol);
                setStock(stockData);

                // check if the stock is in the user's watchlist only if there is a loggedin user
                if (currentUser) {
                    const { watchlist } = await API.getWatchlistWithPrices(currentUser.username);
                    if (watchlist.includes(symbol)) {
                    setIsInWatchlist(true);
                    }
                }

            }   catch (err) {
                setError('failed to fetch stock data');
            }
        }
        fetchStock();
    }, [symbol, currentUser])

    if (error) return <Alert variant="danger">{error} </Alert>
    if (!stock) return <Spinner animation="border" />;

    const handleAddToWatchlist = async () => {
        try {
            await API.addToWatchlist(currentUser.username, symbol);
            // update state after adding
            setIsInWatchlist(true);
            alert(`${symbol} added to watchlist`)
        }   catch (err) {
            alert(`error adding ${symbol} to watchlist`)
        }
    };

    const handleRemoveFromWatchlist = async () => {
        try {
            await API.removeFromWatchlist(currentUser.username, symbol);
            // update state after removing
            setIsInWatchlist(false);
            alert(`${symbol} removed from watchlist`);
        }   catch (err) {
            alert(`error removing ${symbol} from watchlist`)
        }
    };

    const handleBuyStock = async (e) => {
        e.preventDefault();
        try {
            const latestPrice = stock.data[0].price;
            await API.addToPortfolio(currentUser.username, symbol, quantity, latestPrice);
            alert(`${quantity} shares of ${symbol} bought at ${latestPrice}`);
            setShowForm(false);
        }   catch (err) {
            alert(`error buying ${symbol}`)
        }
    };

    // prepare data for the chart, reversed to show latest date on the right
    const reversedStockData = [...stock.data].reverse();

    // data for the chart
    const chartData = {
        labels: reversedStockData.map(({ date }, index) => index % 7 == 0 ? new Date(date).toISOString().split('T')[0] : ''), 
        datasets: [
            {
                label: 'Stock Price',
                data: reversedStockData.map(({ price }) => price),
                borderColor: 'rgba(14,75,239,1)',
                backgroundColor: 'rgba(14,75,239,0.2)',
                fill: true,
            }
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: `${symbol} Stock Price Over Time`,
            },
        },
    };

    return (
        <div style={{ margin: '20% 0%', width: '100%' }}>
            <h2>{symbol} details</h2>

            {/* if user is logged in 'buy' button is rendered */}
            {currentUser && (
                <>
                    <Button onClick={() => setShowForm(true)} variant="success" style={{ margin: '0px 5px 15px' }}>'Buy' Stock</Button>
                    {showForm && (
                    <Card bg="dark" text="light" style={{ margin: '0px 0px 15px', padding: '5px 50px 5px'}}>
                    <Form onSubmit={handleBuyStock}>
                        <Form.Group controlId="formQuantity">
                            <Form.Label>Quantity</Form.Label>
                            <Form.Control 
                                type="number"
                                min="1"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                            />
                        </Form.Group>
                        <Button type="submit" variant="success" style={{ margin: '15px 0px 15px' }}>Submit</Button>
                    </Form>
                    </Card>
                    )}
                </>
            )}
            
            {/* conditionally render add or remove button if user is logged in */}
            {currentUser && (
                isInWatchlist ? (
                    <Button onClick={handleRemoveFromWatchlist} style={{ margin: '0px 5px 15px' }} variant="warning">Remove from Watchlist</Button>
                ) : (
                    <Button onClick={handleAddToWatchlist} style={{ margin: '0px 5px 15px' }} variant="success">Add to Watchlist</Button>
                )
            )}
        
        {/* Line Chart for Stock Prices */}
        <div style={{ marginBottom: '20px', width: '800px'}}>
                <Line data={chartData} options={chartOptions} />
        </div>

        <p>note: opening price</p>
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Price</th>
                </tr>
            </thead>
            <tbody>
                {stock.data.map(({ date, price}) => (
                    <tr key={date}>
                        <td>{new Date(date).toISOString().split('T')[0]}</td>
                        <td>{price}</td>
                    </tr>
                ))}
                <tr>

                </tr>
            </tbody>
        </Table>
        </div>
    )
}

export default StockDetail;