import React, { Component } from 'react';
import NavBar from '../components/Navigation';
import Card from 'react-bootstrap/Card';
import axios from 'axios';


class Books extends Component {
    constructor(props) {
        super(props);
        this.state = {
          books: [],
          error: null,
          loading: true,
        };
    }

    async componentDidMount() {
        try {

            const requestHeaders = {
                "Content-Type": "application/x-www-form-urlencoded",
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
            return <Card>Loading...</Card>
        }

        if (error) {
            return <Card>Error: {error.message}</Card>
        }
         return (
            <React.Fragment>
                <NavBar />
                <h1>Book List</h1>
                { books.length > 0 ? (
                    <ul>
                        {books.map(book => (
                            <li key={book.id}>
                                <strong>{book.title}</strong> by {book.author}
                            </li>
                        ))}
                    </ul>
                    ) : (
                        <p>No books found.</p>
                    )}
                <Card body className='m-3 mx-5 px-3'>
                    <pre>{JSON.stringify(books, null, 2)}</pre>
                </Card>
            </React.Fragment>
        )
    }
   
}

export default Books;