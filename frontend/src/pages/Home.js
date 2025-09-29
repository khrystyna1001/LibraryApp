import React, { Component } from 'react';
import NavBar from '../components/Navigation';
import { getUserData, updateItem  } from '../api';
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

class Home extends Component {

    state = {
        user: {
            id: null,
            username: "",
            groups: [],
        },
        isAdmin: false, 
    };

    async componentDidMount() {

        const fetchUserData = async () => {
            
            const token = localStorage.getItem('token');

            if (!token) {
                console.log("No token found, redirecting to login.");
                this.props.router.navigate("/login/");
                return;
            }
            
            try {
                const userData = await getUserData(token); 
                console.log(`User Data:`)
                console.log(userData)

                const initialRole = userData.groups.length > 0 ? userData.groups[0] : '';
                const isAdminUser = initialRole === 'Admin';
                this.setState({
                    user: userData,
                    isAdmin: isAdminUser,
                });
            } catch (e) {
                console.error("Failed to fetch user data")
            }
        }
        fetchUserData();
    };

    handleUserOnChange = (e) => {
        this.setState({
            user: {
                ...this.state.user,
                username: e.target.value
            }
        })
    }

    handleRoleOnChange = (e) => {
        this.setState({
            user: {
                ...this.state.user,
                groups: [e.target.value]
            }
        })
    }

    handleUpdateButton = async (e) => {
        e.preventDefault();

        const user_id = this.state.user.id;
        const { user } = this.state;
        const user_name = user.username;
        
        if (!user_name || user_name.trim() === "") {
            console.error("Username cannot be empty. Please enter a value.");
            return; 
        }

        if (!user_id) {
            console.error("User ID not found in state. Cannot update.");
            return;
        }

        try {
            const token = localStorage.getItem('token');
            
            const user_name = user.username;
            const user_role = user.groups[0];
            const user_password = user.password
            
            const response = await updateItem(
                "user", 
                user_id, 
                token, 
                user_name, 
                user_role, 
                user_password
            );

            if (!response) {
                console.log("No response. Failed to update");
            } else {
                console.log("Updated user data successfully:", response);
            }
        } catch (e) {
            console.error("Failed to update user data:", e.response ? e.response.data : e);
        }

    }

    render() {
        const { user, isAdmin } = this.state;

        const userRoleDisplay = user.groups.length > 0 ? user.groups[0] : '';
        const isDisabled = user.id === null;

        const roles = ['Visitor', 'Librarian', 'Admin'];

        return (
            <React.Fragment>
                <NavBar />

                <form className='form-container'> 
                    <h1 className='header-text'>User Profile</h1>

                    <MDBInput 
                        className='my-4' 
                        label='ID' 
                        value={user.id} 
                        disabled={!isAdmin}
                        type='number'
                    />

                    <MDBInput 
                        className='my-4' 
                        label='Username' 
                        type='text'
                        onChange={this.handleUserOnChange} 
                        value={user.username} 
                        disabled={user.id === null} 
                    />
                    

                    <MDBInputGroup className='mb-3'>
                    <MDBInput className='form-control' type='text'
                        label='Role (Group)' 
                        onChange={this.handleRoleOnChange} 
                        value={userRoleDisplay} 
                        disabled
                    />
                    <MDBDropdown>
                        <MDBDropdownToggle 
                            disabled={isDisabled || !isAdmin}
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
                                    onClick={() => {
                                        this.handleRoleOnChange({ target: { value: role } });
                                    }}
                                >
                                    {role}
                                </MDBDropdownItem>
                            ))}
                        </MDBDropdownMenu>
                    </MDBDropdown>
                    </MDBInputGroup>

                    <MDBBtn type='submit' onClick={this.handleUpdateButton} block disabled={user.id === null}>
                        Update Profile
                    </MDBBtn>
                </form>
            </React.Fragment>
        )
    }
}

export default Home;