import React, { useState } from 'react';
import {
  MDBInput,
  MDBBtn,
  MDBIcon
} from 'mdb-react-ui-kit';
import withRouter from '../utils/withRouter';
import { getUserData } from '../api';

function Login(props) {
  const [formValue, setFormValue] = useState("");

  const onFormChange = (e) => {
    const newValue = e.target.value;
    setFormValue(newValue);
  };

  const handleFbButton = () => {
    console.log('FACEBOOK')
    props.router.navigate("/");
  }

  const handleLogIn = async (e) => {
      e.preventDefault();
      
      try {
        getUserData(formValue);
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

          <MDBBtn floating color="secondary" className='mx-1' onClick={handleFbButton}>
            <MDBIcon fab icon='facebook-f' />
          </MDBBtn>
        </div>
      </form>
    </div>
  );
}

export default withRouter(Login);