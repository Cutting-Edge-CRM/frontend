import { EmailOutlined, Https, Store } from '@mui/icons-material';
import { Box, Button, Card, CardContent, InputAdornment, Stack, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { registerNewTenant } from '../../../api/tenant.api';
import { registerNewTenantUser } from '../../../auth/firebase';

function Register() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [company, setCompany] = useState("");
    
    function register() {
        registerNewTenant(company, email)
        .then(tenant => {
          registerNewTenantUser(tenant.tenantId, email, password);
        })
    }
    
    return (
      <Box>
        <Card>
          <CardContent>
            <Stack>
              <Typography>Sign Up</Typography>
            <TextField 
              name="company"
              placeholder='Company Name'
              onChange={(e) => setCompany(e.target.value)}
              InputProps={{
                startAdornment: (
                <InputAdornment position="start">
                    <Store />
                </InputAdornment>
                ),
                }}/>
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
            <Button onClick={register}>Sign Up</Button>
            <Stack direction='row'>
              <Typography>Already have an account?</Typography>
              <Button>Login</Button>
            </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    );
    }
export default Register;