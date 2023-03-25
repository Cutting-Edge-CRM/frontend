import { Https, HttpsOutlined } from '@mui/icons-material';
import { Alert, Button, Card, CardContent, Grid, InputAdornment, Stack, TextField, Typography, useMediaQuery } from '@mui/material';
import React, { useState } from 'react';
import { setNewPassword } from '../../../auth/firebase';
import { theme } from '../../../theme/theme';

function Register() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  let mobile = useMediaQuery(theme.breakpoints.down("sm"));

  const changePassword = (password: string) => {
    setNewPassword(password)
    .then(res => {
      window.location.replace(process.env.REACT_APP_URL as string);
    }, err => {
      setError(err.message);
    })
  }
    
    return (
      <Grid container justifyContent={'center'} height="100vh" display={'flex'} alignItems="center" sx={{backgroundColor: "backgroundColor.dark"}}>
      <Grid item xs={mobile ? 11 : 4}>
      <Card sx={{backgroundColor: "backgroundColor.light"}}>
        <CardContent>
            <Stack>
            <Stack alignItems={'center'} spacing={2} my={4}>
              <HttpsOutlined color='primary' sx={{fontSize: "72px"}}/>
              <Typography fontSize={20} fontWeight={600}>Set a password</Typography>
              <Typography fontSize={14} fontWeight={500}>Choose and new password and we'll log you in.</Typography>
            </Stack>
            <TextField 
              name="password"
              type='password'
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                <InputAdornment position="start">
                    <Https color="primary" />
                </InputAdornment>
                ),
                }}
                sx={{backgroundColor: "white", borderRadius: "20px", mt: 3}}
                />
                <Typography fontSize={14} fontWeight={400} textAlign="center" color={'neutral.main'}>Password must be at least 8 characters</Typography>
                <Stack alignItems={'center'} marginTop={5}>
                  <Button 
                    disabled={password.length < 8}
                    variant='contained' onClick={() => changePassword(password)}>Set Password</Button>
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