import { Email, HttpsOutlined } from '@mui/icons-material';
import { Alert, Button, Card, CardContent, Grid, InputAdornment, Stack, TextField, Typography, useMediaQuery } from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendPasswordReset } from '../../../auth/firebase';
import { theme } from '../../../theme/theme';
import { emailValid } from '../../../util/tools';


function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState(null);

    
    function resetPassword() {
      sendPasswordReset(email)
      .then(_ => {
        // show success
      }, err => {
        setError(err.message);
      })
    }

    const handleLogIn = () => {
      navigate("/login");
    }
    

    return (
      <Grid container justifyContent={'center'} height="100%" display={'flex'} alignItems="center" sx={{backgroundColor: "backgroundColor.dark"}}>
      <Grid item xs={useMediaQuery(theme.breakpoints.down("sm")) ? 11 : 4}>
      <Card sx={{backgroundColor: "backgroundColor.light"}}>
        <CardContent>
          <Stack>
            <Stack alignItems={'center'} spacing={2} my={4}>
              <HttpsOutlined color='primary' sx={{fontSize: "72px"}}/>
              <Typography fontSize={20} fontWeight={600}>Trouble logging in?</Typography>
              <Typography fontSize={14} fontWeight={500}>Enter your email and we'll send you a link to reset your password.</Typography>
            </Stack>
            <TextField 
              name="email"
              type='email'
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              error={!(emailValid(email) || email.length < 1)}
              InputProps={{
                startAdornment: (
                <InputAdornment position="start">
                    <Email color="primary" />
                </InputAdornment>
                ),
                }}
                sx={{backgroundColor: "white", borderRadius: "20px", mt: 3}}
                />
                <Stack alignItems={'center'} marginTop={5}>
                  <Button variant='contained' onClick={resetPassword}>Reset</Button>
                  <Stack direction={useMediaQuery(theme.breakpoints.down("sm")) ? 'column' : 'row'} marginTop={2} alignItems="center" spacing={-2}>
                    <Typography>Already know your password?</Typography>
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

export default ForgotPassword;