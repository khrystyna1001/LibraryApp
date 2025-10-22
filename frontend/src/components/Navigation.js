import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import AccessControl from './AccessControl';
import withRouter from '../utils/withRouter';
import { useAuth } from '../utils/authContext';
import { useSearch } from '../utils/searchContext';
import AdminNavbar from './Dashboard';
import { getItems, searchItems } from '../api';
import { Menu, 
    Container, 
    Dropdown, 
    Button,
    MenuMenu,
    Input 
} from 'semantic-ui-react'

function NavBar(props) {

    const [dropdownTitle, setDropdownTitle] = useState('');
    const [searchRequest, setSearchRequest] = useState('');
    const location = useLocation();
    const { user, logout } = useAuth();
    const { setSearchResponse } = useSearch();

    useEffect(() => {

        if (location.pathname === '/books') {
            setDropdownTitle('Books');
        } else if (location.pathname === '/authors') {
            setDropdownTitle('Authors');
        } else {
            setDropdownTitle('Books');
        }
    }, [location.pathname]);

    const handleInputValue = (e) => {
        setSearchRequest(e.target.value)
    }
    
    const handleInputSearch = async () => {
        if (searchRequest) {
            try {
                const token = localStorage.getItem('token');
                const [fetchedAuthors, fetchedBooks, fetchedUsers] = await Promise.all([
                    searchItems(searchRequest, 'authors', token),
                    searchItems(searchRequest, 'books', token),
                    searchItems(searchRequest, 'users')
                ]);

                console.log(fetchedAuthors, fetchedBooks, fetchedUsers)

                const responseData = {
                    authors: fetchedAuthors,
                    books: fetchedBooks,
                    users: fetchedUsers,
                    query: searchRequest
                };

                localStorage.setItem('lastSearchResponse', JSON.stringify(responseData));
                setSearchResponse(responseData);

                props.router.navigate(`/search?query=${searchRequest}`);
            } catch (e) {
                console.log("Failed to send Search Request:", e)
            }
            
        }
        
    }

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
                        <Input icon='search' placeholder='Search...' onChange={handleInputValue} value={searchRequest} />
                        <Button onClick={handleInputSearch}>Search</Button>
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