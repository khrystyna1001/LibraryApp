import React, { useState } from 'react';
import { useSearch } from '../utils/searchContext';
import NavBar from '../components/Navigation';
import Footer from '../components/Footer';
import { 
    Container, 
    Header, 
    Segment, 
    List, 
    Message, 
    Divider 
} from 'semantic-ui-react';
import { useLocation } from 'react-router-dom';
import withRouter from '../utils/withRouter';
import Paginate from '../components/Pagination';

function SearchResultsPage(props) {
    const { searchResponse } = useSearch();
    const location = useLocation();
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage] = useState(5)

    const urlParams = new URLSearchParams(location.search);
    const query = urlParams.get('query') || (searchResponse ? searchResponse.query : '');

    const handleAuthorButton = (authorID) => {
        props.router.navigate(`/authors/${authorID}`);
    }

    const handleBookButton = (bookID) => {
        props.router.navigate(`/books/${bookID}`);
    }

    const handleUserButton = (userID) => {
        props.router.navigate(`/users/${userID}`);
    }

    if (!searchResponse) {
        return (
            <Container style={{ marginTop: '2em' }}>
                <Message warning>
                    <Message.Header>No Search Results Found</Message.Header>
                    <p>Please use the search bar in the navigation to search for books, authors, or users.</p>
                </Message>
            </Container>
        );
    }

    const { authors, books, users } = searchResponse;
    const hasResults = authors.length > 0 || books.length > 0 || users.length > 0;

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    }

    const renderList = (currentItems, totalLength, itemName) => (
        <>
            <List divided relaxed>
                {currentItems.map((item) => (
                    <List.Item key={item.id}>
                        <List.Content>
                            <List.Header as='a'>{item.title || item.full_name || item.username}</List.Header>
                            <List.Description>
                            <span style={{ cursor: 'pointer' }} onClick={() => handleBookButton(item.id)}>{itemName === 'Books' && `Book ID: ${item.id}`}</span>
                                <span style={{ cursor: 'pointer' }} onClick={() => handleAuthorButton(item.id)}>{itemName === 'Authors' && `Author ID: ${item.id}`}</span>
                                <span style={{ cursor: 'pointer' }} onClick={() => handleUserButton(item.id)}>{itemName === 'Users' && `User ID: ${item.id}`}</span>
                            </List.Description>
                        </List.Content>
                    </List.Item>
                ))}
            </List>
            {totalLength > itemsPerPage && (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                    <Paginate
                        itemsPerPage={itemsPerPage}
                        totalItems={totalLength}
                        paginate={paginate}
                        currentPage={currentPage} 
                    />
                </div>
            )}
        </>
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    
    const currentBooks = books.slice(indexOfFirstItem, indexOfLastItem);
    const currentAuthors = authors.slice(indexOfFirstItem, indexOfLastItem);
    const currentUsers = users.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <>
        <NavBar />
        <Container style={{ marginTop: '2em' }}>
            <Header as='h1'>
                Search Results for: "<span style={{ color: '#00b5ad' }}>{query}</span>"
            </Header>
            
            <Divider />

            {hasResults ? (
                <>
                    {/* Books Results */}
                    <Segment>
                        <Header as='h2'>Books ({books.length})</Header>
                        {books.length > 0 ? renderList(currentBooks, books.length, 'Books') : <p>No books found.</p>}
                    </Segment>

                    {/* Authors Results */}
                    <Segment>
                        <Header as='h2'>Authors ({authors.length})</Header>
                        {authors.length > 0 ? renderList(currentAuthors, authors.length, 'Authors') : <p>No authors found.</p>}
                    </Segment>

                    {/* Users Results (If applicable to be shown) */}
                    <Segment>
                        <Header as='h2'>Users ({users.length})</Header>
                        {users.length > 0 ? renderList(currentUsers, users.length, 'Users') : <p>No users found.</p>}
                    </Segment>
                </>
            ) : (
                <Message info>
                    <Message.Header>No Results</Message.Header>
                    <p>Your search for **"{query}"** did not return any results in books, authors, or users.</p>
                </Message>
            )}
        </Container>
        <Footer />
        </>
    );
}

export default withRouter(SearchResultsPage);