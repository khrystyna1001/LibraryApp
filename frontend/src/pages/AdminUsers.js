import React, { Component } from "react";
import { getItems } from "../api";
import NavBar from '../components/Navigation'
import withRouter from "../utils/withRouter";
import { Table,
    TableRow,
    TableHeaderCell,
    TableHeader,
    TableCell,
    TableBody,
    Button, 
    Card,
    CardContent,
    CardDescription
 } from "semantic-ui-react";
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
            <div>
                <style jsx="true">{`
                    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap');
                    body { font-family: 'Inter', sans-serif; background-color: #f7f9fb; }
                `}</style>
                
                <NavBar /> 
                
                <div>
                {loading ? (
                    <Card>
                    <CardContent>
                      <CardDescription>
                          Loading users...
                      </CardDescription>
                    </CardContent>
                  </Card>
                ) : (
                    <div>
                        <div>
                            <h2>({users.length} users)</h2>
                        </div>

                        <div>
                            <Table celled>
                                <TableHeader>
                                    <TableRow>
                                        <TableHeaderCell>ID</TableHeaderCell>
                                        <TableHeaderCell>Username</TableHeaderCell>
                                        <TableHeaderCell>Group</TableHeaderCell>
                                        <TableHeaderCell>Actions</TableHeaderCell>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.map(user => (
                                        <TableRow key={user.id}>
                                            <TableCell>{user.id}</TableCell>
                                            <TableCell>{user.username}</TableCell>
                                            <TableCell>{user.groups[0] ? user.groups[0] : 'Visitor'}</TableCell>
                                            <TableCell>
                                                <Button onClick={() => this.handleUserButton(user.id)}>
                                                </Button>
                                                <Button>
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

export default withRouter(AdminUsers);