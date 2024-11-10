/**
 * Users stock portfolio.
 */

import React, { useContext, useState, useEffect } from "react";
import UserContext from "./UserContext";
import API from "./api";
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import Table from 'react-bootstrap/Table';

function Portfolio () {
    const { currentUser } = useContext(UserContext);
    const [portfolio, setPortfolio] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchPortfolio() {
            try {
                const data = await API.getPortfolio(currentUser.username);
                setPortfolio(data);
                setIsLoading(false);
            }   catch (err) {
                console.error('error fetching portfolio', err);
                setError('failed to load portfolio');
                setIsLoading(false);
            }
        }
        if (currentUser) {
            fetchPortfolio();
        }
    }, [currentUser]);

    if (isLoading) return <Spinner animation="border" />;
    if (error) return <Alert variant="danger">{error}</Alert>

    // calculate the total ROI of the portfolio
    const totalROI = portfolio.reduce((total, stock) => {
        const ROI = (stock.quantity * stock.latest_price)-(stock.quantity * stock.purchase_price)
        return total + ROI
    }, 0).toFixed(2);

    return (
        <>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Stock</th>
                        <th>Quantity</th>
                        <th>Average Purchase Price</th>
                        <th>Total 'Investment'</th>
                        <th>Latest Price</th>
                        <th>ROI</th>
                    </tr>
                </thead>
                <tbody>
                    {portfolio.map((stock) => {
                        const totalInvestment = (stock.quantity * stock.purchase_price).toFixed(2);
                        const ROI = ((stock.quantity * stock.latest_price)-(stock.quantity * stock.purchase_price)).toFixed(2);
                        const averagePurchasePrice = Number(stock.purchase_price).toFixed(2);

                        const negativeROI = ROI < 0;

                        return (
                        <tr key={stock.stock_symbol}>
                            <td>{stock.stock_symbol}</td>
                            <td>{stock.quantity}</td>
                            <td>${averagePurchasePrice}</td>
                            <td>${totalInvestment}</td>
                            <td>${stock.latest_price}</td>
                            <td className={negativeROI ? 'text-danger' : 'text-success'}>${ROI}</td>
                        </tr>
                        );
                    })}
                        <tr>
                            <td colSpan="5"><strong>Total ROI</strong></td>
                            <td style={{ fontWeight: 'bold'}} className={totalROI < 0 ? 'text-danger' : 'text-success'}>${totalROI}</td>
                        </tr>
                </tbody>
            </Table>
        </>
    )
}

export default Portfolio;