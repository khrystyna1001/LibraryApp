import React, { Component } from 'react';
import NavBar from '../components/Navigation';

import { 
    MDBListGroup,
    MDBCard,
    MDBCardBody,
    MDBCardTitle,
    MDBBtn,
    MDBListGroupItem 
} from 'mdb-react-ui-kit'

import withRouter from '../utils/withRouter';
import { getItem } from '../api';


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
            const token = localStorage.getItem('token');
            const { bookID } = this.props.router.params;

            const fetchedBook = await getItem('book', bookID, token);
            console.log(fetchedBook)

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
                    <MDBCard>
                      <MDBCardBody>
                        <MDBCardTitle>Loading book info...</MDBCardTitle>
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
                        <MDBCardTitle className='m-4'>{book.title}</MDBCardTitle>
                        <MDBCard>
                            <div style={{ display: 'flex', margin: '20px' }}>
                                <MDBCardBody>
                                    Authors: {Array.isArray(book.author) && book.author.length > 0 ? (
                                        <MDBListGroup light>
                                            {book.author.map((authorObj, index) => (
                                                <MDBListGroupItem key={book.id}>
                                                    {authorObj.full_name || `${authorObj.first_name} ${authorObj.last_name}`}
                                                    {index < book.author.length - 1 ? ', ' : ''}
                                                </MDBListGroupItem>
                                            ))}
                                        </MDBListGroup>
                                        ) : book.author ? (
                                            <p><strong>Author:</strong> {book.author.full_name || `${book.author.first_name} ${book.author.last_name}`}</p>
                                        ) : (
                                            <span>No author information available</span>
                                    )}
                                    {book.description}
                                    <br></br>
                                    <br></br>
                                    Published at: <p>{book.published_date}</p>
                                </MDBCardBody>
                            </div>
                        </MDBCard>
                        <br></br>
                        <div style={{ margin: '10px' }}>
                            <MDBBtn className='primary' onClick={this.handleBookListButton}>Go back to book list</MDBBtn>
                            <MDBBtn className='primary mx-3' onClick={this.handleAuthorListButton}>Go back to author list</MDBBtn>

                            <MDBBtn className='primary mx-3' onClick={this.handleBorrowButton}>Borrow Book</MDBBtn>
                        </div>
            </React.Fragment>
        )
    }
}

export default withRouter(Book);