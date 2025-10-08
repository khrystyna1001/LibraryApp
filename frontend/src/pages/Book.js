import React, { Component } from 'react';
import NavBar from '../components/Navigation';
import Footer from '../components/Footer';

import { 
    Card,
    CardContent,
    CardDescription,
    Button,
    List,
    ListItem
} from 'semantic-ui-react';

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
                    <Card>
                      <CardContent>
                        <CardDescription>
                            Loading book info...
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
                        <CardDescription> Error: {error.message}</CardDescription>
                        <Button onClick={this.handleAuthorListButton}>Go back to author list</Button>
                      </CardContent>
                    </Card>
                </React.Fragment>
            );
        }

        return (
            <React.Fragment>
                    <NavBar />
                    <Card style={{ display: 'flex', margin: 'auto', align_items: 'center', marginTop: '55px', width: '900px' }}>

                        <CardContent header={book.title}></CardContent>
                                <CardContent>
                                <h3>
                                    Authors:
                                </h3>
                                    {Array.isArray(book.author) && book.author.length > 0 ? (
                                        <List>
                                            {book.author.map((authorObj, index) => (
                                                <ListItem key={book.id}>
                                                    {authorObj.full_name || `${authorObj.first_name} ${authorObj.last_name}`}
                                                    {index < book.author.length - 1 ? ', ' : ''}
                                                </ListItem>
                                            ))}
                                        </List>
                                        ) : book.author ? (
                                            <p><strong>Author:</strong> {book.author.full_name || `${book.author.first_name} ${book.author.last_name}`}</p>
                                        ) : (
                                            <span>No author information available</span>
                                    )}
                                    {book.is_available ? 
                                        <h5>AVAILABLE</h5> : 
                                        <h5>NOT AVAILABLE</h5>
                                    }
                                    {book.description}
                                    <br></br>
                                    <br></br>
                                    Published at: <p>{book.published_date}</p>
                                </CardContent>
                        <br></br>
                        <div className='ui two buttons'>
                            <Button onClick={this.handleBookListButton}>Go back to book list</Button>
                            <Button onClick={this.handleAuthorListButton}>Go back to author list</Button>
                        
                        </div>
                            {/*VISITOR UI*/}
                        <div className='ui button'>
                            {book.is_available && !isAdmin ? 
                                <Button onClick={this.handleBorrowButton}> Borrow Book</Button> :
                                <></>
                            }
                        </div>
                            {/*LIBARARIAN / ADMIN UI*/}
                        <div className='ui two buttons'>
                            {book.is_available && isAdmin ? 
                                <>
                                    <Button onClick={this.handleIssueButton}> Issue Book</Button>
                                    <Button onClick={this.handleEditButton}> Edit Book</Button>
                                    <Button onClick={this.handleEditButton}> Delete Book</Button></> :
                                <></>
                            }
                        </div>
                    </Card>
                    <Footer />
            </React.Fragment>
        )
    }
}

export default withRouter(Book);