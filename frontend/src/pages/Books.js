import React, { Component } from 'react';
import NavBar from '../components/Navigation';
import { getItems } from '../api';
import { 
    MDBListGroup,
    MDBCard,
    MDBCardBody,
    MDBCardTitle,
    MDBBtn,
    MDBListGroupItem 
} 
from 'mdb-react-ui-kit';

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

            const token = localStorage.getItem('token');
            const fetchedBooks = await getItems('book', token)

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
                    <MDBCard>
                      <MDBCardBody>
                        <MDBCardTitle>Loading books...</MDBCardTitle>
                      </MDBCardBody>
                    </MDBCard>
                </React.Fragment>
            );
        }

        if (error) {
            return (
                <React.Fragment>
                    <NavBar />
                    <MDBCard>
                      <MDBCardBody>
                        <MDBCardTitle>Error: {error.message}</MDBCardTitle>
                      </MDBCardBody>
                    </MDBCard>
                </React.Fragment>
            );
        }
        return (
            <React.Fragment>
                <NavBar />
                <MDBCard alignment='center'>
                
                <h1 style={{ margin: '50px' }}>Book List</h1>
                { books.length > 0 ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                        {books.map(book => (
                            <MDBCard key={book.id} body className='m-4' style={{ width: '20rem' }}>
                                <MDBCardBody>
                                        <MDBCardTitle>{book.title}</MDBCardTitle>
                                            {Array.isArray(book.author) && book.author.length > 0 ? (
                                                <MDBListGroup light>
                                                    {book.author.map((authorObj, index) => (
                                                        <MDBListGroupItem key={book.id}>
                                                            {authorObj.full_name || `${authorObj.first_name} ${authorObj.last_name}`}
                                                            {index < book.author.length - 1 ? ', ' : ''}
                                                        </MDBListGroupItem>
                                                    ))}
                                                </MDBListGroup>
                                            ) : (
                                                <span></span>
                                        )}
                                </MDBCardBody>
                                <MDBBtn className='primary' onClick={() => this.handleInfoButton(book.id)}>View Info</MDBBtn>
                            </MDBCard>
                        ))}
                    </div>
                    ) : (
                        <p>No books found.</p>
                    )
                    }
                </MDBCard>
            </React.Fragment>
        )
    }
}

export default withRouter(Books);