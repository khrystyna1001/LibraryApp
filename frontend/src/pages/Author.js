import React, { Component } from 'react';
import NavBar from '../components/Navigation';
import { AuthContext } from '../utils/authContext';

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


class Author extends Component {
    static contextType = AuthContext;

    constructor(props) {
        super(props);
        this.state = {
          author: {},
          error: null,
          loading: true,
        };
        this.handleAuthorListButton = this.handleAuthorListButton.bind(this);
        this.handleBookButton = this.handleBookButton.bind(this);
        this.handleEditButton = this.handleEditButton.bind(this);
        this.handleDeleteButton = this.handleDeleteButton.bind(this);
    }

    handleAuthorListButton = () => {
        this.props.router.navigate("/authors/");
    }

    handleBookButton = (bookID) => {
        this.props.router.navigate(`/books/${bookID}`);
    }

    handleEditButton() {
        console.log('Edit Author clicked');
    }

    handleDeleteButton() {
        console.log('Delete Author clicked');
    }

    async componentDidMount() {
        const { user } = this.context;
        
        if (!user.isAuthenticated) {
             this.setState({ loading: false });
             return;
        }

        try {
            const token = localStorage.getItem('token');
            const { authorID } = this.props.router.params;

            const fetchedAuthor = await getItem('authors', authorID, token);

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
            console.error("Failed to fetch authors:", error);
            this.setState({
                error: error,
                loading: false,
            });
        }
    }

    render() {
        const { author, error, loading } = this.state;
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
                <MDBCard key={author.id}>
                    <div className='m-4'>
                        <MDBCardTitle className="flex items-center">
                            {author.full_name}
                        </MDBCardTitle>
                        
                        <MDBCardBody className="border rounded-lg p-4 bg-gray-50">
                            <h3 className="text-lg font-semibold mb-2 flex items-center">
                                Books Written:
                            </h3>
                            {author.books_written && author.books_written.length > 0 ? (
                                <MDBListGroup>
                                    {author.books_written.map(book => (
                                        <MDBListGroupItem key={book.id} onClick={() => this.handleBookButton(book.id)}>
                                            {book.title} (Published at: {book.published_date})
                                        </MDBListGroupItem>
                                    ))}
                                </MDBListGroup>
                            ) : (
                                <span className="text-gray-500">No books found for this author.</span>
                            )}
                        </MDBCardBody>
                        
                        <div className='flex space-x-2 pt-4'>
                            <MDBBtn className='bg-gray-500 hover:bg-gray-600' onClick={this.handleAuthorListButton}>
                                Go back to author list
                            </MDBBtn>
                            
                            {/* ADMIN UI - Context check applied */}
                            {isAdmin && (
                                <>
                                    <MDBBtn className='mx-3' onClick={this.handleEditButton}> 
                                        Edit Author
                                    </MDBBtn>
                                    <MDBBtn className='bg-red-600 hover:bg-red-700' onClick={this.handleDeleteButton}> 
                                        Delete Author
                                    </MDBBtn>
                                </>
                            )}
                        </div>
                    </div>
                </MDBCard>
            </React.Fragment>
        )
    }
}

export default withRouter(Author);