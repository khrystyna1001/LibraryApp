import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import AccessControl from './AccessControl';
import withRouter from '../utils/withRouter';
import { useAuth } from '../utils/authContext';
import AdminNavbar from './Dashboard';
import { Menu, 
    Container, 
    Dropdown, 
    Button,
    MenuMenu,
    Input 
} from 'semantic-ui-react'

function NavBar(props) {

    const [dropdownTitle, setDropdownTitle] = useState('');
    const location = useLocation();
    const { user, logout } = useAuth();

    useEffect(() => {

        if (location.pathname === '/books') {
            setDropdownTitle('Books');
        } else if (location.pathname === '/authors') {
            setDropdownTitle('Authors');
        } else {
            setDropdownTitle('Books');
        }
    }, [location.pathname]);

    return (
        <div>
            <Menu>
                <Container>
                    <Menu.Item href='/my_profile/' as='a' header>
                        Hello {user ? user.username : ''}
                    </Menu.Item>
                    <Menu.Item as='a' href='/home/'>Home</Menu.Item>
                    <Menu.Item as='a' href='/about/'>About</Menu.Item>

                    <Dropdown item simple text='Dropdown' 
                    active={location.pathname === '/books' || location.pathname === '/authors'} >
                        <Dropdown.Menu>
                            <Dropdown.Item href='/books/'>Books</Dropdown.Item>
                            <Dropdown.Item href='/authors/'>Authors</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Container>

                <MenuMenu position='right'>
                    <Menu.Item>
                    <Input icon='search' placeholder='Search...' />
                    </Menu.Item>
                    <Menu.Item>
                        <Button
                            color='teal'
                            onClick={logout}
                            href='/login/'
                        >
                        Logout
                        </Button>
                    </Menu.Item>
                </MenuMenu>
            </Menu>
            

        <AccessControl allowedRoles={['admin']}>
            <AdminNavbar />
        </AccessControl>
    </div>
  );
}

export default withRouter(NavBar);