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
    GridColumn
} from 'semantic-ui-react';
import { getItems } from '../api';
import { AuthContext } from '../utils/authContext';

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
        };
    }

    handleInfoButton = (authorID) => {
        this.props.router.navigate(`/authors/${authorID}`);
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
            const fetchedAuthors = await getItems('authors', token);

            if (typeof fetchedAuthors === 'object' && fetchedAuthors !== null) {
                this.setState({
                    authors: fetchedAuthors,
                    loading: false,
                });
            } else {
                console.error("API did not return any authors:", fetchedAuthors);
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
        const {  authors, error, loading, currentPage, itemsPerPage } = this.state;
        const { user } = this.context; 
        const isAdmin = user.role === 'admin'

        const indexOfLastAuthor = currentPage * itemsPerPage;
        const indexOfFirstAuthor = indexOfLastAuthor - itemsPerPage;
        const currentAuthors = authors.slice(indexOfFirstAuthor, indexOfLastAuthor);

        if (loading) {
            return (
                <React.Fragment>
                    <NavBar />
                    <Card>
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
                    <Card>
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
                    <div style={{ margin: '55px', height: '20vh' }}>
                        <h1>Author  List</h1>
                        { authors.length > 0 ? (
                            <Grid columns={4}>
                                {currentAuthors.map(author => (
                                    <GridColumn key={author.id}>
                                        <Card>
                                            <CardContent>
                                                    <CardHeader>{author.full_name}</CardHeader>
                                            </CardContent>
                                            <Button onClick={() => this.handleInfoButton(author.id)}>
                                                View Info
                                            </Button>
                                            <div className='two ui buttons'>
                                            {isAdmin && (<>
                                                <Button onClick={() => this.handleEditButton(author.id)}>
                                                    Edit Author
                                                </Button>
                                                <Button onClick={() => this.handleDeleteButton(author.id)}>
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
                <Footer />
                </div>
            </React.Fragment>
        )
    }
   
}

export default withRouter(Authors);