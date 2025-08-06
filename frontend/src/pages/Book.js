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
import { getItem, getUserData } from '../api';


class Book extends Component {
    constructor(props) {
        super(props);
        this.state = {
          book: {},
          error: null,
          loading: true,
          user: {},
        };
    }

    fetchUserData = async () => {
            
        const token = localStorage.getItem('token');

        if (!token) {
            console.log("No token found, redirecting to login.");
            this.props.router.navigate("/login/");
            return;
        }
            
        try {
            const userData = await getUserData(token); 
            this.setState({
                user: userData
            });
        } catch (e) {
            console.error("Failed to fetch user data")
            } 
        }

    handleBookListButton = () => {
        this.props.router.navigate("/books/");
    }

    handleAuthorListButton = () => {
        this.props.router.navigate("/authors/");
    }

    async componentDidMount() {
        try {
            this.fetchUserData()
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
        const { book, error, loading, user } = this.state;

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
                                    {book.is_available ? 
                                        <p className='text-success'>AVAILABLE</p> : 
                                        <p className='text-danger'>NOT AVAILABLE</p>
                                    }
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
                            {/*VISITOR UI*/}
                            {book.is_available && this.state.user.groups[0] === 3 ? 
                                <MDBBtn className='primary mx-3' onClick={this.handleBorrowButton}> Borrow Book</MDBBtn> :
                                <></>
                            }
                            {/*LIBARARIAN / ADMIN UI*/}
                            {book.is_available && this.state.user.groups[0] !== 3 ? 
                                <>
                                    <MDBBtn className='primary mx-2' onClick={this.handleIssueButton}> Issue Book</MDBBtn>
                                    <MDBBtn className='primary mx-1' onClick={this.handleEditButton}> Edit Book</MDBBtn></> :
                                <></>
                            }
                        </div>
            </React.Fragment>
        )
    }
}

export default withRouter(Book);