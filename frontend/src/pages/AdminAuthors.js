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
    ListItem
 } from "semantic-ui-react";
 import { AuthContext } from "../utils/authContext";

class AdminAuthors extends Component {
    static contextType = AuthContext;

    constructor(props) {
        super(props);
        this.state = {
            authors: [],
            currentPage: 1,
            itemsPerPage: 8,
            error: null,
            loading: true,
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

    render() {
        const { authors, loading } = this.state;

        return (
            <div>
                <style jsx="true">{`
                    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap');
                    body { font-family: 'Inter', sans-serif; background-color: #f7f9fb; }
                `}</style>
                
                <NavBar /> 
                
                <div style={{ margin: '55px' }}>
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
                                    {authors.map(author => (
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
                                                <Button icon='trash'>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                )}
                </div>
            </div>
        )
    }
}

export default withRouter(AdminAuthors);