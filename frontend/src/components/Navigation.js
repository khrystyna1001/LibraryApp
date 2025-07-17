import React from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';

import '../styles/navbar.css'

function NavBar() {
    return (
        <Navbar bg="dark" data-bs-theme="dark">
        <Container>
            <Navbar.Brand href="#home" className='m-3 me-4'>Hello user</Navbar.Brand>
            <Nav defaultActiveKey="/" className="justify-content-center me-auto d-flex gap-2" variant="pills">
                <Nav.Item>
                    <Nav.Link href='/'>Home</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link href='/'>Books</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link href='/'>Authors</Nav.Link>
                </Nav.Item>
            </Nav>
        </Container>
        </Navbar>
    );
}

export default NavBar;