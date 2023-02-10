import { Email, Https, Store } from '@mui/icons-material';
import { Button, Card, CardContent, Grid, InputAdornment, Stack, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerNewTenant } from '../../../api/tenant.api';
import { registerNewTenantUser } from '../../../auth/firebase';

function Register() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [company, setCompany] = useState("");
  const navigate = useNavigate();
    
    function register() {
        registerNewTenant(company, email)
        .then(tenant => {
          registerNewTenantUser(tenant.tenantId, email, password);
        })
    }

    const handleLogIn = () => {
      navigate("/login");
    }
    
    return (
        <Grid container justifyContent={'center'} height="100%" display={'flex'} alignItems="center" sx={{backgroundColor: "backgroundColor.dark"}}>
        <Grid item xs={4}>
        <Card sx={{backgroundColor: "backgroundColor.light"}}>
          <CardContent>
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
                  <Stack alignItems={'center'} marginTop={5}>
                    <Button variant='contained' onClick={register}>Sign Up</Button>
                    <Stack direction='row' marginTop={2} alignItems="center" spacing={-2}>
                      <Typography>Already have an account?</Typography>
                      <Button onClick={handleLogIn}>Login</Button>
                    </Stack>
                  </Stack>
              
            </Stack>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
    );
    }
export default Register;