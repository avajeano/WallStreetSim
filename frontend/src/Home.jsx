/** 
 * Home component.
 */

import React, { useContext } from "react";
import UserContext from "./UserContext";
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import investing from '../investing.svg';

function Home () {
    const { currentUser } = useContext(UserContext);
    return (
        <>
            {currentUser ? (
                <h2 style={{ fontWeight: 'bold', margin: '40px 0px 20px'}}>Welcome back {currentUser.username}!</h2>
            ) : (
                <h2 style={{ fontWeight: 'bold', margin: '40px 0px 20px'}}>Welcome, please login or register.</h2>
            )}
            <Card className="bg-dark text-white">
            <Card.Title style={{ fontWeight: 'bold'}}>NYSE Simulator</Card.Title>
            <span><img src={investing} width="250" height="250" className="d-inline-block align-top"/></span>
            <ol style={{ textAlign: 'left'}}>
                <li>Search for stocks.</li>
                <li>Add stocks to your watchlist.</li>
                <li>'Buy' stocks, you'll see them in your portfolio.</li>
                <li>Watch how your return on invenstment changes over time.</li>
            </ol>
            <div>
                <p style={{ fontWeight: 'bold'}}>Popular stocks include:</p>
                <Table striped border size="sm" variant="dark">
                    <thead>
                        <tr>
                            <th>Company</th>
                            <th>Symbol</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Apple</td>
                            <td>AAPL</td>
                        </tr>
                        <tr>
                            <td>Google</td>
                            <td>GOOG</td>
                        </tr>
                        <tr>
                            <td>Amazon</td>
                            <td>AMZN</td>
                        </tr>
                        <tr>
                            <td>Nike</td>
                            <td>NKE</td>
                        </tr>
                        <tr>
                            <td>Tesla</td>
                            <td>TSLA</td>
                        </tr>
                        <tr>
                            <td>Nvida</td>
                            <td>NVDA</td>
                        </tr>
                    </tbody>
                </Table>
            </div>
            </Card>
            
        </>
    )
}


export default Home;