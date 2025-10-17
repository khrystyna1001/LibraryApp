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
    CardHeader,
    Grid,
    GridColumn,
    List,
    ListItem
} from 'semantic-ui-react';
import { getItems, updateItem } from '../api';
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
          bookLookup: {}
        };
    }

    handleInfoButton = (authorID) => {
        this.props.router.navigate(`/authors/${authorID}`);
    }

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
                    <div style={{ margin: '55px', height: '40vh' }}>
                        <h1>Author  List</h1>
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
                                            <Button onClick={() => this.handleInfoButton(author.id)}>
                                                View Info
                                            </Button>
                                            <div className='two ui buttons'>
                                            {isAdmin && (<>
                                                <Button onClick={() => this.handleOpenEditModal(author)}>
                                                    Edit Author
                                                </Button>
                                                <Button onClick={() => this.handleOpenDeleteModal(author)}>
                                                    Delete Author
                                                </Button></>
                                            )}
                                            </div>
                                        </Card>
                                        
                                    </GridColumn>
                                ))}
                            </Grid>
                            ) : (
                                <p>No authors found.</p>
                            )
                        }
                        <Paginate
                            itemsPerPage={itemsPerPage}
                            totalItems={authors.length}
                            paginate={this.paginate}
                            currentPage={currentPage} 
                        />
                    </div>
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
                <Footer />
                </div>
            </React.Fragment>
        )
    }
   
}

export default withRouter(Authors);