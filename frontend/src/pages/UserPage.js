import React, { Component } from 'react';
import NavBar from '../components/Navigation';
import { updateItem } from '../api';
import { AuthContext } from '../utils/authContext';
import Footer from '../components/Footer';
import '../App.css'

import { 
    Button,
    Form,
    Dropdown,
    Message,
    Grid
} from 'semantic-ui-react'

class UserPage extends Component {

    static contextType = AuthContext;

    state = {
        localUsername: '',
        localRole: '',
        localId: null,
        isUpdating: false,
        statusMessage: null,
    };


    componentDidMount() {
        this.syncStateWithProps(this.context.user);
        console.log(this.context.user)
    }
    
    componentDidUpdate(prevProps, prevState) {
        const currentUser = this.context.user;
        if (currentUser.id !== prevState.localId) { 
            this.syncStateWithProps(currentUser);
        }
    }

    syncStateWithProps = (user) => {
        this.setState({
            localUsername: user.username,
            localRole: user.role,
            localId: user.id,
        });
    }

    handleUserOnChange = (e) => {
        this.setState({ localUsername: e.target.value });
    }

    handleRoleOnChange = (role) => {
        this.setState({ localRole: role.toUpperCase() });
    }

    handleUpdateButton = async (e) => {
        e.preventDefault();
        
        const { localUsername, localRole, localId } = this.state;

        this.setState({ isUpdating: true, statusMessage: null });

        if (!localUsername || localUsername.trim() === "") {
            console.error("Username cannot be empty. Please enter a value.");
            this.setState({ 
                statusMessage: { type: 'error', text: 'Username cannot be empty.' },
                isUpdating: false,
            });
            return; 
        }

        if (!localId) {
            console.error("User ID not found. Cannot update.");
            this.setState({ 
                statusMessage: { type: 'error', text: 'User ID not found. Cannot update.' },
                isUpdating: false,
            });
            return;
        }

        try {
            const token = localStorage.getItem('token') || 'mock_token_123';
            
            const updatedUser = {
                username: localUsername,
                groups: [localRole.toLocaleLowerCase()],
            }
            
            const response = await updateItem(
                "users", 
                localId, 
                token, 
                updatedUser
            );

            if (response) {
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
        const { localUsername, localRole, isUpdating, statusMessage, error } = this.state;
        const { user } = this.context;
        const userRoleDisplay = localRole.charAt(0).toUpperCase() + localRole.slice(1);
        const isAdmin = user.role === "admin"; 
        const roles = ['Visitor', 'Librarian', 'Admin'];

        if (!user) {
            return <p>Loading user data...</p>;
        }
        
        return (
            <React.Fragment>
                <NavBar />
                <Grid centered columns={1} style={{ padding: '50px' }}>
                <Grid.Column style={{ maxWidth: 500 }}>
                <Form onSubmit={this.handleUpdateButton} loading={isUpdating}> 
                    <h1>User Profile Management</h1>


                    {statusMessage && (
                        <Message 
                            size='small'
                            {...(statusMessage.type === error ? { negative: true } : { positive: true })}
                            header={statusMessage.type === error ? 'Error' : 'Success'}
                            content={statusMessage.text}
                        />
                    )}
                    
                    <Form.Input 
                        label='ID' 
                        value={user.id || 'N/A'} 
                        disabled={true}
                        type='text'
                    />

                    <Form.Input
                        error={{ content: 'Username can not be empty', pointing: 'below' }}
                        label='Username' 
                        type='text'
                        onChange={this.handleUserOnChange} 
                        value={localUsername || ''} 
                        disabled={!isAdmin} 
                    />
                    
                    
                    <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-end' }}>
                        <Form.Input
                            error={{ content: 'Role can not be empty', pointing: 'below' }}
                            style={{ flex: 1 }}
                            label='Role (Current Group)'
                            value={userRoleDisplay} 
                            disabled={true} 
                        />
                        
                        <Form.Field style={{ flexShrink: 0, paddingBottom: '14px' }}>
                            <label>Change Role</label>
                            <Dropdown
                                placeholder={isAdmin ? 'Select Role' : 'Role Locked'}
                                disabled={!isAdmin}
                                button
                            >
                                <Dropdown.Menu>
                                    {roles.map(role => (
                                        <Dropdown.Item
                                            key={role}
                                            onClick={() => this.handleRoleOnChange(role)}
                                            active={localRole.toLowerCase() === role.toLowerCase()}
                                        >
                                            {role}
                                        </Dropdown.Item>
                                    ))}
                                </Dropdown.Menu>
                            </Dropdown>
                        </Form.Field>
                    </div>

                    <Button type='submit' primary fluid disabled={!isAdmin || isUpdating} style={{ marginTop: '20px' }}>
                        {isUpdating ? 'Updating...' : 'Update Profile'}
                    </Button>
                </Form>
                </Grid.Column>
                </Grid>

                <Footer />
            </React.Fragment>
        )
    }
}

export default UserPage;