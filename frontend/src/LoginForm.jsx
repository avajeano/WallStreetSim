import React, { useState, useContext } from "react";
import UserContext from "./UserContext";
import { useNavigate } from "react-router-dom";
import API from "./api";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function LoginForm() {
    const initialState = {
        username: "",
        password: ""
    }
    const [formData, setFormData] = useState(initialState);
    const { setToken } = useContext(UserContext);
    const navigate = useNavigate();

    const handleChange = e => {
        const {name, value} = e.target;
        setFormData(data => ({
            ...data,
            [name] : value
        }))
    }
    const handleSubmit = async e => {
        e.preventDefault();
        try {
            // authenticate the user and get the token
            const token = await API.loginUser(formData);
            // stores token in the app state
            setToken(token);
            alert(`logged in as ${formData.username}`);
            navigate('/');
        }   catch (error) {
            console.log('login failed', error);
            alert('invalid username/password');
        }
    };

    return (
        <>
            <Card bg="dark" text="light" style={{ width: '50rem' }}>
                <Card.Title>Login</Card.Title>
                <Form onSubmit={handleSubmit}>
                    <Row className="mb-3">
                        <Form.Group as={Col}>
                            <Form.Label>Username</Form.Label>
                            <Form.Control 
                                id="username"
                                type="text" 
                                name="username"
                                placeholder="username"
                                value={formData.username}
                                onChange={handleChange} />
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>Password</Form.Label>
                            <Form.Control 
                                id="password"
                                type="password" 
                                name="password"
                                placeholder="password"
                                value={formData.password}
                                onChange={handleChange} />
                        </Form.Group>
                    </Row>
                    <Button variant="success" type="submit">Login</Button>
                </Form>
            </Card>
        </>
    );
}

    

export default LoginForm;