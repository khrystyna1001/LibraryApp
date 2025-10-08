import React, { Component } from 'react';
import NavBar from '../components/Navigation';
import Footer from '../components/Footer';
import { AuthContext } from '../utils/authContext';

import { 
    List,
    ListItem,
    Card,
    CardContent,
    Button,
    CardDescription,
} from 'semantic-ui-react'

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

    handleBookListButton = () => {
        this.props.router.navigate("/books/");
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
                    <Card>
                      <CardContent>
                        <CardDescription>
                            Loading author info...
                        </CardDescription>
                      </CardContent>
                    </Card>
                </React.Fragment>
            );
        }

        if (error) {
            return (
                <React.Fragment>
                    <NavBar />
                    <Card>
                      <CardContent>
                        <CardDescription>Error: {error.message}</CardDescription>
                        <Button onClick={this.handleAuthorListButton}>Go back to author list</Button>
                      </CardContent>
                    </Card>
                </React.Fragment>
            );
        }
        
        return (
            <React.Fragment>
                <NavBar />
                <Card style={{ display: 'flex', margin: 'auto', align_items: 'center', marginTop: '55px', width: '900px' }}  key={author.id}>
                    <CardContent header={author.full_name}></CardContent>
                        
                    <CardContent>
                        <h3>
                            Books Written:
                        </h3>
                        {author.books_written && author.books_written.length > 0 ? (
                            <List>
                                {author.books_written.map(book => (
                                    <ListItem key={book.id} onClick={() => this.handleBookButton(book.id)}>
                                        {book.title} (Published at: {book.published_date})
                                    </ListItem>
                                ))}
                            </List>
                        ) : (
                            <span>No books found for this author.</span>
                        )}
                    </CardContent>
                        <div className='ui two buttons'>
                            <Button onClick={this.handleAuthorListButton}>
                                Go back to author list
                            </Button>
                            <Button onClick={this.handleBookListButton}>
                                Go back to book list
                            </Button>
                        </div>
                                    
                            {/* ADMIN UI - Context check applied */}
                        <div className='ui two buttons'>
                            {isAdmin && (
                                <>
                                    <Button  onClick={this.handleEditButton}> 
                                        Edit Author
                                    </Button>
                                    <Button onClick={this.handleDeleteButton}> 
                                        Delete Author
                                    </Button>
                                </>
                            )}
                        </div>
                </Card>
                <Footer />
            </React.Fragment>
        )
    }
}

export default withRouter(Author);