import '../App.css'
import React, { Component } from 'react';
import NavBar from '../components/Navigation';
import Pagination from '../components/Pagination';
import Footer from '../components/Footer';
import { 
    MDBCard,
    MDBCardBody,
    MDBCardTitle,
    MDBBtn,
    MDBRow,
    MDBCol,
} 
from 'mdb-react-ui-kit';
import { getItems } from '../api';

import withRouter from '../utils/withRouter';

class Authors extends Component {
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
        try {

            const token = localStorage.getItem('token');
            const fetchedAuthors = await getItems('author', token);

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
        const {  authors, error, loading, currentPage, itemsPerPage } = this.state;

        const indexOfLastAuthor = currentPage * itemsPerPage;
        const indexOfFirstAuthor = indexOfLastAuthor - itemsPerPage;
        const currentAuthors = authors.slice(indexOfFirstAuthor, indexOfLastAuthor);

        if (loading) {
            return (
                <React.Fragment>
                    <NavBar />
                    <MDBCard>
                      <MDBCardBody>
                        <MDBCardTitle>Loading authors...</MDBCardTitle>
                      </MDBCardBody>
                    </MDBCard>
                </React.Fragment>
            );
        }

        if (error) {
            return (
                <React.Fragment>
                    <NavBar />
                    <MDBCard>
                      <MDBCardBody>
                        <MDBCardTitle>Error: {error.message}</MDBCardTitle>
                      </MDBCardBody>
                    </MDBCard>
                </React.Fragment>
            );
        }
         return (
            <React.Fragment>
                <div className="main-container">
                <NavBar />
                    <div className="list-container">
                        <h1 className="header-text">Author  List</h1>
                        { authors.length > 0 ? (
                            <MDBRow className='row-cols-1 row-cols-md-2 row-cols-lg-4 g-4'>
                                {currentAuthors.map(author => (
                                    <MDBCol key={author.id} className='mb-4'>
                                        <MDBCard className='h-100'>
                                            <MDBCardBody>
                                                    <MDBCardTitle>{author.full_name}</MDBCardTitle>
                                            </MDBCardBody>
                                            <MDBBtn className='primary' onClick={() => this.handleInfoButton(author.id)}>View Info</MDBBtn>
                                        </MDBCard>
                                    </MDBCol>
                                ))}
                            </MDBRow>
                            ) : (
                                <p>No authors found.</p>
                            )
                        }
                        <Pagination
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