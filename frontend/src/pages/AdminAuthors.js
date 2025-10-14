import React, { Component } from "react";
import { getItems } from "../api";
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
            isDeleteModalOpen: false,
            currentAuthorToDelete: null,
        };
    }

    handleBookButton = (bookID) => {
        this.props.router.navigate(`/books/${bookID}`);
    }

    handleAuthorButton = (authorId) => {
        this.props.router.navigate(`/authors/${authorId}`);
    }

    async componentDidMount() {
        const { user } = this.context;
        
        if (!user.isAuthenticated) {
             this.setState({ loading: false });
             return;
        }
        
        try {

            const token = localStorage.getItem('token');
            const fetchedAuthors = await getItems('authors', token);

            if (Array.isArray(fetchedAuthors)) {
                this.setState({
                authors: fetchedAuthors,
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
            isDeleteModalOpen,
            currentAuthorToDelete, 
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
                                                    {author.books_written.map(book => (
                                                        <ListItem key={book.id} onClick={() => this.handleBookButton(book.id)}>
                                                            {book.title} (Published at: {book.published_date})
                                                        </ListItem>
                                                    ))}
                                                </List>
                                            ) : (
                                                <span>No data</span>
                                            )}
                                            </TableCell>
                                            <TableCell>
                                                <Button icon='edit'>
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