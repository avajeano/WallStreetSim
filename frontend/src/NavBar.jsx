/** NavBar. */

import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "./UserContext";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { LinkContainer } from 'react-router-bootstrap';
import { Link } from 'react-router-dom';

function NavBar() {
    const { currentUser, logout } = useContext(UserContext);
    const [symbol, setSymbol] = useState("");
    const navigate = useNavigate();

    // handle the search input 
    const handleSearchChange = (e) => {
        setSymbol(e.target.value);
    }

    // handle the form submission
    const handleSearchSubmit = async (e) => {
        e.preventDefault();
        try {
            navigate(`/stocks/${symbol}`);
            setSymbol("");
        }   catch (err) {
            console.error('error fetching stock data', err);
        };
    }
    
    return (
        <Navbar bg="dark" data-bs-theme="dark" fixed="top">

            {currentUser ? (

                <Container>
                <img src="../icon.svg" width="42" height="42" className="d-inline-block align-top"/>
                <Navbar.Brand style={{ margin: '0px 5px 0px' }}>
                    <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>Wall Street Sim</Link>
                </Navbar.Brand>
                <Nav className="me-auto">
                    <LinkContainer to="/users/:username/portfolio">
                        <Nav.Link>Portfolio</Nav.Link>
                    </LinkContainer>
                    <LinkContainer to="/users/:username/watchlist">
                        <Nav.Link>Watchlist</Nav.Link>
                    </LinkContainer>
                </Nav>
                <Form className="d-flex" onSubmit={handleSearchSubmit}>
                    <Form.Control 
                        type="search"
                        placeholder="ticker symbol: AAPL"
                        className="me-2"
                        aria-label="Search"
                        value={symbol}
                        onChange={handleSearchChange}
                    />
                    <Button type="submit" variant="success"><img src="../search.svg" width="25" height="25" className="d-inline-block align-top"/></Button>
                </Form>
                <Button variant="secondary" onClick={logout} style={{ margin: '0px 8px 0px' }}>Logout</Button>
                </Container>
            ) : (
                <Container>
                <Nav>
                    <img src="../icon.svg" width="42" height="42" className="d-inline-block align-top"/>
                    <Navbar.Brand style={{ margin: '0px 5px 0px' }}>
                        <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>Wall Street Sim</Link>
                    </Navbar.Brand>
                </Nav>
                <Nav className="d-flex">
                    <Form className="d-flex" onSubmit={handleSearchSubmit}>
                        <Form.Control 
                            type="search"
                            placeholder="ticker symbol: AAPL"
                            className="me-2"
                            aria-label="Search"
                            value={symbol}
                            onChange={handleSearchChange}
                        />
                        <Button role="button" aria-label="searchButton" variant="success"><img src="../search.svg" width="25" height="25" className="d-inline-block align-top"/></Button>
                    </Form>
                    <Button variant="secondary" href="/users/login" style={{ margin: '0px 8px 0px' }}>Login</Button>
                    <Button variant="secondary" href="/users/register" style={{ margin: '0px 0px 0px' }}>Register</Button>
                    </Nav>
                </Container>
            )}
        </Navbar>
    );
}

export default NavBar;