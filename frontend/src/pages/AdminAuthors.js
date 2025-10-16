import React, { Component } from "react";
import { getItems, updateItem } from "../api";
import NavBar from '../components/Navigation'
import withRouter from "../utils/withRouter";
import { Card, 
    CardContent, 
    CardDescription, 
    Table, 
    TableCell, 
    TableHeader, 
    TableHeaderCell,
    TableBody,
    TableRow,
    Button,
    List,
    ListItem,
    Message
 } from "semantic-ui-react";
 import { AuthContext } from "../utils/authContext";
 import Paginate from "../components/Pagination";
 import DeleteModal from "../components/DeleteModal";
 import EditAuthorModal from "../components/EditAuthorModal";

class AdminAuthors extends Component {
    static contextType = AuthContext;

    constructor(props) {
        super(props);
        this.state = {
            authors: [],
            currentPage: 1,
            itemsPerPage: 10,
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

    handleBookButton = (bookID) => {
        this.props.router.navigate(`/books/${bookID}`);
    }

    handleAuthorButton = (authorId) => {
        this.props.router.navigate(`/authors/${authorId}`);
    }

    handleEditAuthor = (author) => {
        this.setState({
            isEditModalOpen: true,
            currentAuthorToEdit: author,
        });
    };

    handleCloseModal = () => {
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
    
            this.setState(prevState => ({
                authors: prevState.authors.map(author => {
                    if (!author) return author; 
                    
                    console.log(response)
                    
                    return author.id === response.id ? response : author;
                }),
                isSaving: false,
                isEditModalOpen: false,
                currentAuthorToEdit: null,
            }));
    
        } catch (error) {
            console.error("Failed to save author via API:", error);
            this.setState({ isSaving: false }); 
        }
    };

    async componentDidMount() {
        const { user } = this.context;
        
        if (!user.isAuthenticated) {
             this.setState({ loading: false });
             return;
        }
        
        try {

            const token = localStorage.getItem('token');

            const [fetchedAuthors, fetchedBooks] = await Promise.all([
                getItems('authors', token),
                getItems('books', token)
            ]);
            
            const bookLookup = {};
            if (Array.isArray(fetchedBooks)) {
                fetchedBooks.forEach(book => {
                    bookLookup[book.id] = book;
                });
            }

            if (Array.isArray(fetchedAuthors)) {
                this.setState({
                authors: fetchedAuthors,
                bookLookup: bookLookup,
                loading: false,
            });

            } else {
                console.error("API did not return an array for authors:", fetchedAuthors);
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

    handleDeleteAuthor = (deletedAuthorId) => {
        this.setState(prevState => ({
            authors: prevState.authors.filter(author => author.id !== deletedAuthorId),
            isDeleteModalOpen: false, 
            currentAuthorToDelete: null,
        }));
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
            currentBookToDelete: null,
        });
    };

    paginate = (pageNumber) => {
        this.setState({
            currentPage: pageNumber
        })
    }

    render() {
        const { authors, 
            loading, 
            error, 
            currentPage, 
            itemsPerPage,
            isEditModalOpen,
            currentAuthorToEdit,
            isDeleteModalOpen,
            currentAuthorToDelete, 
            isSaving,
            bookLookup
        } = this.state;
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const currentAuthors = authors.slice(startIndex, endIndex);

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
                           Loading authors...
                       </CardDescription>
                     </CardContent>
                   </Card>
                ) : (
                    <div>
                        <div>
                            <h2>({authors.length} authors)</h2>
                        </div>

                        <div>
                            <Table celled>
                                <TableHeader>
                                    <TableRow>
                                        <TableHeaderCell>ID</TableHeaderCell>
                                        <TableHeaderCell>Full Name</TableHeaderCell>
                                        <TableHeaderCell>Books Written</TableHeaderCell>
                                        <TableHeaderCell>Actions</TableHeaderCell>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {currentAuthors.map(author => (
                                        <TableRow key={author.id}>
                                            <TableCell>{author.id}</TableCell>
                                            <TableCell>{author.full_name}</TableCell>
                                            <TableCell>
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
                                                <span>No data</span>
                                            )}
                                            </TableCell>
                                            <TableCell>
                                                <Button icon='edit' onClick={() => this.handleEditAuthor(author)}>
                                                </Button>
                                                <Button icon='trash' onClick={() => this.handleOpenDeleteModal(author)}>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                            <Paginate
                                itemsPerPage={itemsPerPage}
                                totalItems={authors.length}
                                paginate={this.paginate}
                                currentPage={currentPage}
                            />
                        </div>
                    </div>
                )}
                {currentAuthorToEdit && (
                    <EditAuthorModal
                        currentAuthor={currentAuthorToEdit}
                        isOpen={isEditModalOpen}
                        onClose={this.handleCloseModal}
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
            </div>
        )
    }
}

export default withRouter(AdminAuthors);