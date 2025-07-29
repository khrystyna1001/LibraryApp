import React, { useState } from 'react';
import FacebookLogin from 'react-facebook-login';
import {
  MDBInput,
  MDBBtn,
  MDBIcon
} from 'mdb-react-ui-kit';
import withRouter from '../utils/withRouter';
import { getUserData } from '../api';
import axios from 'axios';

function Login(props) {
  const [formValue, setFormValue] = useState("");

  const onFormChange = (e) => {
    const newValue = e.target.value;
    setFormValue(newValue);
  };

  const handleFacebookCallback = async (response) => {
    if (response?.status === "unknown") {
        console.error('Sorry!', 'Something went wrong with facebook Login.');
     return;
    }
    console.log("Facebook Response:", response);

    if (response.accessToken) {
        try {
            const backendResponse = await axios.post(
                `http://localhost:8000/auth/social/token_user/facebook/`,
                { access_token: response.accessToken },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (backendResponse.status === 200) {
                const { key } = backendResponse.data; 
                localStorage.setItem('token', key);
                console.log("Django Token stored in localStorage:", key);
                props.router.navigate("/");
            } else {
                console.warn("Unexpected backend response status:", backendResponse.status);
            }

        } catch (err) {
            console.error("Failed to exchange Facebook token for Django token:", err);
        }
    } else {
        console.error("No Facebook access token in response.");
        alert("Facebook login failed. No access token received.");
    }
  }

  const handleLogIn = async (e) => {
      e.preventDefault();
      
      try {
        await getUserData(formValue);
        localStorage.setItem('token', formValue);
        console.log("Token stored in localStorage:", formValue);
        props.router.navigate("/");
      } catch (err) {
          console.error("Failed to fetch user data");
      }
  }

  return (
    <div className='d-flex align-items-center justify-content-center' style={{ height: '600px' }}>
      <form className='m-auto w-25' onSubmit={handleLogIn}>

        <MDBInput className='m-4' type='password' id='form2Example2' label='Token' value={formValue} onChange={(e) => onFormChange(e)} required />
        <MDBBtn type='submit' className='mb-4' block>
          Log in
        </MDBBtn>

        <div className='text-center'>
          <p>Sign in with:</p>
        
          {/* <MDBBtn floating color="secondary" className='mx-1' onClick={handleFbButton}>
            <MDBIcon fab icon='facebook-f' /> */}
              <FacebookLogin 
              appId="713417228147118"
              autoLoad={false}  
              fields="name,email,picture"  
              callback={handleFacebookCallback}/>
          {/* </MDBBtn> */}
        </div>
      </form>
    </div>
  );
}

export default withRouter(Login);