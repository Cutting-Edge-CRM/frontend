import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import React from 'react';
import Login from './pages/utility/login/Login'
import Register from './pages/utility/register/Register'
import ForgotPassword from './pages/utility/password/ForgotPassword'
import SetPassword from './pages/utility/password/SetPassword'
import Shell from './pages/shell/Shell';
import GuardedRoute from './auth/GuardedRoute';
import Subscribe from './pages/demo/Subscribe';
import Portal from './pages/demo/Portal';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { ThemeProvider } from '@mui/material';
import { theme } from './theme/theme';
import ClientHub from './pages/client-hub/ClientHub';
import { loginAnonymously } from "./auth/firebase";
import { createTimeline } from './api/timeline.api';

function App() {

  let loading = true;

  const children = (
  <>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Router>
            <div className="App">
              <Routes>
                <Route path='/login' element={<Login />}></Route>
                <Route path='/register' element={<Register />}></Route>
                <Route path='/forgot-password' element={<ForgotPassword />}></Route>
                <Route path='/set-password' element={<SetPassword />}></Route>
                <Route path='/client-hub/:clientId/*' element={<GuardedRoute><ClientHub /></GuardedRoute>}></Route>
                <Route path="/subscribe" element={<GuardedRoute><Subscribe /></GuardedRoute>} />
                <Route path="/portal" element={<GuardedRoute><Portal /></GuardedRoute>} />
                <Route path="*" element={<GuardedRoute><Shell /></GuardedRoute>} />
              </Routes>
            </div>
          </Router>
        </LocalizationProvider>
      </ThemeProvider>
      </>
  );

if (!window.location.href.includes('anonymous')) {
  loading = false;
}

  // Confirm the link is a sign-in with email link.
if (window.location.href.includes('anonymous')) {
  let link = window.location.href;
  const url = new URL(link);
  let baseLink = window.location.href.split('?')[0];
  // let anonymous = Buffer.from(url.searchParams.get('anonymous') as string, 'base64').toString('ascii');
  let client = url.pathname.split('/')[2];
  let resourceType = url.pathname.split('/')[3]?.slice(0,-1)?.toLowerCase();
  let resourceId = url.pathname.split('/')[4];

  loginAnonymously(client)
  .then(res => {
    console.log(res);
    // mark quote/invoice as opened
    let timeline_event = {
      client: client,
      resourceId: resourceId,
      resourceType: resourceType,
      resourceAction: 'opened'
    };
    createTimeline(timeline_event);
    window.location.replace(baseLink);
    loading = false;
    }, err => {
      console.error(err);
    })

  }

  if (loading) {
    return (<></>);
  }

  return children;

}


export default App;
