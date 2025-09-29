import React, { Component } from 'react';
import NavBar from '../components/Navigation';
import { updateItem } from '../api';
import { AuthContext } from '../utils/authContext';
import '../App.css'

import {
    MDBBtn,
    MDBInput,
    MDBInputGroup,
    MDBDropdown,
    MDBDropdownToggle, 
    MDBDropdownMenu, 
    MDBDropdownItem
} from 'mdb-react-ui-kit'

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
            const user_password = null; 
            
            const roleToSend = localRole.charAt(0).toUpperCase() + localRole.slice(1);
            
            const response = await updateItem(
                "user", 
                localId, 
                token, 
                localUsername, 
                roleToSend, 
                user_password
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
        const { localUsername, localRole, isUpdating, statusMessage, localId } = this.state;
        const { user } = this.context;
        const userRoleDisplay = localRole.charAt(0).toUpperCase() + localRole.slice(1); 
        const isAuthenticated = user.isAuthenticated;
        const isAdmin = user.role === "admin"; 
        const roles = ['Visitor', 'Librarian', 'Admin'];

        return (
            <React.Fragment>
                <NavBar />

                <form className='form-container'> 
                    <h1 className='header-text'>User Profile</h1>

                    {statusMessage && (
                        <div className={`p-3 rounded-lg font-medium text-sm 
                        ${statusMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {statusMessage.text}
                        </div>
                    )}

                    <MDBInput 
                        className='my-4' 
                        label='ID' 
                        value={localId || 'N/A'} 
                        disabled={!isAdmin}
                        type='number'
                    />

                    <MDBInput 
                        className='my-4' 
                        label='Username' 
                        type='text'
                        onChange={this.handleUserOnChange} 
                        value={localUsername} 
                        disabled={!isAuthenticated} 
                    />
                    

                    <MDBInputGroup className='mb-3'>
                        <MDBInput className='form-control' type='text'
                            label='Role (Group)'
                            value={userRoleDisplay} 
                            disabled
                        />
                        <MDBDropdown>
                            <MDBDropdownToggle 
                                disabled={!isAuthenticated || !isAdmin}
                                type='button'
                                className='h-100'
                            > {isAdmin ? 'Change Role' : 'Locked'}
                            </MDBDropdownToggle>
                                
                            <MDBDropdownMenu>
                                {roles.map(role => (
                                    <MDBDropdownItem 
                                        link
                                        key={role}
                                        disabled={!isAdmin} 
                                        onClick={() => this.handleRoleOnChange(role)}
                                    >
                                        {role}
                                    </MDBDropdownItem>
                                ))}
                            </MDBDropdownMenu>
                        </MDBDropdown>
                    </MDBInputGroup>

                    <MDBBtn type='submit' onClick={this.handleUpdateButton} block
                    disabled={!isAuthenticated || isUpdating}
                    >
                        {isUpdating ? (
                            'Updating...'
                        ) : (
                            <>
                                Update Profile
                            </>
                        )}
                    </MDBBtn>
                </form>
            </React.Fragment>
        )
    }
}

export default UserPage;