import { Email, Https, Store } from '@mui/icons-material';
import { Alert, Box, Button, Card, CardContent, CircularProgress, Grid, InputAdornment, Stack, TextField, Typography, useMediaQuery } from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerNewTenant } from '../../../api/tenant.api';
import { logInWithEmailAndPassword, logout, registerNewTenantUser } from '../../../auth/firebase';
import { theme } from '../../../theme/theme';
import { emailValid } from '../../../util/tools';

function Register() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [company, setCompany] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [registering, setRegistering] = useState(false);
    
    function register() {
      setRegistering(true);
        registerNewTenant(company, email)
        .then(tenant => {
          registerNewTenantUser(tenant.id, email, password)
          .then(res => {
            logout()
            .then(_ => {
              logInWithEmailAndPassword(email, password)
              .then(user => {
                setRegistering(false);
                navigate('/getting-started');
              }, err => {
                setRegistering(false);
                setError(err.message);
              })
            })
          }, err => {
            setRegistering(false);
            setError(err.message);
          })
        }, err => {
          setRegistering(false);
          setError(err.message);
        })
        .catch(err => {
          setRegistering(false);
          setError(err.message);
        })
    }

    const handleLogIn = () => {
      navigate("/login");
    }
    
    return (
        <Grid container justifyContent={'center'} height="100vh" alignItems="center" sx={{backgroundColor: "backgroundColor.dark"}}>
        <Grid item xs={useMediaQuery(theme.breakpoints.down("sm")) ? 11 : 4}>
        <Card sx={{backgroundColor: "backgroundColor.light"}}>
          <CardContent>
          {registering && <Box marginTop={2} textAlign='center'><CircularProgress /></Box>}
            <Stack>
              <Stack alignItems={'center'} spacing={4} my={4}>
                <Typography fontSize={20} fontWeight={600}>Sign Up</Typography>
              </Stack>
              <TextField 
                name="company"
                placeholder="Company"
                onChange={(e) => setCompany(e.target.value)}
                InputProps={{
                  startAdornment: (
                  <InputAdornment position="start">
                      <Store color="primary" />
                  </InputAdornment>
                  ),
                  }}
                  sx={{backgroundColor: "white", borderRadius: "20px"}}
                  />
              <TextField 
                name="email"
                type='email'
                placeholder="Email"
                error={!(emailValid(email) || email.length < 1)}
                onChange={(e) => setEmail(e.target.value)}
                InputProps={{
                  startAdornment: (
                  <InputAdornment position="start">
                      <Email color="primary" />
                  </InputAdornment>
                  ),
                  }}
                  sx={{backgroundColor: "white", borderRadius: "20px", mt: 3}}
                  />
              <Stack>
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
                  <Typography fontSize={14} fontWeight={400} textAlign="center" color={'neutral.main'}>Password must be at least 8 characters</Typography>
                  </Stack>
                  <Stack alignItems={'center'} marginTop={5}>
                    <Button 
                    variant='contained'
                     onClick={register}
                     disabled={!emailValid(email) || company.length === 0 || (password.length < 8)}
                     >Sign Up</Button>
                    <Stack direction={useMediaQuery(theme.breakpoints.down("sm")) ? 'column' : 'row'} marginTop={2} alignItems="center" spacing={-2}>
                      <Typography>Already have an account?</Typography>
                      <Button onClick={handleLogIn}>Login</Button>
                    </Stack>
                  </Stack>
              
            </Stack>
          </CardContent>
          {error && <Alert severity="error">{error}</Alert>}
        </Card>
      </Grid>
    </Grid>
    );
    }
export default Register;