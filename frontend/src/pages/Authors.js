import React, { Component } from 'react';
import NavBar from '../components/Navigation';
import Card from 'react-bootstrap/Card';
import axios from 'axios';

class Authors extends Component {
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

            const response = await axios.get('http://localhost:8000/authors/', {
                headers: requestHeaders
            });
            const fetchedAuthors = response.data;

            if (Array.isArray(fetchedAuthors)) {
                this.setState({
                authors: fetchedAuthors,
                loading: false,
            });
            } else {
                console.error("API did not return an array for authors:", fetchedAuthors);
                this.setState({
                    error: new Error("Invalid data format received from API."),
                    loading: false,
                });
            }

        } catch (error) {
            console.error("Failed to fetch authors:", error);
            this.setState({
                error: error,
                loading: false,
            });
    }
}

    render() {
        const {  authors, error, loading } = this.state;

        if (loading) {
            return <Card>Loading...</Card>
        }

        if (error) {
            return <Card>Error: {error.message}</Card>
        }
         return (
            <React.Fragment>
                <NavBar />
                <h1>Author List</h1>
                { authors.length > 0 ? (
                    <ul>
                        {authors.map(author => (
                            <li key={author.id}>
                                <strong>{author.full_name}</strong> { 
                                    Array.isArray(author.books_written) && author.books_written.length > 0 ? (
                                        author.books_written.map((bookObj, index) => (
                                            <span key={bookObj.id}>
                                                {bookObj.title}
                                                {index < author.books_written.length - 1 ? ', ' : ''}
                                            </span>
                                        ))
                                    ) : (
                                        <span></span>
                                )}
                            </li>
                        ))}
                    </ul>
                    ) : (
                        <p>No authors found.</p>
                    )}
                <Card body className='m-3 mx-5 px-3'>
                    <pre>{JSON.stringify(authors, null, 2)}</pre>
                </Card>
            </React.Fragment>
        )
    }
   
}

export default Authors;