import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import withRouter from '../utils/withRouter';
import { getUserData } from '../api';

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

function NavBar(props) {

    const [dropdownTitle, setDropdownTitle] = useState('');
    const [user, setUser] = useState({});
    const location = useLocation();

    const [openBasic, setOpenBasic] = useState(false);


    useEffect(() => {

        const fetchUserData = async () => {
            
            const token = localStorage.getItem('token');

            if (!token) {
                console.log("No token found, redirecting to login.");
                props.router.navigate("/login/");
                return;
            }
            
            try {
                const userData = await getUserData(token); 
                setUser(userData);
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
            setDropdownTitle('Books');
        }
    }, [location.pathname, props.router, user]);

    const handleLogout = () => {
        props.router.navigate("/login/");
        localStorage.removeItem('token');
        setUser(null);
        
        console.log("USER LOGGED OUT");
    }

    return (
        <div>
            <MDBNavbar expand='lg' className='bg-secondary top'>
            <MDBContainer fluid>
                <MDBNavbarBrand href='/'>Hello {user ? user.username : ''}</MDBNavbarBrand>

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
    </div>
  );
}

export default withRouter(NavBar);