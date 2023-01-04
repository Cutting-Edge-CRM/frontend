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

function App() {
  
    return (
      <>
      <Router>
          <div className="App">
            <Routes>
              <Route path='/login' element={<Login />}></Route>
              <Route path='/register' element={<Register />}></Route>
              <Route path='/forgot-password' element={<ForgotPassword />}></Route>
              <Route path='/set-password' element={<SetPassword />}></Route>
              <Route path="*" element={<GuardedRoute><Shell /></GuardedRoute>} />
              <Route path="/subscribe" element={<GuardedRoute><Subscribe /></GuardedRoute>} />
              <Route path="/portal" element={<GuardedRoute><Portal /></GuardedRoute>} />
            </Routes>
          </div>
        </Router>
      </>
    );
}


export default App;
