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
import { isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";
import { auth } from "./auth/firebase";
import { getTenantForClient } from './api/tenant.api';
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

if (!isSignInWithEmailLink(auth, window.location.href)) {
  loading = false;
}

  // Confirm the link is a sign-in with email link.
if (isSignInWithEmailLink(auth, window.location.href)) {
  let link = window.location.href;
  const url = new URL(link);
  let baseLink = window.location.href.split('?')[0];
  let email = url.searchParams.get('email');
  let client = url.pathname.split('/')[2];
  let resourceType = url.pathname.split('/')[3]?.slice(0,-1)?.toLowerCase();
  let resourceId = url.pathname.split('/')[4];
  if (!email) email = window.localStorage.getItem('emailForSignIn');
  if (!email) email = window.prompt('Please provide your email for confirmation');
  window.localStorage.setItem('emailForSignIn', email as string);
  getTenantForClient(client).then(res => {
    let tenantId = res.company;
    auth.tenantId = tenantId;
    signInWithEmailLink(auth, (email as string), link)
    .then((result) => {
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
    })
    .catch((error) => {
      console.error(error);
    });
  }).catch(err => {
    console.error(err);
  })
  }

  if (loading) {
    return (<></>);
  }

  return children;
}


export default App;
