import React, { useEffect, useState } from 'react';
import { auth, logInWithEmailAndPassword } from '../../../auth/firebase';
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { ErrorTypes } from '../../../util/errors';
import { Card, CardContent, TextField, Button, Stack, Typography, InputAdornment, Divider, Grid, Avatar } from '@mui/material';
import { Email, Https } from '@mui/icons-material';

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

  const handleSignUp = () => {
    navigate("/register");
  }

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  }


  useEffect(() => {
    if (loading) {
      // maybe trigger a loading screen
      return;
    }
    if (user) navigate("/");
  }, [user, loading, navigate]);

  return (
    <Grid container justifyContent={'center'} height="100%" display={'flex'} alignItems="center" sx={{backgroundColor: "backgroundColor.dark"}}>
      <Grid item xs={4}>
      <Card sx={{backgroundColor: "backgroundColor.light"}}>
        <CardContent>
          <Stack>
            <Stack alignItems={'center'} spacing={4} my={4}>
              <Typography fontSize={20} fontWeight={600}>Log In</Typography>
              <Button>Login with Google</Button>
            </Stack>
              <Divider sx={{
                    '&.MuiDivider-root': {
                        '&::before': {
                            borderTop: `2px solid white`
                        },
                        '&::after': {
                          borderTop: `2px solid white`
                      } 
                    },
                    mb: 4
                }}
                style={{
                    color: "white",
                }}
                variant="middle"
                >
                  <Avatar sx={{backgroundColor: "backgroundColor.dark", border: "2px solid white"}}>Or</Avatar>
                </Divider>
            <TextField 
              name="email"
              type='email'
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                startAdornment: (
                <InputAdornment position="start">
                    <Email color="primary" />
                </InputAdornment>
                ),
                }}
                sx={{backgroundColor: "white", borderRadius: "20px"}}
                />
            <TextField 
              name="password"
              type='password'
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                <InputAdornment position="start">
                    <Https color="primary"/>
                </InputAdornment>
                ),
                }}
                sx={{backgroundColor: "white", borderRadius: "20px", mt: 3}}
                />
                <Button
                  sx={{ alignSelf: 'flex-end'}}
                  onClick={handleForgotPassword}
                >
                  Forgot password?
                </Button>
                <Stack alignItems={'center'} marginTop={5}>
                  <Button variant='contained' onClick={loginUser}>Login</Button>
                  <Stack direction='row' marginTop={2} alignItems="center" spacing={-2}>
                    <Typography>Don't have an account yet?</Typography>
                    <Button onClick={handleSignUp}>Sign Up</Button>
                  </Stack>
                </Stack>
            
          </Stack>
        </CardContent>
      </Card>
    </Grid>
  </Grid>
  )
}
export default Login;