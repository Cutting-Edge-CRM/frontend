import React, { useEffect, useState } from 'react';
import { auth, logInWithEmailAndPassword } from '../../../auth/firebase';
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { ErrorTypes } from '../../../util/errors';
import { Card, CardContent, Box, TextField, Button, Stack } from '@mui/material';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [user, loading] = useAuthState(auth);

  function loginUser(email: string, password: string) {
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
          <TextField type="email" name="email" label="Email" onChange={(e) => setEmail(e.target.value)}/>
          <TextField type="password" name='password' label="Password" onChange={(e) => setPassword(e.target.value)}/>
          <Button onClick={() => loginUser(email, password)}>Submit</Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  )
}
export default Login;