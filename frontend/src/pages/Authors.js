import React, { Component } from 'react';
import NavBar from '../components/Navigation';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import axios from 'axios';

import withRouter from '../utils/withRouter';

class Authors extends Component {
    constructor(props) {
        super(props);
        this.state = {
          authors: [],
          error: null,
          loading: true,
        };
    }

    handleInfoButton = (authorID) => {
        this.props.router.navigate(`/authors/${authorID}`);
    }

    async componentDidMount() {
        try {

            const requestHeaders = {
                "Content-Type": "application/json",
                "Authorization": "Token b0ddff958c343d0efa8941aa634d83333c35790e"
            }

            const response = await axios.get('http://localhost:8000/authors/', {
                headers: requestHeaders
            });
            const fetchedAuthors = response.data;

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
        const {  authors, error, loading } = this.state;

        if (loading) {
            return (
                <React.Fragment>
                    <NavBar />
                    <Card body className='m-3 mx-5 px-3'>
                        Loading authors...
                    </Card>
                </React.Fragment>
            );
        }

        if (error) {
            return (
                <React.Fragment>
                    <NavBar />
                    <Card body className='m-3 mx-5 px-3'>
                        Error: {error.message}
                    </Card>
                </React.Fragment>
            );
        }
         return (
            <React.Fragment>
                <NavBar />
                <Card body className='m-3 mx-5 px-3'>
                
                <h1 style={{ margin: '20px' }}>Author  List</h1>
                { authors.length > 0 ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                        {authors.map(author => (
                            <Card key={author.id} body className='m-3' style={{ width: '18rem' }}>
                                <Card.Body>
                                        <Card.Title>{author.full_name}</Card.Title>
                                </Card.Body>
                                <Button className='primary' onClick={() => this.handleInfoButton(author.id)}>View Info</Button>
                            </Card>
                        ))}
                    </div>
                    ) : (
                        <p>No authors found.</p>
                    )
                    }
                </Card>
            </React.Fragment>
        )
    }
   
}

export default withRouter(Authors);