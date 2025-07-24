import React, { Component } from 'react';
import NavBar from '../components/Navigation';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import axios from 'axios';

import withRouter from '../utils/withRouter';


class Author extends Component {
    constructor(props) {
        super(props);
        this.state = {
          author: {},
          error: null,
          loading: true,
        };
    }

    handleAuthorListButton = () => {
        this.props.router.navigate("/authors/");
    }

    handleBookButton = (bookID) => {
        this.props.router.navigate(`/books/${bookID}`);
    }

    async componentDidMount() {
        try {

            const { authorID } = this.props.router.params;

            const requestHeaders = {
                "Content-Type": "application/json",
                "Authorization": "Token b0ddff958c343d0efa8941aa634d83333c35790e"
            }

            const response = await axios.get(`http://localhost:8000/authors/${authorID}/`, {
                headers: requestHeaders
            });
            const fetchedAuthor = response.data;

            if (typeof fetchedAuthor === 'object' && fetchedAuthor !== null && !Array.isArray(fetchedAuthor)) {
                this.setState({
                author: fetchedAuthor,
                loading: false,
            });
            } else {
                console.error("API did not return an author:", fetchedAuthor);
                this.setState({
                    error: new Error("Invalid data format received from API."),
                    loading: false,
                });
            }

        } catch (error) {
            console.error("Failed to fetch author:", error);
            this.setState({
                error: error,
                loading: false,
            });
        }
    }

    render() {
        const { author, error, loading } = this.state;

        if (loading) {
            return (
                <React.Fragment>
                    <NavBar />
                    <Card body className='m-3 mx-5 px-3'>
                        Loading author info...
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
                <Card key={author.id} body className='m-3 mx-5 px-3'>
                    <div style={{ margin: '20px' }}>
                        <Card.Title>{author.full_name}</Card.Title>
                                <Card.Body>
                                            {author.books_written && author.books_written.length > 0 ? (
                                                <ul>
                                                    {author.books_written.map(book => (
                                                        <li key={book.id} onClick={() => this.handleBookButton(book.id)}>
                                                            {book.title} (Published at: {book.published_date})
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <span>No data</span>
                                        )}
                            </Card.Body>
                        <Button className='primary' onClick={this.handleAuthorListButton}>Go back to author list</Button>
                    </div>
                </Card>
            </React.Fragment>
        )
    }
}

export default withRouter(Author);