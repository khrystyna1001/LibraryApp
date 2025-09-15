import React, { Component } from 'react';
import NavBar from '../components/Navigation';
import { getUserData } from '../api';
import '../App.css'

import {
    MDBBtn,
    MDBInput,
} from 'mdb-react-ui-kit'

class Home extends Component {

    state = {
        user: {},
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
                console.log(`User Data: ${userData}`)
                this.setState({
                    user: userData,
                });
            } catch (e) {
                console.error("Failed to fetch user data")
            }
        }
        fetchUserData();
    };

    render() {
        const { user } = this.state;

        return (
            <React.Fragment>
                <NavBar />

                <form className='form-container'>
                    <h1 className='header-text'>User Profile</h1>

                    <MDBInput className='my-4' label='Username' value={user ? user.username : ''} />
                    <MDBInput className='my-4' label='Group' value={user ? user.groups : ''} />

                    {/* <MDBBtn type='submit' block>
                        Update
                    </MDBBtn> */}
                </form>
            </React.Fragment>
        )
    }
   
}

export default Home;