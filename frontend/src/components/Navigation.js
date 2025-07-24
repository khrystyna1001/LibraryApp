import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import axios from 'axios';

import {
    MDBContainer,
    MDBNavbar,
    MDBNavbarBrand,
    MDBNavbarToggler,
    MDBIcon,
    MDBNavbarNav,
    MDBNavbarItem,
    MDBNavbarLink,
    MDBBtn,
    MDBDropdown,
    MDBDropdownToggle,
    MDBDropdownMenu,
    MDBDropdownItem,
    MDBCollapse,
  } from 'mdb-react-ui-kit';

function NavBar() {

    const [dropdownTitle, setDropdownTitle] = useState('');
    const [user, setUser] = useState({});
    const location = useLocation();

    const [openBasic, setOpenBasic] = useState(false);


    useEffect(() => {

        const fetchUserData = async () => {
            const token = '2bef80e4799cf2f8642055d43b0a02bfee5e9e29'
            const requestHeaders = {
                "Content-Type": "application/json",
                "Authorization": `Token ${token}`,
            }
            
            try {
                const response = await axios.get(`http://localhost:8000/user/me`, {
                    headers: requestHeaders
                });
                setUser(response.data)
            } catch (e) {
                console.error("Failed to fetch user data")
            } 
        }
        fetchUserData();

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
        <React.Fragment>
            <MDBNavbar expand='lg' dark bgColor='dark'>
            <MDBContainer fluid>
                <MDBNavbarBrand href='/'>Hello user</MDBNavbarBrand>

                <MDBNavbarToggler
                aria-controls='navbarSupportedContent'
                aria-expanded='false'
                aria-label='Toggle navigation'
                onClick={() => setOpenBasic(!openBasic)}
                >
                <MDBIcon icon='bars' fas />
                </MDBNavbarToggler>

                <MDBCollapse navbar open={openBasic}>
                <MDBNavbarNav className='my-2, my-lg-0, me-sm-0, my-sm-0 mx-2'>
                    <MDBNavbarItem>
                    <MDBNavbarLink active={location.pathname === '/'} aria-current='page' href='/'>
                        Home
                    </MDBNavbarLink>
                    </MDBNavbarItem>
                    <MDBNavbarItem>
                    <MDBNavbarLink active={location.pathname === '/about'} href='/about'>About</MDBNavbarLink>
                    </MDBNavbarItem>

                    <MDBNavbarItem>
                    <MDBDropdown>
                        <MDBDropdownToggle active={location.pathname === '/books' || location.pathname === '/authors'} tag='a' className='nav-link' role='button'>
                        {dropdownTitle}
                        </MDBDropdownToggle>
                        <MDBDropdownMenu>
                        <MDBDropdownItem href='/books/' link>Books</MDBDropdownItem>
                        <MDBDropdownItem href='/authors/' link>Authors</MDBDropdownItem>
                        </MDBDropdownMenu>
                    </MDBDropdown>
                    </MDBNavbarItem>
                </MDBNavbarNav>
                </MDBCollapse>

                <form className='d-flex input-group w-auto mx-3'>
                    <input type='search' className='form-control' placeholder='Search' aria-label='Search' />
                    <MDBBtn color='primary'>Search</MDBBtn>
                </form>
                
                <MDBBtn color='primary' onClick={handleLogout}>Log Out</MDBBtn>
            </MDBContainer>
        </MDBNavbar>
    </React.Fragment>
  );
}

export default NavBar;