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
import { getItem, getItems, updateItem } from '../api';
import EditAuthorModal from '../components/EditAuthorModal';
import DeleteModal from '../components/DeleteModal';


class Author extends Component {
    static contextType = AuthContext;

    constructor(props) {
        super(props);
        this.state = {
          author: {},
          error: null,
          loading: true,
          isEditModalOpen: false,
          isDeleteModalOpen: false,
          currentAuthorToDelete: null,
          currentAuthorToEdit: null,
          isSaving: false,
          bookLookup: {}
        };
    }

    handleAuthorListButton = () => {
        this.props.router.navigate("/authors/");
    }

    handleBookListButton = () => {
        this.props.router.navigate("/books/");
    }

    // handleBookButton = (bookID) => {
    //     this.props.router.navigate(`/books/${bookID}`);
    // }

    handleOpenEditModal = (author) => {
        this.setState({
            isEditModalOpen: true,
            currentAuthorToEdit: author,
        });
    };

    handleCloseEditModal = () => {
        this.setState({
            isEditModalOpen: false,
            currentAuthorToEdit: null,
        });
    };

    handleSaveAuthorEdit = async (updatedAuthor) => {
        this.setState({ isSaving: true });
        
        const token = localStorage.getItem('token') || 'mock-token'; 
        const { id } = updatedAuthor;
        
        try {
            const response = await updateItem('authors', id, token, updatedAuthor);
    
            this.setState({
                author: response,
                isSaving: false,
                isEditModalOpen: false,
                currentAuthorToEdit: null,
            });

        } catch (error) {
            console.error("Failed to save author via API:", error);
            this.setState({ isSaving: false }); 
        }
    };

    handleDeleteAuthor = (deletedAuthorId) => {
        this.setState({
            isDeleteModalOpen: false, 
            currentAuthorToDelete: null,
        });
        this.props.router.navigate("/authors/");
    };

    handleOpenDeleteModal = (author) => {
        this.setState({
            isDeleteModalOpen: true,
            currentAuthorToDelete: author,
        });
    };

    handleCloseDeleteModal = () => {
        this.setState({
            isDeleteModalOpen: false,
            currentAuthorToDelete: null,
        });
    };

    async componentDidMount() {
        const { user } = this.context;
        
        if (!user.isAuthenticated) {
             this.setState({ loading: false });
             return;
        }

        try {
            const token = localStorage.getItem('token');
            const { authorID } = this.props.router.params;

            const [fetchedAuthor, fetchedBooks] = await Promise.all([
                getItem('authors', authorID, token),
                getItems('books', token)
            ]);

            const bookLookup = {};
            if (Array.isArray(fetchedBooks)) {
                fetchedBooks.forEach(book => {
                    bookLookup[book.id] = book;
                });
            }

            if (typeof fetchedAuthor === 'object' && fetchedAuthor !== null && !Array.isArray(fetchedAuthor)) {
                this.setState({
                    author: fetchedAuthor,
                    bookLookup: bookLookup,
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
            console.error("Failed to fetch author:", error);
            this.setState({
                error: error,
                loading: false,
            });
        }
    }

    render() {
        const { author, 
            error, 
            loading,
            isEditModalOpen,
            currentAuthorToEdit,
            isDeleteModalOpen,
            currentAuthorToDelete, 
            isSaving,
            bookLookup } = this.state;
        const { user } = this.context; 
        const isAdmin = user.role === 'admin'; 

        if (loading) {
            return (
                <React.Fragment>
                    <NavBar />
                    <Card style={{ margin: '50px' }}>
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
                    <Card style={{ margin: '50px' }}>
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
                <div style={{ height: '40vh' }}>
                <Card style={{ display: 'flex', margin: 'auto', align_items: 'center', marginTop: '55px', marginBottom: '10px', width: '900px' }}  key={author.id}>
                    <CardContent header={author.full_name}></CardContent>
                        
                    <CardContent>
                        <h3>
                            Books Written:
                        </h3>
                        {author.books_written && author.books_written.length > 0 ? (
                            <List>
                                {author.books_written.map(bookId => {
                                    const book = bookLookup[bookId]
                                    if (!book) {
                                        return <ListItem key={bookId} style={{ color: 'red' }}>Book ID {bookId} (Data Missing)</ListItem>;
                                    }
                                            
                                    return (
                                        <ListItem key={bookId} onClick={() => this.handleBookButton(bookId)}>
                                            {book.title} (Published at: {book.published_date})
                                        </ListItem>
                                    )
                                })}
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
                                    <Button  onClick={() => this.handleOpenEditModal(author)}> 
                                        Edit Author
                                    </Button>
                                    <Button onClick={() => this.handleOpenDeleteModal(author)}> 
                                        Delete Author
                                    </Button>
                                </>
                            )}
                        </div>
                </Card>
                {currentAuthorToEdit && (
                    <EditAuthorModal
                        currentAuthor={currentAuthorToEdit}
                        isOpen={isEditModalOpen}
                        onClose={this.handleCloseEditModal}
                        onSave={this.handleSaveAuthorEdit}
                        isSaving={isSaving}
                    />
                )}
                {currentAuthorToDelete && (
                    <DeleteModal 
                        item={currentAuthorToDelete}
                        itemName={currentAuthorToDelete.full_name}
                        apiItemName={'authors'}
                        isOpen={isDeleteModalOpen}
                        onClose={this.handleCloseDeleteModal}
                        onDelete={this.handleDeleteAuthor}
                    />
                )}
                </div>
                <Footer />
            </React.Fragment>
        )
    }
}

export default withRouter(Author);