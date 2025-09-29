import React, { useState } from 'react';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
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

  function Str_Random(length) {
    let result = '';
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    
    for (let i = 0; i < length; i++) {
        const randomInd = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomInd);
    }
    return result;
  }

  const handleFacebookCallback = async (response) => {

    if (!response.accessToken) {
      console.log("Facebook login failed or was canceled.");
      return;
    }
  
    const users = await axios.get('http://localhost:8000/user/');
    const usersArray = Object.values(users.data);

    const username = response.name.split(" ")[0];
    const password = Str_Random(15);

    const userExists = usersArray.find(user => user.username === username);

    if (userExists) {
      console.log("USER EXISTS, attempting to log in...");
      
      try {
          await axios.patch(`http://localhost:8000/user/${userExists.id}/`, {
              "password": password
          });

          const loginToken = await axios.post("http://localhost:8000/api/login/", {
              "username": username,
              "password": password
          });

          localStorage.setItem('token', loginToken.data.token);
          props.router.navigate("/");
      } catch (e) {
          console.error("Failed to log in existing user:", e);
      }

    } else {
      console.log("USER DOESN'T EXIST, creating a new user...");
      
      try {
        const newUserResponse = await axios.post("http://localhost:8000/user/", {
          "username": username,
          "password": password
        });

        if (newUserResponse) {
            const loginToken = await axios.post("http://localhost:8000/api/login/", {
              "username": username,
              "password": password 
            });
            localStorage.setItem('token', loginToken.data.token);
            props.router.navigate("/");
        } else {
            console.log("Backend failed to return token creation")
        }
      } catch (e) {
        console.error("Failed to create new user or get login token:", e);
      }
    }
 };
  

  const handleLogIn = async (e) => {
      e.preventDefault();
      
      try {
        const response = await getUserData(formValue);
        if (response) {
          localStorage.setItem('token', formValue);
          console.log("Token stored in localStorage:", formValue);
          props.router.navigate("/");
        } else {
          console.log("Failed to fetch user data")
        }
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
          <FacebookLogin 
              appId="713417228147118"
              autoLoad={false}  
              fields="name,email,picture"  
              callback={handleFacebookCallback}
              responseType="token"
              render={renderProps => (
                <MDBBtn floating color="secondary" className='mx-1' onClick={renderProps.onClick}>
                  <MDBIcon fab icon='facebook-f' />
                </MDBBtn>
              )}
          />
        </div>
      </form>
    </div>
  );
}

export default withRouter(Login);