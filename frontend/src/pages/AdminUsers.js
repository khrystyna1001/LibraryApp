import React, { Component } from "react";
import { getItems, updateItem } from "../api";
import NavBar from '../components/Navigation'
import withRouter from "../utils/withRouter";
import UserEditModal from "../components/EditModal";
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
          tokens: [],
          currentPage: 1,
          itemsPerPage: 8,
          error: null,
          loading: true,
          isModalOpen: false,
          currentUserToEdit: null,
          isSaving: false,
        };
    }

    handleUserButton = (userID) => {
        this.props.router.navigate(`/user/${userID}`);
    }

    handleTokenFind = (tokens, user) => {
        const t = tokens.find(token => token.user === user.id)?.key
        return t;
    }

    handleEditUser = (user) => {
        this.setState({
            isModalOpen: true,
            currentUserToEdit: user,
        });
    };

    handleCloseModal = () => {
        this.setState({
            isModalOpen: false,
            currentUserToEdit: null,
        });
    };

    handleSaveUserEdit = async (updatedUser) => {
        this.setState({ isSaving: true });
        
        const token = localStorage.getItem('token') || 'mock-token'; 
        const { id, username, groups } = updatedUser;
        const user_role = groups[0];
        const user_password = null;
        
        try {
            await updateItem('users', id, token, username, user_role, user_password);

            this.setState(prevState => ({
                users: prevState.users.map(user => 
                    user.id === updatedUser.id ? updatedUser : user
                ),
                isSaving: false,
                isModalOpen: false,
                currentUserToEdit: null,
            }));

        } catch (error) {
            console.error("Failed to save user via API:", error);
            this.setState({ isSaving: false }); 
        }
    };

    paginate = (pageNumber) => {
        this.setState({ currentPage: pageNumber });
    }

    async componentDidMount() {
        const { user } = this.context;

        if (!user.isAuthenticated) {
            this.setState({ loading: false });
            return;
       }

        try {
            const token = localStorage.getItem('token') || 'mock-token'; 
            
            const fetchedUsers = await getItems('users', token);
            const fetchedTokens = await getItems('tokens', token);

            if (Array.isArray(fetchedUsers)) {
                this.setState({
                users: fetchedUsers,
                tokens: fetchedTokens,
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
        const { users, 
            loading, 
            error, 
            currentPage, 
            itemsPerPage, 
            tokens,
            isModalOpen, 
            currentUserToEdit, 
            isSaving  
        } = this.state;
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
                                        <TableHeaderCell>Token</TableHeaderCell>
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
                                                {this.handleTokenFind(tokens, user)}</TableCell>
                                            <TableCell>
                                                <Button icon='edit' onClick={() => this.handleEditUser(user)} />
                                                <Button icon='trash' />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                        {/* PAGINATION */}
                    </div>
                )}
                
                {currentUserToEdit && (
                    <UserEditModal 
                        currentUser={currentUserToEdit}
                        isOpen={isModalOpen}
                        onClose={this.handleCloseModal}
                        onSave={this.handleSaveUserEdit}
                        isSaving={isSaving}
                    />
                )}
                </div>
            </div>
        )
    }
}

export default withRouter(AdminUsers);