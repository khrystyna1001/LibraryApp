import React, { Component } from "react";
import { getItems, updateItem } from "../api";
import NavBar from '../components/Navigation'
import {
    Table,
    TableRow,
    TableHeaderCell,
    TableHeader,
    TableCell,
    TableBody,
    List,
    ListItem,
    Button, 
    Card, 
    CardContent, 
    CardDescription,
    Message
  } from 'semantic-ui-react'
import { AuthContext } from "../utils/authContext";
import EditBookModal from "../components/EditBookModal";
import DeleteModal from "../components/DeleteModal";
import Paginate from "../components/Pagination";

class AdminBooks extends Component {
    static contextType = AuthContext;

    constructor(props) {
        super(props);
        this.state = {
          books: [],
          currentPage: 1,
          itemsPerPage: 10,
          error: null,
          loading: true,
          isEditModalOpen: false,
          isDeleteModalOpen: false,
          currentBookToEdit: null,
          currentBookToDelete: null,
          isSaving: false,
        };
    }

    handleEditBook = (book) => {
        this.setState({
            isEditModalOpen: true,
            currentBookToEdit: book,
        });
    };

    handleCloseModal = () => {
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
    
            this.setState(prevState => ({
                books: prevState.books.map(book => {
                    if (!book) return book; 
                    
                    console.log(response)
                    
                    return book.id === response.id ? response : book;
                }),
                isSaving: false,
                isEditModalOpen: false,
                currentBookToEdit: null,
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
            currentBookToDelete: book,
        });
    };

    handleCloseDeleteModal = () => {
        this.setState({
            isDeleteModalOpen: false,
            currentBookToDelete: null,
        });
    };

    async componentDidMount() {
        const { user } = this.context;
        
        if (!user.isAuthenticated) {
             this.setState({ loading: false });
             return;
        }

        try {
            const token = localStorage.getItem('token') || 'mock-token'; 
            
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

    paginate = (pageNumber) => {
        this.setState({
            currentPage: pageNumber
        })
    }

    render() {
        const { books, 
            loading, 
            error, 
            currentPage, 
            itemsPerPage,
            isEditModalOpen,
            isDeleteModalOpen, 
            currentBookToEdit,
            currentBookToDelete, 
            isSaving  
        } = this.state;

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const currentBooks = books.slice(startIndex, endIndex);

        return (
            <div>
                <style jsx="true">{`
                    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap');
                    body { font-family: 'Inter', sans-serif; background-color: #f7f9fb; }
                `}</style>
                
                <NavBar /> 
                
                <div style={{ margin: '55px' }}>
                {error && (
                    <Message 
                        negative
                        icon='warning sign'
                        header='Data Loading Error'
                        content={error.message || 'An unknown error occurred while fetching data.'}
                        onDismiss={() => this.setState({ error: null })}
                    />
                )}

                {loading ? (
                    <Card>
                      <CardContent>
                        <CardDescription>
                            Loading books...
                        </CardDescription>
                      </CardContent>
                    </Card>
                ) : (
                    <div>
                        <div>
                            <h2>Current Inventory ({books.length} books)</h2>
                        </div>

                        <div>
                            <Table celled>
                                <TableHeader>
                                    <TableRow>
                                        <TableHeaderCell>ID</TableHeaderCell>
                                        <TableHeaderCell>Title</TableHeaderCell>
                                        <TableHeaderCell>Author</TableHeaderCell>
                                        <TableHeaderCell>Year</TableHeaderCell>
                                        <TableHeaderCell>Availability</TableHeaderCell>
                                        <TableHeaderCell>Actions</TableHeaderCell>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {currentBooks.map(book => (
                                        <TableRow key={book.id}>
                                            <TableCell>{book.id}</TableCell>
                                            <TableCell>{book.title}</TableCell>
                                            <TableCell>
                                            {Array.isArray(book.author) && book.author.length > 0 ? (
                                                <List>
                                                    {book.author.map((authorObj, index) => (
                                                        <ListItem>
                                                            {authorObj.full_name || `${authorObj.first_name} ${authorObj.last_name}`}
                                                            {index < book.author.length - 1 ? ', ' : ''}
                                                        </ListItem>
                                                    ))}
                                                </List>    
                                            ) : (
                                                <span></span>
                                            )}
                                            </TableCell>
                                            <TableCell>{book.published_date}</TableCell> 
                                            <TableCell>{book.is_available ? "Available" : "Not Available"}</TableCell>
                                            <TableCell>
                                                <Button icon="edit" onClick={() => this.handleEditBook(book)}/>
                                                <Button icon="trash" onClick={() => this.handleOpenDeleteModal(book)}/>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                            <Paginate
                                itemsPerPage={itemsPerPage}
                                totalItems={books.length}
                                paginate={this.paginate}
                                currentPage={currentPage}
                            />
                        </div>
                    </div>
                )}
                {currentBookToEdit && (
                    <EditBookModal
                        currentBook={currentBookToEdit}
                        isOpen={isEditModalOpen}
                        onClose={this.handleCloseModal}
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
            </div>
        )
    }
}

export default AdminBooks;