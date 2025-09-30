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
         MDBBtn,
         MDBIcon
 } from "mdb-react-ui-kit";
 import { AuthContext } from "../utils/authContext";

class AdminUsers extends Component {
    static contextType = AuthContext;

    constructor(props) {
        super(props);
        this.state = {
          users: [],
          currentPage: 1,
          itemsPerPage: 8,
          error: null,
          loading: true,
        };
    }

    handleUserButton = (userID) => {
        this.props.router.navigate(`/user/${userID}`);
    }

    async componentDidMount() {
        const { user } = this.context;

        if (!user.isAuthenticated) {
            this.setState({ loading: false });
            return;
       }

        try {
            const token = localStorage.getItem('token') || 'mock-token'; 
            
            const fetchedUsers = await getItems('user', token)

            if (Array.isArray(fetchedUsers)) {
                this.setState({
                users: fetchedUsers,
                loading: false,
            });
            } else {
                console.error("API did not return an array for users:", fetchedUsers);
                this.setState({
                    error: new Error("Invalid data format received from API."),
                    loading: false,
                });
            }

        } catch (error) {
            console.error("Failed to fetch users:", error);
            this.setState({
                error: error,
                loading: false,
            });
        }
    }

    render() {
        const { users, loading } = this.state;
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
                            <MDBSpinner /> Loading users...
                        </MDBCardTitle>
                      </MDBCardBody>
                    </MDBCard>
                ) : (
                    <div className="bg-white p-6 shadow-xl rounded-xl">
                        <div className="flex justify-between items-center border-b pb-2 mb-4">
                            <h2 className="text-xl font-semibold text-gray-700">({users.length} users)</h2>
                        </div>

                        <div className="overflow-x-auto rounded-lg border border-gray-200 rounded-9">
                            <MDBTable hover className="min-w-full divide-y divide-gray-200">
                                <MDBTableHead>
                                    <tr>
                                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Group</th>
                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </MDBTableHead>
                                <MDBTableBody>
                                    {users.map(user => (
                                        <tr key={user.id}>
                                            <td className="px-4 py-3 text-sm font-medium text-gray-900">{user.id}</td>
                                            <td className="px-4 py-3 text-sm font-semibold text-gray-900">{user.username}</td>
                                            <td className="px-4 py-3 text-sm text-gray-600">{user.groups[0] ? user.groups[0] : 'Visitor'}</td>
                                            <td className="px-4 py-3 text-sm font-medium text-center">
                                            <MDBBtn className='bg-info' onClick={() => this.handleUserButton(user.id)}>
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

export default withRouter(AdminUsers);