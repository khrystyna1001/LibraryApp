import React, { Component } from "react";
import { getItems } from "../api";
import NavBar from '../components/Navigation'
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

class Admin extends Component {
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
                            <MDBSpinner /> Loading books...
                        </MDBCardTitle>
                      </MDBCardBody>
                    </MDBCard>
                ) : (
                    <div className="bg-white p-6 shadow-xl rounded-xl">
                        <div className="flex justify-between items-center border-b pb-2 mb-4">
                            <h2 className="text-xl font-semibold text-gray-700">Current Inventory ({books.length} books)</h2>
                        </div>

                        <div className="overflow-x-auto rounded-lg border border-gray-200">
                            <MDBTable hover className="min-w-full divide-y divide-gray-200">
                                <MDBTableHead>
                                    <tr>
                                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Availability</th>
                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </MDBTableHead>
                                <MDBTableBody>
                                    {books.map(book => (
                                        <tr key={book.id}>
                                            <td className="px-4 py-3 text-sm font-medium text-gray-900">{book.id}</td>
                                            <td className="px-4 py-3 text-sm font-semibold text-gray-900">{book.title}</td>
                                            <td className="px-4 py-3 text-sm text-gray-600">
                                            {Array.isArray(book.author) && book.author.length > 0 ? (
                                                <MDBListGroup light>
                                                    {book.author.map((authorObj, index) => (
                                                        <MDBListGroupItem key={authorObj.id}>
                                                            {authorObj.full_name || `${authorObj.first_name} ${authorObj.last_name}`}
                                                            {index < book.author.length - 1 ? ', ' : ''}
                                                        </MDBListGroupItem>
                                                    ))}
                                                </MDBListGroup>
                                            ) : (
                                                <span></span>
                                            )}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-600">{book.published_date}</td> 
                                            <td className="px-4 py-3 text-sm text-gray-600">{book.is_available ? "Available" : "Not Available"}</td>
                                            <td className="px-4 py-3 text-sm font-medium text-center">
                                            <MDBBtn className='bg-info'>
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

export default Admin;