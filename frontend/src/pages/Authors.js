import '../App.css'
import React, { Component } from 'react';
import NavBar from '../components/Navigation';
import Paginate from '../components/Pagination';
import Footer from '../components/Footer';
import {
    Card,
    CardContent,
    CardDescription,
    Button,
    ButtonGroup,
    CardHeader,
    Grid,
    GridColumn,
    List,
    ListItem,
} from 'semantic-ui-react';
import { getItems, updateItem, createItem } from '../api';
import { AuthContext } from '../utils/authContext';
import EditAuthorModal from '../components/EditAuthorModal';
import DeleteModal from '../components/DeleteModal';

import withRouter from '../utils/withRouter';

class Authors extends Component {
    static contextType = AuthContext;


    constructor(props) {
        super(props);
        this.state = {
          authors: [],
          currentPage: 1,
          itemsPerPage: 8,
          error: null,
          loading: true,
          isEditModalOpen: false,
          isDeleteModalOpen: false,
          currentAuthorToDelete: null,
          currentAuthorToEdit: null,
          isSaving: false,
          isAdding: false,
          bookLookup: {}
        };
    }

    fetchAuthors = async () => {
        try {
            const token = localStorage.getItem('token');
            const fetchedAuthors = await getItems('authors', token);
            const fetchedBooks = await getItems('books', token);
            
            const bookLookup = {};
            if (Array.isArray(fetchedBooks)) {
                fetchedBooks.forEach(book => {
                    bookLookup[book.id] = book;
                });
            }

            if (Array.isArray(fetchedAuthors)) {
                this.setState({
                    authors: fetchedAuthors,
                    loading: false,
                    bookLookup: bookLookup
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
                bookLookup: {}
            });
        }
    }

    handleInfoButton = (authorID) => {
        this.props.router.navigate(`/authors/${authorID}`);
    }

    handleOpenEditModal = (author) => {
        this.setState({
            isEditModalOpen: true,
            currentAuthorToEdit: author,
            isAdding: !author,
        });
    };

    handleCloseEditModal = () => {
        this.setState({
            isEditModalOpen: false,
            currentAuthorToEdit: null,
            isAdding: false
        });
    };

    handleAddAuthor = async (newAuthor) => {
        this.setState({ isSaving: true });
    
        const token = localStorage.getItem('token') || 'mock-token';
        
        try {
            const response = await createItem('authors', token, newAuthor);
            await this.fetchAuthors();
            this.setState(prevState => ({
                authors: prevState.authors.map(author => {
                    if (!author) return author; 
                    
                    console.log(response)
                    
                    return author.id === response.id ? response : author;
                }),
                isSaving: false,
                isEditModalOpen: false,
                currentBookToEdit: null,
                isAdding: false,
            }));
    
        } catch (error) {
            console.error("Failed to create author via API:", error);
            this.setState({ isSaving: false }); 
        }
    }

    handleSaveAuthorEdit = async (updatedAuthor) => {
        this.setState({ isSaving: true });
        
        const token = localStorage.getItem('token') || 'mock-token'; 
        const { id } = updatedAuthor;
        
        try {
            const response = await updateItem('authors', id, token, updatedAuthor);
            await this.fetchAuthors();
            this.setState(prevState => ({
                authors: prevState.authors.map(author => {
                    if (!author) return author; 
                    
                    console.log(response)
                    
                    return author.id === response.id ? response : author;
                }),
                isSaving: false,
                isEditModalOpen: false,
                currentAuthorToEdit: null,
                isAdding: false,
            }));

        } catch (error) {
            console.error("Failed to save author via API:", error);
            this.setState({ isSaving: false }); 
        }
    };

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
            currentAuthorToDelete: null,
        });
    };

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
        await this.fetchAuthors();
    }

    render() {
        const { authors, 
            error, 
            loading, 
            currentPage, 
            itemsPerPage,
            isEditModalOpen,
            currentAuthorToEdit,
            isDeleteModalOpen,
            currentAuthorToDelete, 
            isSaving,
            isAdding,
            bookLookup } = this.state;
        const { user } = this.context; 
        const isAdmin = user.role === 'admin'

        const indexOfLastAuthor = currentPage * itemsPerPage;
        const indexOfFirstAuthor = indexOfLastAuthor - itemsPerPage;
        const currentAuthors = authors.slice(indexOfFirstAuthor, indexOfLastAuthor);

        if (loading) {
            return (
                <React.Fragment>
                    <NavBar />
                    <Card style={{ margin: '50px' }}>
                      <CardContent>
                        <CardDescription>
                            Loading authors...
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
                <div>
                <NavBar />
                    <div style={{ margin: '55px' }}>
                        <h1>Author  List</h1>
                        {isAdmin && (
                            <Button color='teal' style={{ marginBottom: '10px' }} onClick={() => this.handleOpenEditModal()}>Add Author</Button>
                        )}
                        { authors.length > 0 ? (
                            <Grid columns={4}>
                                {currentAuthors.map(author => (
                                    <GridColumn key={author.id}>
                                        <Card>
                                            <CardContent>
                                                    <CardHeader>{author.full_name}</CardHeader>
                                                    <CardContent>
                                                        {author.books_written && author.books_written.length > 0 ? (
                                                        <List>
                                                            {author.books_written.map(bookId => {
                                                                const book = bookLookup[bookId]
                    
                                                                if (!book) {
                                                                    return <ListItem key={bookId} style={{ color: 'red' }}>Book ID {bookId} (Data Missing)</ListItem>;
                                                                }
                                                    
                                                                return (
                                                                    <ListItem style={{ margin: '2px'}} key={bookId} onClick={() => this.handleBookButton(bookId)}>
                                                                        {book.title} (Published at: {book.published_date})
                                                                    </ListItem>
                                                                )
                                                            })}
                                                        </List>
                                                    ) : (
                                                        <span>No data</span>
                                                    )}
                                                    </CardContent>
                                            </CardContent>
                                            <CardContent extra>
                                                <Button fluid onClick={() => this.handleInfoButton(author.id)}>View Info</Button>
                                            </CardContent>
                                            {isAdmin && (
                                                <CardContent extra>
                                                    <ButtonGroup fluid widths='1'>
                                                        <Button onClick={() => this.handleOpenEditModal(author)}>
                                                            Edit Author
                                                        </Button>
                                                        <Button onClick={() => this.handleOpenDeleteModal(author)}>
                                                            Delete Author
                                                        </Button>
                                                    </ButtonGroup>
                                                </CardContent>
                                            )}
                                        </Card>
                                        
                                    </GridColumn>
                                ))}
                            </Grid>
                            ) : (
                                <p>No authors found.</p>
                            )
                        }
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px', marginBottom: '40px' }}>
                            <Paginate
                                itemsPerPage={itemsPerPage}
                                totalItems={authors.length}
                                paginate={this.paginate}
                                currentPage={currentPage} 
                            />
                        </div>
                    </div>
                    {(isEditModalOpen) && (
                        <EditAuthorModal
                            currentAuthor={currentAuthorToEdit}
                            isOpen={isEditModalOpen}
                            onClose={this.handleCloseEditModal}
                            onSave={isAdding ? this.handleAddAuthor : this.handleSaveAuthorEdit}
                            isSaving={isSaving}
                            isAdding={isAdding}
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
                <Footer />
                </div>
            </React.Fragment>
        )
    }
   
}

export default withRouter(Authors);