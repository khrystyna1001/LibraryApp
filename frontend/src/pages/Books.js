import React, { Component } from 'react';
import NavBar from '../components/Navigation';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import axios from 'axios';

import withRouter from '../utils/withRouter';


class Books extends Component {
    constructor(props) {
        super(props);
        this.state = {
          books: [],
          error: null,
          loading: true,
        };
    }

    handleInfoButton = (bookID) => {
        this.props.router.navigate(`${bookID}`);
    }

    async componentDidMount() {
        try {

            const requestHeaders = {
                "Content-Type": "application/json",
                "Authorization": "Token b0ddff958c343d0efa8941aa634d83333c35790e"
            }

            const response = await axios.get('http://localhost:8000/books/', {
                headers: requestHeaders
            });
            
            const fetchedBooks = response.data;

            if (Array.isArray(fetchedBooks)) {
                this.setState({
                books: fetchedBooks,
                loading: false,
            });
            } else {
                console.error("API did not return an array for books:", fetchedBooks);
                this.setState({
                    error: new Error("Invalid data format received from API."),
                    loading: false,
                });
            }

        } catch (error) {
            console.error("Failed to fetch books:", error);
            this.setState({
                error: error,
                loading: false,
            });
    }
}

    render() {
        const { books, error, loading } = this.state;

        if (loading) {
            return (
                <React.Fragment>
                    <NavBar />
                    <Card body className='m-3 mx-5 px-3'>
                        Loading books...
                    </Card>
                </React.Fragment>
            );
        }

        if (error) {
            return (
                <React.Fragment>
                    <NavBar />
                    <Card body className='m-3 mx-5 px-3'>
                        Error: {error.message}
                    </Card>
                </React.Fragment>
            );
        }
        return (
            <React.Fragment>
                <NavBar />
                <Card body className='m-3 mx-5 px-3'>
                
                <h1 style={{ margin: '20px' }}>Book List</h1>
                { books.length > 0 ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                        {books.map(book => (
                            <Card key={book.id} body className='m-3' style={{ width: '18rem' }}>
                                <Card.Body>
                                        <Card.Title>{book.title}</Card.Title>
                                            {Array.isArray(book.author) && book.author.length > 0 ? (
                                                <ul>
                                                    {book.author.map((authorObj, index) => (
                                                        <li key={book.id}>
                                                            {authorObj.full_name || `${authorObj.first_name} ${authorObj.last_name}`}
                                                            {index < book.author.length - 1 ? ', ' : ''}
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <span></span>
                                        )}
                                </Card.Body>
                                <Button className='primary' onClick={() => this.handleInfoButton(book.id)}>View Info</Button>
                            </Card>
                        ))}
                    </div>
                    ) : (
                        <p>No books found.</p>
                    )
                    }
                </Card>
            </React.Fragment>
        )
    }
}

export default withRouter(Books);