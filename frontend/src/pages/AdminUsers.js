import React, { Component } from "react";
import { getItems, updateItem, createItem } from "../api";
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
          isAdding: false,
          tokenCreationLoading: {},
        };
    }

    generateTokenString = (length = 40) => {
        let newToken = '';
        const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
        
        for (let i = 0; i < length; i++) {
            const randomInd = Math.floor(Math.random() * characters.length);
            newToken += characters.charAt(randomInd);
        }
        return newToken;
    }

    fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const fetchedUsers = await getItems('users', token);

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

    fetchTokens = async () => {
        try {
            const token = localStorage.getItem('token');
            const fetchedTokens = await getItems('tokens', token);

            if (Array.isArray(fetchedTokens)) {
                this.setState({
                    tokens: fetchedTokens,
                    loading: false,
                });
            } else {
                console.error("API did not return an array for tokens:", fetchedTokens);
                this.setState({
                    error: new Error("Invalid data format received from API."),
                    loading: false,
                });
            }
        } catch (error) {
            console.error("Failed to fetch tokens:", error);
            this.setState({
                error: error,
                loading: false,
            });
        }
    }

    handleUserButton = (userID) => {
        this.props.router.navigate(`/users/${userID}`);
    }

    handleTokenFind = (tokens, user) => {
        const t = tokens.find(token => token.user === user.id)?.key
        return t;
    }

    handleCreateToken = async (user) => {
        const userId = user.id;

        this.setState(prevState => ({
            tokenCreationLoading: { ...prevState.tokenCreationLoading, [userId]: true }
        }));

        try {
            const token = localStorage.getItem('token') || 'mock-token';
            const tokenData = { key: this.generateTokenString(), user: userId, created: Date.now() }; 
            
            await createItem('tokens', token, tokenData);

            await this.fetchTokens(); 

            this.setState(prevState => {
                const newTokenLoading = { ...prevState.tokenCreationLoading };
                delete newTokenLoading[userId];
                return { tokenCreationLoading: newTokenLoading };
            });

        } catch (error) {
            console.error(`Failed to generate token for user ${userId}:`, error);
            this.setState(prevState => {
                const newTokenLoading = { ...prevState.tokenCreationLoading };
                delete newTokenLoading[userId];
                return { 
                    tokenCreationLoading: newTokenLoading,
                    error: new Error(`Failed to generate token for ${user.username}.`)
                };
            });
        }
    }

    handleOpenEditModal = (user) => {
        this.setState({
            isEditModalOpen: true,
            currentUserToEdit: user,
            isAdding: !user
        });
    };

    handleCloseEditModal = () => {
        this.setState({
            isEditModalOpen: false,
            currentUserToEdit: null,
            isAdding: false
        });
    };

    handleAddUser = async (newUser) => {
        this.setState({ isSaving: true });
        const token = localStorage.getItem('token') || 'mock-token';
        
        try {
            const response = await createItem('users', token, newUser);
            await Promise.all([this.fetchUsers(), this.fetchTokens()]);
            this.setState(prevState => ({
                users: prevState.users.map(user => {
                    if (!user) return user; 
                    
                    console.log(response)
                    
                    return user.id === response.id ? response : user;
                }),
                isSaving: false,
                isEditModalOpen: false,
                currentUserToEdit: null,
                isAdding: false,
            }));
    
        } catch (error) {
            console.error("Failed to create user via API:", error);
            this.setState({ isSaving: false }); 
        }
    }

    handleSaveUserEdit = async (updatedUser) => {
        this.setState({ isSaving: true });
        
        const token = localStorage.getItem('token') || 'mock-token'; 
        const { id } = updatedUser;
        
        try {
            await updateItem('users', id, token, updatedUser);
            await Promise.all([this.fetchUsers(), this.fetchTokens()]);
            this.setState(prevState => ({
                users: prevState.users.map(user => 
                    user.id === updatedUser.id ? updatedUser : user
                ),
                isSaving: false,
                isEditModalOpen: false,
                currentUserToEdit: null,
                isAdding: false
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

    handleDeleteUser = (deletedUserId) => {
        this.setState(prevState => ({
            users: prevState.users.filter(user => user.id !== deletedUserId),
            isDeleteModalOpen: false, 
            currentUserToDelete: null,
        }));
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
       await this.fetchUsers();
       await this.fetchTokens();
    }

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
            isSaving,
            isAdding,
            tokenCreationLoading
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
                            <Button color='teal' style={{ marginBottom: '10px', marginTop: '10px' }} onClick={() => this.handleOpenEditModal()}>
                                Add User
                            </Button>
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
                                    {currentUsers.map(user => {
                                        const userToken = this.handleTokenFind(tokens, user);
                                        const isCreating = tokenCreationLoading[user.id];
                                        return (
                                        <TableRow key={user.id}>
                                            <TableCell>{user.id}</TableCell>
                                            <TableCell>{user.username}</TableCell>
                                            <TableCell>{user.groups[0] ? user.groups[0] : 'Visitor'}</TableCell>
                                            <TableCell>
                                                {isCreating ? (
                                                        <span>Creating...</span>
                                                    ) : userToken ? (
                                                        <code style={{ fontSize: '0.8em' }}>{userToken}</code>
                                                    ) : (
                                                        <Button 
                                                            color='green' 
                                                            size='tiny' 
                                                            onClick={() => this.handleCreateToken(user)}
                                                        >
                                                            Generate Token
                                                        </Button>
                                                    )}
                                            </TableCell>
                                            <TableCell>
                                                <Button icon='edit' onClick={() => this.handleOpenEditModal(user)} />
                                                <Button icon='trash' onClick={() => this.handleOpenDeleteModal(user)} />
                                            </TableCell>
                                        </TableRow>
                                        )
                                    })}
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
                
                {(isEditModalOpen) && (
                    <UserEditModal 
                        currentUser={currentUserToEdit}
                        isOpen={isEditModalOpen}
                        onClose={this.handleCloseEditModal}
                        onSave={isAdding ? this.handleAddUser : this.handleSaveUserEdit}
                        isSaving={isSaving}
                        isAdding={isAdding}
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