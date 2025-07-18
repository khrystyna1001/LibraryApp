import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import '../styles/navbar.css'

function NavBar() {

    const [dropdownTitle, setDropdownTitle] = useState('');
    const location = useLocation();

    useEffect(() => {
        if (location.pathname === '/books') {
            setDropdownTitle('Books');
        } else if (location.pathname === '/authors') {
            setDropdownTitle('Authors');
        } else {
            setDropdownTitle('Books');;
        }
    }, [location.pathname]);

    const handleLogout = () => {
        console.log("USER LOGGED OUT");
    }

    return (
        <Navbar bg="dark" data-bs-theme="dark">
            <Container>
                <Navbar.Brand href="/" className='m-3 me-5'>Hello user</Navbar.Brand>
                <Nav className="justify-content-center me-auto d-flex gap-3">
                    <Nav.Item>
                        <Nav.Link href='/' active={location.pathname === '/'}>
                            Home
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link href='/about' active={location.pathname === '/about'}>
                            About
                        </Nav.Link>
                    </Nav.Item>
                    <NavDropdown
                        title={dropdownTitle}
                        id="nav-dropdown"
                        active={location.pathname === '/books' || location.pathname === '/authors'}
                    >
                        <NavDropdown.Item href="books">
                            Books
                        </NavDropdown.Item>
                        <NavDropdown.Item href="authors">
                            Authors
                        </NavDropdown.Item>
                    </NavDropdown>
                </Nav>
            </Container>
            <Form className='d-flex gap-2 me-5'>
                <Form.Control
                    type="text"
                    placeholder="Search"
                    className="search-input-width"
                    />
                <Button type="submit">Submit</Button>
            </Form>
            <Button variant="dark" className="ms-auto me-4 mx-2 text-nowrap" onClick={handleLogout}>
                Log out
            </Button>
        </Navbar>
    );
}

export default NavBar;