import React, { useEffect, useState } from 'react';
import { auth, logInWithEmailAndPassword } from '../../../auth/firebase';
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { ErrorTypes } from '../../../util/errors';
import { Card, CardContent, Box, TextField, Button, Stack, Typography, InputAdornment, Divider } from '@mui/material';
import { EmailOutlined, Https } from '@mui/icons-material';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [user, loading] = useAuthState(auth);

  function loginUser() {
    logInWithEmailAndPassword(email, password)
    .then(res => {

    })
    .catch(err => {
      console.error(err);
      if (err.message === ErrorTypes.NOTFOUND) {
        // this.setState({userNotFound: true});
        alert("show user not found error");
      }
      if (err.message === ErrorTypes.INVALIDCREDENTIALS) {
        // this.setState({userNotFound: true});
        alert("show invalid credentials error");
      }
    })
  }


  useEffect(() => {
    if (loading) {
      // maybe trigger a loading screen
      return;
    }
    if (user) navigate("/");
  }, [user, loading, navigate]);

  return (
    <Box>
    <Card>
      <CardContent>
        <Stack>
          <Typography>Log In</Typography>
          <Button>Login with Google</Button>
          <Divider>or</Divider>
        <TextField 
          name="email"
          type='email'
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          InputProps={{
            startAdornment: (
            <InputAdornment position="start">
                <EmailOutlined />
            </InputAdornment>
            ),
            }}/>
        <TextField 
          name="password"
          type='password'
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            startAdornment: (
            <InputAdornment position="start">
                <Https />
            </InputAdornment>
            ),
            }}/>
        <Button onClick={loginUser}>Login</Button>
        <Stack direction='row'>
          <Typography>Don't have an account yet?</Typography>
          <Button>Sign Up</Button>
        </Stack>
        </Stack>
      </CardContent>
    </Card>
  </Box>
  )
}
export default Login;