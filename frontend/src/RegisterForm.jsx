import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "./UserContext";
import API from './api';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function RegisterForm() {
    const initialState = {
        username: "",
        password: "", 
        firstName: "",
        lastName: "",
        email: ""
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // register user and gets the token
            const token = await API.registerUser(formData);
            // stores token in the app state
            setToken(token);
            alert(`created user ${formData.username}`);
            navigate('/');
            // reset form data
            setFormData(initialState);
        }   catch (error) {
            console.log('signup failed', error);
        }
    }
       
    return (
        <>
            <Card bg="dark" text="light" style={{ width: '50rem' }}>
                <Card.Title>Register New User</Card.Title>
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
                    </Row>
                    <Row className="mb-3">
                        <Form.Group as={Col}>
                            <Form.Label>Email</Form.Label>
                            <Form.Control 
                                id="email"
                                type="email"
                                name="email"
                                placeholder="email"
                                value={formData.email}
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
                    <Row className="mb-3">
                        <Form.Group as={Col}>
                            <Form.Label>First Name</Form.Label>
                            <Form.Control 
                                id="firstName"
                                type="text" 
                                name="firstName"
                                placeholder="first name"
                                value={formData.firstName}
                                onChange={handleChange} />
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control 
                                id="lastName"
                                type="text"
                                name="lastName"
                                placeholder="last name"
                                value={formData.lastName}
                                onChange={handleChange} />
                        </Form.Group>
                    </Row>
                    <Button variant="success" type="submit">Register</Button>
                </Form>
            </Card>
        </>
    )
}

export default RegisterForm;