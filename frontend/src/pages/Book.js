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
import { getItem, issueBook, returnBook, updateItem } from '../api';
import { AuthContext } from '../utils/authContext';
import EditBookModal from '../components/EditBookModal';
import IssueBookModal from '../components/IssueBookModal';
import DeleteModal from '../components/DeleteModal';
import ReturnBookModal from '../components/ReturnBookModal';


class Book extends Component {
    static contextType = AuthContext;

    constructor(props) {
        super(props);
        this.state = {
          book: {},
          error: null,
          loading: true,
          user: {},
          isEditModalOpen: false,
          isIssueModalOpen: false,
          isDeleteModalOpen: false,
          isReturnModalOpen: false,
          isSaving: false,
        };
    }

    handleBookListButton = () => {
        this.props.router.navigate("/books/");
    }

    handleAuthorListButton = () => {
        this.props.router.navigate("/authors/");
    }

    handleOpenEditModal = (book) => {
        this.setState({
            isEditModalOpen: true,
            currentBookToEdit: book,
        });
    };

    handleCloseEditModal = () => {
        this.setState({
            isEditModalOpen: false,
            currentBookToEdit: null,
        });
    };

    handleSaveBookEdit = async (updatedBook) => {
        this.setState({ isSaving: true });
    
        const token = localStorage.getItem('token') || 'mock-token'; 
        const { id } = updatedBook;
        
        try {
            const response = await updateItem('books', id, token, updatedBook);
    
            this.setState({
                book: response,
                isSaving: false,
                isEditModalOpen: false,
                currentBookToEdit: null,
            });
    
        } catch (error) {
            console.error("Failed to save book via API:", error);
            this.setState({ isSaving: false }); 
        }
    };

    handleDeleteBook = (deletedBookId) => {
        this.setState({
            isDeleteModalOpen: false, 
            currentBookToDelete: null,
        });
        this.props.router.navigate("/books/");
    };

    handleOpenDeleteModal = (book) => {
        this.setState({
            isDeleteModalOpen: true,
            currentBookToDelete: book,
        });
    };

    handleCloseDeleteModal = () => {
        this.setState({
            isDeleteModalOpen: false,
            currentBookToDelete: null,
        });
    };

    handleSaveBookIssue = async (issuedBook) => {
        this.setState({ isSaving: true });
    
        const token = localStorage.getItem('token') || 'mock-token'; 
        const { id, user_id } = issuedBook;

        const issuedBookData = {
            "user_id": user_id
        }
        
        try {
            const response = await issueBook(id, 'books', issuedBookData, token);
    
            this.setState({
                book: response,
                isSaving: false,
                isIssueModalOpen: false,
                currentBookToIssue: null,
            });
    
        } catch (error) {
            console.error("Failed to issue book via API:", error);
            this.setState({ isSaving: false }); 
        }
    };

    handleOpenIssueModal = (book) => {
        this.setState({
            isIssueModalOpen: true,
            currentBookToIssue: book,
        });
    };

    handleCloseIssueModal = () => {
        this.setState({
            isIssueModalOpen: false,
            currentBookToIssue: null,
        });
    };

    // handleReturnBook = async (returnedBook) => {
    //     this.setState({ isSaving: true });
    
    //     const token = localStorage.getItem('token') || 'mock-token'; 
    //     const { id, user_id } = returnedBook;

    //     const returnedBookData = {
    //         "user_id": user_id
    //     }
        
    //     try {
    //         const response = await returnBook(id, 'books', returnedBookData, token);
    
    //         this.setState({
    //             book: response,
    //             isSaving: false,
    //             isReturnModalOpen: false,
    //             currentBookToReturn: null,
    //         });
    
    //     } catch (error) {
    //         console.error("Failed to issue book via API:", error);
    //         this.setState({ isSaving: false }); 
    //     }
    // };

    handleReturnBook = (returnedBook) => {
        this.setState({
            book: returnedBook,
            isSaving: false,
            isReturnModalOpen: false,
            currentBookToReturn: null,
        });
    };

    handleOpenReturnModal = (book) => {
        this.setState({
            isReturnModalOpen: true,
            currentBookToReturn: book,
        });
    };

    handleCloseReturnModal = () => {
        this.setState({
            isReturnModalOpen: false,
            currentBookToReturn: null,
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
        const { book, 
            error, 
            loading,
            isEditModalOpen,
            isDeleteModalOpen,
            isIssueModalOpen,
            isReturnModalOpen,
            currentBookToEdit,
            currentBookToDelete, 
            currentBookToIssue,
            currentBookToReturn,
            isSaving } = this.state;
        const { user } = this.context;
        const isAdmin = user.role === 'admin';

        if (loading) {
            return (
                <React.Fragment>
                    <NavBar />
                    <Card style={{ margin: '50px' }}>
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
                    <Card style={{ margin: '50px' }}>
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
                    <div style={{ height: '40vh' }}>
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
                            {/*LIBARARIAN / ADMIN UI*/}
                        <div className='ui two buttons'>
                            {book.id && isAdmin ? 
                                <>
                                <div className='ui two buttons'>
                                    {book.is_available ? 
                                        <Button onClick={() => this.handleOpenIssueModal(book)}> Issue Book</Button>
                                        :
                                        <Button onClick={() => this.handleOpenReturnModal(book)}> Return Book</Button>
                                        }
                                    <Button onClick={() => this.handleOpenEditModal(book)}> Edit Book</Button>
                                </div>
                                <div className='ui button'>
                                    <Button onClick={() => this.handleOpenDeleteModal(book)}> Delete Book</Button>
                                </div></> :
                                <></>
                            }
                        </div>
                    </Card>
                    {currentBookToIssue && currentBookToReturn && (
                        currentBookToIssue.is_available ? 
                        <IssueBookModal
                            currentBook={currentBookToIssue}
                            isOpen={isIssueModalOpen}
                            onClose={this.handleCloseIssueModal}
                            onSave={this.handleSaveBookIssue}
                            isSaving={isSaving}
                        /> :
                        <ReturnBookModal
                            item={currentBookToReturn}
                            itemName={currentBookToReturn.title}
                            apiItemName={'books'}
                            isOpen={isReturnModalOpen}
                            onClose={this.handleCloseReturnModal}
                            onSave={this.handleReturnBook} 
                        />
                    )}
                    {currentBookToEdit && (
                        <EditBookModal
                            currentBook={currentBookToEdit}
                            isOpen={isEditModalOpen}
                            onClose={this.handleCloseEditModal}
                            onSave={this.handleSaveBookEdit}
                            isSaving={isSaving}
                        />
                    )}
                    {currentBookToDelete && (
                        <DeleteModal 
                            item={currentBookToDelete}
                            itemName={currentBookToDelete.title}
                            apiItemName={'books'}
                            isOpen={isDeleteModalOpen}
                            onClose={this.handleCloseDeleteModal}
                            onDelete={this.handleDeleteBook} 
                        />
                    )}
                    </div>
                    <Footer />
            </React.Fragment>
        )
    }
}

export default withRouter(Book);