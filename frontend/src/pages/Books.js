import '../App.css'
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
    MDBBtnGroup,
    MDBIcon,
    MDBListGroupItem, 
    MDBCardText,
    MDBRow,
    MDBCol
} 
from 'mdb-react-ui-kit';
import { AuthContext } from '../utils/authContext';

import withRouter from '../utils/withRouter';

class Books extends Component {
    static contextType = AuthContext;

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
        const { user } = this.context;
        
        if (!user.isAuthenticated) {
             this.setState({ loading: false });
             return;
        }

        try {

            const token = localStorage.getItem('token');
            const fetchedBooks = await getItems('books', token)

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
         const { user } = this.context; 
        const isAdmin = user.role === 'admin'

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
            <div className="main-container">
                <NavBar />
                <div className="list-container">
                    <h1 className="header-text">Book List</h1>
                    { books.length > 0 ? 
                    (<MDBRow className='row-cols-1 row-cols-md-2 row-cols-lg-4 g-4'>
                    {currentBooks.map(book => (
                        <MDBCol key={book.id} className='mb-4'>
                            <MDBCard className='h-100'>
                                <MDBCardBody>
                                    <MDBCardTitle>{book.title}</MDBCardTitle>
                                    <MDBCardText>{book.is_available ? 
                                        <p className='text-success'>AVAILABLE</p> : <p className='text-danger'>NOT AVAILABLE</p>}</MDBCardText>
                                            {Array.isArray(book.author) && book.author.length > 0 ? (
                                                <MDBListGroup light>
                                                    {book.author.map((authorObj, index) => (
                                                        <MDBListGroupItem key={authorObj.id}>
                                                            {authorObj.full_name || `${authorObj.first_name} ${authorObj.last_name}`}
                                                            {index < book.author.length - 1 ? ', ' : ''}
                                                        </MDBListGroupItem>
                                                    ))}
                                                </MDBListGroup>
                                            ) : (
                                                <span></span>
                                            )}
                                        </MDBCardBody>
                                    <MDBBtnGroup shadow='0'>
                                        <MDBBtn className='bg-info' onClick={() => this.handleInfoButton(book.id)}>View Info</MDBBtn>
                                        {isAdmin && (<>
                                        <MDBBtn className='bg-info' onClick={() => this.handleEditButton(book.id)}>
                                            <MDBIcon fas icon="edit" />
                                        </MDBBtn>
                                        <MDBBtn className='bg-danger' onClick={() => this.handleDeleteButton(book.id)}>
                                            <MDBIcon fas icon="trash" />
                                        </MDBBtn></>
                                        )}
                                    </MDBBtnGroup>
                                </MDBCard>
                            </MDBCol>
                            ))}
                            </MDBRow>
                        ) : (
                            <p>No books found.</p>
                        )}
                    <Pagination
                    itemsPerPage={itemsPerPage}
                    totalItems={books.length}
                    paginate={this.paginate}
                    currentPage={currentPage} 
                    />
                </div>
                <Footer />
            </div>
        )
    }
}

export default withRouter(Books);