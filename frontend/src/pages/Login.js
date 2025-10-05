import React, { useState } from 'react';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import { Button, Form, Grid, Message, Segment, Icon } from 'semantic-ui-react';
import withRouter from '../utils/withRouter';
import { getUserData } from '../api';
import axios from 'axios';
import { useAuth } from '../utils/authContext';

function Login(props) {
  const [formValue, setFormValue] = useState("");
  const { login } = useAuth();

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

    let userData = null;
    let loginTokenData = null;

    const userExists = usersArray.find(user => user.username === username);

    try {
      if (userExists) {
        console.log("USER EXISTS, attempting to log in...");
      
          await axios.patch(`http://localhost:8000/user/${userExists.id}/`, {
              "password": password
          });

          loginTokenData = await axios.post("http://localhost:8000/api/login/", {
              "username": username,
              "password": password
          });
        } else {
      console.log("USER DOESN'T EXIST, creating a new user...");
        const newUserResponse = await axios.post("http://localhost:8000/user/", {
          "username": username,
          "password": password
        });

        if (newUserResponse) {
            loginTokenData = await axios.post("http://localhost:8000/api/login/", {
              "username": username,
              "password": password 
            });
          }
        }
        if (loginTokenData && loginTokenData.data.token) {
          const token = loginTokenData.data.token;
          userData = await getUserData(token);
          login(userData, token);
          props.router.navigate("/home");
        } else {
          console.error("Facebook login failed. No token received.");
        }
    } catch (e) {
      console.error("Failed during Facebook login process:", e)
    }
  };
  

  const handleLogIn = async (e) => {
      e.preventDefault();
      
      try {
        const token = formValue;
        const response = await getUserData(formValue);
        if (response) {
          login(response, token)
          props.router.navigate("/home");
        } else {
          console.log("Failed to fetch user data")
        }
      } catch (err) {
          console.error("Failed to fetch user data");
      }
  }

  return (
    <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
      <Grid.Column style={{ maxWidth: 450 }}>
        <Form size='large' onSubmit={handleLogIn}>
          <Segment stacked>
            <Form.Input
              fluid
              icon='lock'
              iconPosition='left'
              placeholder='Token'
              type='password' 
              id='form2Example2' 
              label='Token' 
              value={formValue} 
              onChange={(e) => onFormChange(e)} 
              required
            />

            <Button color='teal' fluid size='large' type='submit'>
              Login
            </Button>
          </Segment>
        </Form>
        <Message>
          Sign in with <span style={{ marginLeft: '30px' }}> 
          <FacebookLogin 
              appId="713417228147118"
              autoLoad={false}  
              fields="name,email,picture"  
              callback={handleFacebookCallback}
              responseType="token"
              render={renderProps => (
                <Button color='facebook' onClick={renderProps.onClick}>
                  <Icon name='facebook f' />
                </Button>
              )}
          />
          </span>
        </Message>
      </Grid.Column>
    </Grid>
  );
}

export default withRouter(Login);