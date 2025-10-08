import React, { Component } from "react";
import { getItems } from "../api";
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
    Icon
  } from 'semantic-ui-react'
 import { AuthContext } from "../utils/authContext";

class AdminBooks extends Component {
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

    render() {
        const { books, loading } = this.state;

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
                                    {books.map(book => (
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
                                                <Button icon="edit">
                                                </Button>
                                                <Button icon="trash">
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

export default AdminBooks;