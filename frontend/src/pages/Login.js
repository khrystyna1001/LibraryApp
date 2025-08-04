import React, { useState } from 'react';
import FacebookLogin from 'react-facebook-login';
import {
  MDBInput,
  MDBBtn
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
  console.log(response)
    try {
        await axios.post("http://localhost:8000/user/", {"username": response.name.split('')[0]})
        // await axios.post
        localStorage.setItem('token', response.accessToken)
        console.log("Token stored in localStorage:", formValue);
        props.router.navigate("/");
    } catch (e) {
        console.log(e)
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
              autoLoad={true}  
              fields="name,email,picture"  
              callback={handleFacebookCallback}
              responseType="token"
              />
          {/* </MDBBtn> */}
        </div>
      </form>
    </div>
  );
}

export default withRouter(Login);