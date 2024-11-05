/** 
 * Home component.
 */

import React, { useContext } from "react";
import UserContext from "./UserContext";
import Card from 'react-bootstrap/Card';

function Home () {
    const { currentUser } = useContext(UserContext);
    return (
        <>
            {currentUser ? (
                <h2 style={{ fontWeight: 'bold'}}>Welcome back {currentUser.username}!</h2>
            ) : (
                <h2 style={{ fontWeight: 'bold'}}>Welcome, please login or register.</h2>
            )}
            <Card className="bg-dark text-white">
            <Card.Title>NYSE Simulator</Card.Title>
            <span><img src="../investing.svg" width="250" height="250" className="d-inline-block align-top"/></span>
            <ol style={{ textAlign: 'left'}}>
                <li>Search for stocks.</li>
                <li>Add stocks to your watchlist.</li>
                <li>'Buy' stocks, you'll see them in your portfolio.</li>
                <li>Watch how your return on invenstment changes over time.</li>
            </ol>
            </Card>
            
        </>
    )
}


export default Home;