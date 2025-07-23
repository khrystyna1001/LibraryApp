import React, { Component } from 'react';
import NavBar from '../components/Navigation';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import axios from 'axios';

import withRouter from '../utils/withRouter';


class Book extends Component {
    constructor(props) {
        super(props);
        this.state = {
          book: {},
          error: null,
          loading: true,
        };
    }

    handleBookListButton = () => {
        this.props.router.navigate("/books/");
    }

    handleAuthorListButton = () => {
        this.props.router.navigate("/authors/");
    }

    async componentDidMount() {
        try {

            const { bookID } = this.props.router.params;

            const requestHeaders = {
                "Content-Type": "application/json",
                "Authorization": "Token b0ddff958c343d0efa8941aa634d83333c35790e"
            }

            const response = await axios.get(`http://localhost:8000/books/${bookID}/`, {
                headers: requestHeaders
            });
            const fetchedBook = response.data;

            if (typeof fetchedBook === 'object' && fetchedBook !== null && !Array.isArray(fetchedBook)) {
                this.setState({
                book: fetchedBook,
                loading: false,
            });
            } else {
                console.error("API did not return a book:", fetchedBook);
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
        const { book, error, loading } = this.state;

        if (loading) {
            return (
                <React.Fragment>
                    <NavBar />
                    <Card body className='m-3 mx-5 px-3'>
                        Loading book info...
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
                    <div style={{ margin: '20px' }}>
                        <Card.Title>{book.title}</Card.Title>
                        <Card.Text>{book.description}
                        {book.published_date}
                        {Array.isArray(book.author) && book.author.length > 0 ? (
                            <ul>
                                {book.author.map((authorObj, index) => (
                                    <li key={book.id}>
                                        {authorObj.full_name || `${authorObj.first_name} ${authorObj.last_name}`}
                                        {index < book.author.length - 1 ? ', ' : ''}
                                    </li>
                                ))}
                            </ul>
                            ) : book.author ? (
                                <p><strong>Author:</strong> {book.author.full_name || `${book.author.first_name} ${book.author.last_name}`}</p>
                            ) : (
                                <span>No author information available</span>
                        )}
                        </Card.Text>
                        <Button className='primary' onClick={this.handleBookListButton}>Go back to book list</Button>
                        <Button className='primary mx-3' onClick={this.handleAuthorListButton}>Go back to author list</Button>
                    </div>
                </Card>
            </React.Fragment>
        )
    }
}

export default withRouter(Book);