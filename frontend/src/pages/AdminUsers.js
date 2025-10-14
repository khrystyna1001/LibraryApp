import React, { Component } from "react";
import { getItems, updateItem } from "../api";
import NavBar from '../components/Navigation'
import withRouter from "../utils/withRouter";
import UserEditModal from "../components/EditUserModal";
import { Table,
    TableRow,
    TableHeaderCell,
    TableHeader,
    TableCell,
    TableBody,
    Button, 
    Card,
    CardContent,
    CardDescription,
    Message
 } from "semantic-ui-react";
 import { AuthContext } from "../utils/authContext";
import DeleteModal from "../components/DeleteModal";
import Paginate from "../components/Pagination";

class AdminUsers extends Component {
    static contextType = AuthContext;

    constructor(props) {
        super(props);
        this.state = {
          users: [],
          tokens: [],
          currentPage: 1,
          itemsPerPage: 10,
          error: null,
          loading: true,
          isEditModalOpen: false,
          isDeleteModalOpen: false,
          currentUserToEdit: null,
          currentUserToDelete: null,
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
            isEditModalOpen: true,
            currentUserToEdit: user,
        });
    };

    handleCloseModal = () => {
        this.setState({
            isEditModalOpen: false,
            currentUserToEdit: null,
        });
    };

    handleSaveUserEdit = async (updatedUser) => {
        this.setState({ isSaving: true });
        
        const token = localStorage.getItem('token') || 'mock-token'; 
        const { id } = updatedUser;
        
        try {
            await updateItem('users', id, token, updatedUser);

            this.setState(prevState => ({
                users: prevState.users.map(user => 
                    user.id === updatedUser.id ? updatedUser : user
                ),
                isSaving: false,
                isEditModalOpen: false,
                currentUserToEdit: null,
            }));

        } catch (error) {
            console.error("Failed to save user via API:", error);
            this.setState({ isSaving: false }); 
        }
    };

    handleOpenDeleteModal = (user) => {
        this.setState({
            isDeleteModalOpen: true,
            currentUserToDelete: user,
        });
    };

    handleCloseDeleteModal = () => {
        this.setState({
            isDeleteModalOpen: false,
            currentUserToDelete: null,
        });
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

    handleDeleteUser = (deletedUserId) => {
        this.setState(prevState => ({
            users: prevState.users.filter(user => user.id !== deletedUserId),
            isDeleteModalOpen: false, 
            currentUserToDelete: null,
        }));
    };

    render() {
        const { users, 
            loading, 
            error, 
            currentPage, 
            itemsPerPage, 
            tokens,
            isEditModalOpen,
            isDeleteModalOpen, 
            currentUserToEdit,
            currentUserToDelete, 
            isSaving  
        } = this.state;

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const currentUsers = users.slice(startIndex, endIndex);

        return (
            <div>
                <style jsx="true">{`
                    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap');
                    body { font-family: 'Inter', sans-serif; background-color: #f7f9fb; }
                `}</style>
                
                <NavBar /> 
                
                <div style={{ margin: '55px' }}>
                {error && (
                    <Message 
                        negative
                        icon='warning sign'
                        header='Data Loading Error'
                        content={error.message || 'An unknown error occurred while fetching data.'}
                        onDismiss={() => this.setState({ error: null })}
                    />
                )}

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
                                    {currentUsers.map(user => (
                                        <TableRow key={user.id}>
                                            <TableCell>{user.id}</TableCell>
                                            <TableCell>{user.username}</TableCell>
                                            <TableCell>{user.groups[0] ? user.groups[0] : 'Visitor'}</TableCell>
                                            <TableCell>
                                                {this.handleTokenFind(tokens, user)}</TableCell>
                                            <TableCell>
                                                <Button icon='edit' onClick={() => this.handleEditUser(user)} />
                                                <Button icon='trash' onClick={() => this.handleOpenDeleteModal(user)} />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                            <Paginate
                                itemsPerPage={itemsPerPage}
                                totalItems={users.length}
                                paginate={this.paginate}
                                currentPage={currentPage}
                            />
                        </div>
                    </div>
                )}
                
                {currentUserToEdit && (
                    <UserEditModal 
                        currentUser={currentUserToEdit}
                        isOpen={isEditModalOpen}
                        onClose={this.handleCloseModal}
                        onSave={this.handleSaveUserEdit}
                        isSaving={isSaving}
                    />
                )}
                {currentUserToDelete && (
                    <DeleteModal 
                        item={currentUserToDelete}
                        itemName={currentUserToDelete.username}
                        apiItemName={'users'}
                        isOpen={isDeleteModalOpen}
                        onClose={this.handleCloseDeleteModal}
                        onDelete={this.handleDeleteUser}
                    />
                )}
                </div>
            </div>
        )
    }
}

export default withRouter(AdminUsers);