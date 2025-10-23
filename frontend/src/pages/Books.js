import '../App.css'
import React, { Component } from 'react';
import NavBar from '../components/Navigation';
import Paginate from '../components/Pagination';
import Footer from '../components/Footer';
import { getItems, updateItem, createItem } from '../api';
import {
    Card,
    CardContent,
    CardDescription,
    Button,
    CardHeader,
    Grid,
    GridColumn,
    List,
    ListItem,
    ButtonGroup
} from 'semantic-ui-react';
import { AuthContext } from '../utils/authContext';
import EditBookModal from '../components/EditBookModal';
import DeleteModal from '../components/DeleteModal';

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
          isEditModalOpen: false,
          isDeleteModalOpen: false,
          currentBookToEdit: null,
          currentBookToDelete: null,
          isSaving: false,
          isAdding: false,
        };
    }

    handleInfoButton = (bookID) => {
        this.props.router.navigate(`/books/${bookID}`);
    }

    handleBookListButton = () => {
        this.props.router.navigate("/books/");
    }

    handleOpenEditModal = (book) => {
        this.setState({
            isEditModalOpen: true,
            currentBookToEdit: book,
            isAdding: !book,
        })
    }

    handleCloseEditModal = () => {
        this.setState({
            isEditModalOpen: false,
            currentBookToEdit: null,
            isAdding: false,
        })
    }

    handleAddBook = async (newBook) => {
        this.setState({ isSaving: true });
    
        const token = localStorage.getItem('token') || 'mock-token';
        
        try {
            const response = await createItem('books', token, newBook);
            this.setState(prevState => ({
                books: prevState.books.map(book => {
                    if (!book) return book; 
                    
                    console.log(response)
                    
                    return book.id === response.id ? response : book;
                }),
                isSaving: false,
                isEditModalOpen: false,
                currentBookToEdit: null,
                isAdding: false,
            }));
    
        } catch (error) {
            console.error("Failed to create book via API:", error);
            this.setState({ isSaving: false }); 
        }
    }

    handleSaveBookEdit = async (updatedBook) => {
        this.setState({ isSaving: true });
    
        const token = localStorage.getItem('token') || 'mock-token'; 
        const { id } = updatedBook;
        
        try {
            const response = await updateItem('books', id, token, updatedBook);
    
            this.setState(prevState => ({
                books: prevState.books.map(book => {
                    if (!book) return book; 
                    
                    console.log(response)
                    
                    return book.id === response.id ? response : book;
                }),
                isSaving: false,
                isEditModalOpen: false,
                currentBookToEdit: null,
                isAdding: false,
            }));
    
        } catch (error) {
            console.error("Failed to save book via API:", error);
            this.setState({ isSaving: false }); 
        }
    };

    handleDeleteBook = (deletedBookId) => {
        this.setState(prevState => ({
            books: prevState.books.filter(book => book.id !== deletedBookId),
            isDeleteModalOpen: false, 
            currentBookToDelete: null,
        }));
    };
    
    handleOpenDeleteModal = (book) => {
        this.setState({
            isDeleteModalOpen: true,
            currentBookToDelete: book
        })
    }

    handleCloseDeleteModal = () => {
        this.setState({
            isDeleteModalOpen: false,
            currentBookToDelete: null
        })
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
        const { books, 
            error, 
            loading, 
            currentPage, 
            itemsPerPage,
            isEditModalOpen,
            isDeleteModalOpen, 
            currentBookToEdit,
            currentBookToDelete, 
            isSaving,
            isAdding,
            } = this.state;
        const { user } = this.context; 
        const isAdmin = user.role === 'admin'

        const indexOfLastBook = currentPage * itemsPerPage;
        const indexOfFirstBook = indexOfLastBook - itemsPerPage;
        const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook);

        if (loading) {
            return (
                <React.Fragment>
                    <NavBar />
                    <Card style={{ margin: '50px' }}>
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
                    <Card style={{ margin: '50px' }}>
                      <CardContent>
                        <CardDescription>Error: {error.message}</CardDescription>
                        <Button onClick={this.handleBookListButton}>Go back to book list</Button>
                      </CardContent>
                    </Card>
                </React.Fragment>
            );
        }
        return (
            <div>
                <NavBar />
                
                <div style={{ margin: '50px' }}>
                    <h1>Book List</h1>
                    {isAdmin && (
                        <Button color='teal' style={{ marginBottom: '10px' }} onClick={() => this.handleOpenEditModal()}>
                            Add Book
                        </Button>
                    )}
                    { books.length > 0 ? 
                    (<div> 
                    <Grid columns={4}>
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
                                <CardContent extra>
                                    <Button fluid onClick={() => this.handleInfoButton(book.id)}>View Info</Button>
                                </CardContent>
                                {isAdmin && (
                                    <CardContent extra>
                                        <ButtonGroup widths='2'>
                                            <Button onClick={() => this.handleOpenEditModal(book)}>
                                                Edit Book
                                            </Button>
                                            <Button onClick={() => this.handleOpenDeleteModal(book)}>
                                                Delete Book
                                            </Button>
                                        </ButtonGroup>
                                    </CardContent>
                                )}
                            </Card>
                        </GridColumn>
                        ))}
                        </Grid>
                        </div>
                        ) : (
                            <p>No books found.</p>
                        )}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px', marginBottom: '-230px' }}>
                        <Paginate
                        itemsPerPage={itemsPerPage}
                        totalItems={books.length}
                        paginate={this.paginate}
                        currentPage={currentPage} 
                        />
                    </div>
                    {currentBookToEdit && (
                    <EditBookModal
                        currentBook={currentBookToEdit}
                        isOpen={isEditModalOpen}
                        onClose={this.handleCloseEditModal}
                        onSave={isAdding ? this.handleAddBook : this.handleSaveBookEdit}
                        isSaving={isSaving}
                        isAdding={isAdding}
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
                <Footer />
            </div>
        )
    }
}

export default withRouter(Books);