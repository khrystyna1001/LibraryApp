import React, { Component } from "react";
import { getItems } from "../api";
import NavBar from '../components/Navigation'
import withRouter from "../utils/withRouter";
import { MDBTable,
         MDBTableHead, 
         MDBTableBody,
         MDBCard,
         MDBCardBody,
         MDBCardTitle,
         MDBSpinner,
         MDBListGroup,
         MDBListGroupItem,
         MDBBtn,
         MDBIcon
 } from "mdb-react-ui-kit";
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
            <div className="min-h-screen">
                <style jsx="true">{`
                    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap');
                    body { font-family: 'Inter', sans-serif; background-color: #f7f9fb; }
                `}</style>
                
                <NavBar /> 
                
                <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
                {loading ? (
                    <MDBCard>
                      <MDBCardBody>
                        <MDBCardTitle className="flex items-center text-gray-500">
                            <MDBSpinner /> Loading authors...
                        </MDBCardTitle>
                      </MDBCardBody>
                    </MDBCard>
                ) : (
                    <div className="bg-white p-6 shadow-xl rounded-xl">
                        <div className="flex justify-between items-center border-b pb-2 mb-4">
                            <h2 className="text-xl font-semibold text-gray-700">({authors.length} authors)</h2>
                        </div>

                        <div className="overflow-x-auto rounded-lg border border-gray-200 rounded-9">
                            <MDBTable hover className="min-w-full divide-y divide-gray-200">
                                <MDBTableHead>
                                    <tr>
                                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</th>
                                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Books Written</th>
                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </MDBTableHead>
                                <MDBTableBody>
                                    {authors.map(author => (
                                        <tr key={author.id}>
                                            <td className="px-4 py-3 text-sm font-medium text-gray-900">{author.id}</td>
                                            <td className="px-4 py-3 text-sm font-semibold text-gray-900">{author.full_name}</td>
                                            <td className="px-4 py-3 text-sm text-gray-600">
                                            {author.books_written && author.books_written.length > 0 ? (
                                                <MDBListGroup light>
                                                    {author.books_written.map(book => (
                                                        <MDBListGroupItem key={book.id} onClick={() => this.handleBookButton(book.id)}>
                                                            {book.title} (Published at: {book.published_date})
                                                        </MDBListGroupItem>
                                                    ))}
                                                </MDBListGroup>
                                            ) : (
                                                <span>No data</span>
                                            )}
                                            </td>
                                            <td className="px-4 py-3 text-sm font-medium text-center">
                                            <MDBBtn className='bg-info'  onClick={() => this.handleAuthorButton(author.id)}>
                                                <MDBIcon fas icon="edit" />
                                            </MDBBtn>
                                            <MDBBtn className='bg-danger'>
                                                <MDBIcon fas icon="trash" />
                                            </MDBBtn>
                                            </td>
                                        </tr>
                                    ))}
                                </MDBTableBody>
                            </MDBTable>
                        </div>
                    </div>
                )}
                </div>
            </div>
        )
    }
}

export default withRouter(AdminAuthors);