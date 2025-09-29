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
            const token = localStorage.getItem('token');
            const { authorID } = this.props.router.params;

            const fetchedAuthor = await getItem('authors', authorID, token);
            console.log(fetchedAuthor)

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

        if (loading) {
            return (
                <React.Fragment>
                    <NavBar />
                    <MDBCard>
                      <MDBCardBody>
                        <MDBCardTitle>Loading author info...</MDBCardTitle>
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
                <MDBCard key={author.id}>
                    <div style={{ margin: '20px' }}>
                        <MDBCardTitle>{author.full_name}</MDBCardTitle>
                                <MDBCardBody>
                                            {author.books_written && author.books_written.length > 0 ? (
                                                <MDBListGroup light>
                                                    {author.books_written.map(book => (
                                                        <MDBListGroupItem key={book.id} onClick={() => this.handleBookButton(book.id)}>
                                                            {book.title} (Published at: {book.published_date})
                                                        </MDBListGroupItem>
                                                    ))}
                                                </MDBListGroup>
                                            ) : (
                                                <span>No data</span>
                                        )}
                            </MDBCardBody>
                        <MDBBtn className='primary' onClick={this.handleAuthorListButton}>Go back to author list</MDBBtn>
                    </div>
                </MDBCard>
            </React.Fragment>
        )
    }
}

export default withRouter(Author);