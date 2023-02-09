import { Https } from '@mui/icons-material';
import { Box, Button, Card, CardContent, InputAdornment, Stack, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { setNewPassword } from '../../../auth/firebase';

function Register() {
  const [password, setPassword] = useState("");

  const changePassword = (password: string) => {
    setNewPassword(password)
    .then(res => {
      window.location.replace(process.env.REACT_APP_URL as string);
    }, err => {
      console.log(err);
    })
  }
    
    return (
      <Box>
        <Card>
          <CardContent>
            <Stack>
              <Typography>Set a password</Typography>
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
            <Button onClick={() => changePassword(password)}>Set Password</Button>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    );
    }
export default Register;