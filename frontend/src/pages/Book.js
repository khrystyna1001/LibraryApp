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
import { AuthContext } from '../utils/authContext';


class Book extends Component {
    static contextType = AuthContext;

    constructor(props) {
        super(props);
        this.state = {
          book: {},
          error: null,
          loading: true,
          user: {},
        };
    }

    handleBookListButton = () => {
        this.props.router.navigate("/books/");
    }

    handleAuthorListButton = () => {
        this.props.router.navigate("/authors/");
    }

    async componentDidMount() {
        const { user } = this.context;
        
        if (!user.isAuthenticated) {
             this.setState({ loading: false });
             return;
        }
        try {
            const token = localStorage.getItem('token');
            
            const { bookID } = this.props.router.params;

            const fetchedBook = await getItem('books', bookID, token);
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
        const { user } = this.context;
        const isAdmin = user.role === 'admin';

        if (loading) {
            return (
                <React.Fragment>
                    <NavBar />
                    <MDBCard>
                      <MDBCardBody>
                        <MDBCardTitle className="flex items-center justify-center text-indigo-600">
                            Loading author info...
                        </MDBCardTitle>
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
                        <MDBCardTitle className="text-red-600">Error: {error.message}</MDBCardTitle>
                        <MDBBtn className='bg-indigo-600' onClick={this.handleAuthorListButton}>Go back to author list</MDBBtn>
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
                                <MDBCardBody className='border rounded-lg p-4 bg-gray-50'>
                                <h3 className="text-lg font-semibold mb-2 flex items-center">
                                    Authors:
                                </h3>
                                    {Array.isArray(book.author) && book.author.length > 0 ? (
                                        <MDBListGroup light>
                                            {book.author.map((authorObj, index) => (
                                                <MDBListGroupItem className='text-lg font-semibold mb-2 flex items-center' key={book.id}>
                                                    {authorObj.full_name || `${authorObj.first_name} ${authorObj.last_name}`}
                                                    {index < book.author.length - 1 ? ', ' : ''}
                                                </MDBListGroupItem>
                                            ))}
                                        </MDBListGroup>
                                        ) : book.author ? (
                                            <p><strong>Author:</strong> {book.author.full_name || `${book.author.first_name} ${book.author.last_name}`}</p>
                                        ) : (
                                            <span className="text-gray-500">No author information available</span>
                                    )}
                                    {book.is_available ? 
                                        <h5 className='text-lg font-semibold mb-2 flex items-center text-success'>AVAILABLE</h5> : 
                                        <h5 className='text-lg font-semibold mb-2 flex items-center text-danger mb-3'>NOT AVAILABLE</h5>
                                    }
                                    {book.description}
                                    <br></br>
                                    <br></br>
                                    Published at: <p>{book.published_date}</p>
                                </MDBCardBody>
                            </div>
                        </MDBCard>
                        <br></br>
                        <div className='flex space-x-2 pt-4'>
                            <MDBBtn className='mx-3' onClick={this.handleBookListButton}>Go back to book list</MDBBtn>
                            <MDBBtn className='primary mx-3' onClick={this.handleAuthorListButton}>Go back to author list</MDBBtn>
                            {/*VISITOR UI*/}
                            {book.is_available && !isAdmin ? 
                                <MDBBtn className='primary mx-3' onClick={this.handleBorrowButton}> Borrow Book</MDBBtn> :
                                <></>
                            }
                            {/*LIBARARIAN / ADMIN UI*/}
                            {book.is_available && isAdmin ? 
                                <>
                                    <MDBBtn className='primary mx-2' onClick={this.handleIssueButton}> Issue Book</MDBBtn>
                                    <MDBBtn className='primary mx-2' onClick={this.handleEditButton}> Edit Book</MDBBtn>
                                    <MDBBtn className='primary mx-2' onClick={this.handleEditButton}> Delete Book</MDBBtn></> :
                                <></>
                            }
                        </div>
            </React.Fragment>
        )
    }
}

export default withRouter(Book);