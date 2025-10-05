import '../App.css'
import React, { Component } from 'react';
import NavBar from '../components/Navigation';
import Paginate from '../components/Pagination';
import Footer from '../components/Footer';
import { getItems } from '../api';
import {
    Card,
    CardContent,
    CardDescription,
    Button,
    CardHeader,
    Grid,
    GridColumn,
    List,
    ListItem
} from 'semantic-ui-react';
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
                    <Card>
                      <CardContent>
                        <CardDescription>
                            Loading books...
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
                        <Button onClick={this.handleAuthorListButton}>Go back to book list</Button>
                      </CardContent>
                    </Card>
                </React.Fragment>
            );
        }
        return (
            <div>
                <NavBar />
                <div>
                    <h1>Book List</h1>
                    { books.length > 0 ? 
                    (<Grid columns={4}>
                    {currentBooks.map(book => (
                        <GridColumn key={book.id}>
                            <Card>
                                <CardContent>
                                    <CardHeader>{book.title}</CardHeader>
                                    <CardDescription>{book.is_available ? 
                                        <p>AVAILABLE</p> : <p>NOT AVAILABLE</p>}</CardDescription>
                                            {Array.isArray(book.author) && book.author.length > 0 ? (
                                                <List>
                                                    {book.author.map((authorObj, index) => (
                                                        <ListItem key={authorObj.id}>
                                                            {authorObj.full_name || `${authorObj.first_name} ${authorObj.last_name}`}
                                                            {index < book.author.length - 1 ? ', ' : ''}
                                                        </ListItem>
                                                    ))}
                                                </List>
                                            ) : (
                                                <span></span>
                                            )}
                                        </CardContent>
                                        <Button onClick={() => this.handleInfoButton(book.id)}>View Info</Button>
                                        {isAdmin && (<>
                                        <Button onClick={() => this.handleEditButton(book.id)}>
                                        </Button>
                                        <Button onClick={() => this.handleDeleteButton(book.id)}>
                                        </Button></>
                                        )}
                                </Card>
                            </GridColumn>
                            ))}
                            </Grid>
                        ) : (
                            <p>No books found.</p>
                        )}
                    <Paginate
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