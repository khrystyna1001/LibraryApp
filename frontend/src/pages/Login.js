import React from 'react';
import {
  MDBInput,
  MDBCol,
  MDBRow,
  MDBCheckbox,
  MDBBtn,
  MDBIcon
} from 'mdb-react-ui-kit';

export default function Login() {
  return (
    <div className='d-flex align-items-center justify-content-center' style={{ height: '600px' }}>
      <form className='m-auto w-25'>
        <MDBInput className='m-4' type='email' id='form2Example1' label='Username' />
        <MDBInput className='m-4' type='password' id='form2Example2' label='Password' />

        <MDBBtn type='submit' className='mb-4' block>
          Sign in
        </MDBBtn>

        <MDBInput className='m-4' type='password' id='form2Example2' label='Token' />
        <MDBBtn type='submit' className='mb-4' block>
          Sign in with Token
        </MDBBtn>

        <div className='text-center'>
          <p>Sign up with:</p>

          <MDBBtn floating color="secondary" className='mx-1'>
            <MDBIcon fab icon='facebook-f' />
          </MDBBtn>
        </div>
      </form>
    </div>
  );
}