import React, { Component } from 'react';
import NavBar from '../components/Navigation';
import Pagination from '../components/Pagination';
import Footer from '../components/Footer';
import { getItems } from '../api';
import { 
    MDBListGroup,
    MDBCard,
    MDBCardBody,
    MDBCardTitle,
    MDBBtn,
    MDBListGroupItem, 
    MDBCardText,
    MDBCol,
    MDBRow
} 
from 'mdb-react-ui-kit';

import withRouter from '../utils/withRouter';


class Books extends Component {
    constructor(props) {
        super(props);
        this.state = {
          books: [],
          currentPage: 1,
          itemsPerPage: 8,
          error: null,
          loading: true,
        };
    }

    handleInfoButton = (bookID) => {
        this.props.router.navigate(`${bookID}`);
    }

    paginate = (pageNumber) => {
        this.setState({
            currentPage: pageNumber
        })
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
        const { books, error, loading, currentPage, itemsPerPage } = this.state;

        const indexOfLastBook = currentPage * itemsPerPage;
        const indexOfFirstBook = indexOfLastBook - itemsPerPage;
        const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook);

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
                <MDBRow>
                <MDBCol className='col-md-4'>
                    { books.length > 0 ? 
                        (currentBooks.map(book => (
                            <MDBCard key={book.id} body className='m-4'>
                                <MDBCardBody>
                                        <MDBCardTitle>{book.title}</MDBCardTitle>
                                        <MDBCardText>{book.is_available ? 
                                            <p className='text-success'>AVAILABLE</p> : <p className='text-danger'>NOT AVAILABLE</p>}</MDBCardText>
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
                          ))
                        ) : (
                            <p>No books found.</p>
                        )
                        
                        } 
                        </MDBCol>
                    </MDBRow>
                    <Pagination
                    itemsPerPage={itemsPerPage}
                    totalItems={books.length}
                    paginate={this.paginate}
                    currentPage={currentPage} 
                    />
                </MDBCard>
                <Footer />
            </React.Fragment>
        )
    }
}

export default withRouter(Books);