import React, { Component } from 'react';
import NavBar from '../components/Navigation';
import Footer from '../components/Footer';

import { 
    Card,
    CardContent,
    Button,
    CardDescription,
    FormInput,
    Dropdown,
    DropdownMenu,
    Input,
    DropdownItem,
} from 'semantic-ui-react'

import withRouter from '../utils/withRouter';
import { getItem, updateItem } from '../api';
import { AuthContext } from '../utils/authContext';


class User extends Component {
    static contextType = AuthContext;

    constructor(props) {
        super(props);
        this.state = {
          viewedUser: {}, 
          error: null,
          loading: true,
          isUpdating: false,
          statusMessage: null,
        };
        this.handleBookListButton = this.handleBookListButton.bind(this);
        this.handleAuthorListButton = this.handleAuthorListButton.bind(this);
        this.handleEditButton = this.handleEditButton.bind(this);
        this.handleDeleteButton = this.handleDeleteButton.bind(this);
        this.handleUpdateButton = this.handleUpdateButton.bind(this);
    }
    
    handleBookListButton() {
        this.props.router.navigate("/books/");
    }

    handleAuthorListButton() {
        this.props.router.navigate("/authors/");
    }
    
    handleEditButton() {
        console.log('Edit User placeholder clicked. Use Update Profile button.');
    }

    handleDeleteButton() {
        console.log('Delete User clicked (Admin Action)');
    }

    async componentDidMount() {
        const { user: currentUser } = this.context;
        
        if (!currentUser.isAuthenticated) {
             console.log("Not authenticated, skipping user detail fetch.");
             this.setState({ loading: false });
             return;
        }

        try {
            const token = localStorage.getItem('token');
            const { userID } = this.props.router.params;

            const fetchedUser = await getItem('user', userID, token);
            console.log("Fetched user details:", fetchedUser);

            if (typeof fetchedUser === 'object' && fetchedUser !== null && !Array.isArray(fetchedUser)) {
                this.setState({
                    viewedUser: fetchedUser,
                    loading: false,
                });
            } else {
                console.error("API did not return a user:", fetchedUser);
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

    handleUserOnChange = (e) => {
        this.setState({ 
            viewedUser: {
                ...this.state.viewedUser,
                username: e.target.value 
            }
        });
    }

    handleRoleOnChange = (role) => {
        this.setState({ 
            viewedUser: {
                ...this.state.viewedUser,
                groups: [role.toLowerCase()],
            }
        });
    }

    handleUpdateButton = async (e) => {
        e.preventDefault();

        const { viewedUser } = this.state;

        this.setState({ isUpdating: true, statusMessage: null });

        if (!viewedUser.username || viewedUser.username.trim() === "") {
            console.error("Username cannot be empty. Please enter a value.");
            this.setState({ statusMessage: { type: 'error', text: 'Username cannot be empty.' }, isUpdating: false });
            return; 
        }

        if (!viewedUser.id) {
            console.error("User ID not found. Cannot update.");
            this.setState({ statusMessage: { type: 'error', text: 'User ID not found. Cannot update.' }, isUpdating: false });
            return;
        }

        try {
            const token = localStorage.getItem('token') || 'mock_token_123';
            const user_password = null; 
            
            const currentRole = viewedUser.groups && viewedUser.groups.length > 0 ? viewedUser.groups[0] : 'visitor';
            
            const roleToSend = currentRole.charAt(0).toUpperCase() + currentRole.slice(1);

            const dataToSend = {
                username: viewedUser.username, 
                role: roleToSend, 
                password: user_password
            }
            
            const response = await updateItem(
                "users", 
                viewedUser.id, 
                token, 
                dataToSend
            );

            if (response.status === 200) {
                console.log("Updated user data successfully:", response);
                this.setState({ statusMessage: { type: 'success', text: response.message } });
            } else {
                console.log("No response. Failed to update");
                this.setState({ statusMessage: { type: 'error', text: 'Update failed or no response.' } });
            }
        } catch (e) {
            console.error("Failed to update user data:", e.response ? e.response.data : e);
            this.setState({ statusMessage: { type: 'error', text: `Error updating: ${e.message || 'Unknown error'}` } });
        } finally {
             this.setState({ isUpdating: false });
        }
    }
    render() {

        const { viewedUser, error, loading, isUpdating, statusMessage } = this.state;
        const { user: currentUser } = this.context; 
        const isAdmin = currentUser.role === 'admin';
        const roles = ['Visitor', 'Librarian', 'Admin'];

        
        const currentRoleString = viewedUser.groups && viewedUser.groups.length > 0 
            ? viewedUser.groups[0]
            : 'visitor';

        const userRoleDisplay = currentRoleString.charAt(0).toUpperCase() + currentRoleString.slice(1);

        if (loading) {
            return (
                <React.Fragment>
                    <NavBar />
                    <Card style={{ margin: '50px' }}>
                      <CardContent>
                        <CardDescription>
                            Loading user info...
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
                    <Card style={{ margin: '50px' }}>
                      <CardContent>
                        <CardDescription>Error: {error.message}</CardDescription>
                        <Button onClick={this.handleAuthorListButton}>Go back to user list</Button>
                      </CardContent>
                    </Card>
                </React.Fragment>
            );
        }
        
        return (
            <React.Fragment>
                <NavBar />
                <form> 
                    <h1>User Profile Management</h1>

                    {statusMessage && (
                        <div>
                            {statusMessage.text}
                        </div>
                    )}
                    
                    <FormInput 
                        label='ID' 
                        value={viewedUser.id || 'N/A'} 
                        disabled={true}
                        type='text'
                    />

                    <FormInput
                        label='Username' 
                        type='text'
                        onChange={this.handleUserOnChange} 
                        value={viewedUser.username || ''} 
                        disabled={!isAdmin} 
                    />
                    

                    <Input>
                        <FormInput type='text'
                            label='Role (Group)'
                            value={userRoleDisplay} 
                            disabled={true} 
                        />
                        <Dropdown
                                disabled={!isAdmin}
                                type='button'
                            > {isAdmin ? 'Change Role' : 'Locked'}
                                
                            <DropdownMenu>
                                {roles.map(role => (
                                    <DropdownItem
                                        link
                                        key={role}
                                        onClick={() => this.handleRoleOnChange(role)}
                                    >
                                        {role}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                    </Input>

                    <Button type='submit' onClick={this.handleUpdateButton} block disabled={!isAdmin || isUpdating}
                    >
                        {isUpdating ? (
                            'Updating...'
                        ) : (
                            <>
                                Update Profile
                            </>
                        )}
                    </Button>
                    <Button type='submit'>
                        Go to Books
                    </Button>

                    <Button type='submit'>
                        Go to Authors
                    </Button>

                    {/* Admin Delete Action */}
                    {isAdmin && (
                        <Button type='submit'> 
                            Delete User
                        </Button>
                    )}
                </form>
                
                <Footer />

            </React.Fragment>
        )
    }
}

export default withRouter(User);