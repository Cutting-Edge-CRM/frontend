import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import React, { Component } from 'react';
import Login from './pages/utility/login/Login'
import Register from './pages/utility/register/Register'
import ForgotPassword from './pages/utility/password/ForgotPassword'
import SetPassword from './pages/utility/password/SetPassword'
import Shell from './pages/shell/Shell';
import GuardedRoute from './auth/GuardedRoute';

function App() {
  
    return (
      <Router>
      <div className="App">
        <Routes>
            <Route exact path='/login' element={< Login />}></Route>
            <Route exact path='/register' element={< Register />}></Route>
            <Route exact path='/forgot-password' element={< ForgotPassword />}></Route>
            <Route exact path='/set-password' element={< SetPassword />}></Route>
            <Route path="/" element={<GuardedRoute><Shell /></GuardedRoute>}/>
        </Routes>
      </div>
  </Router>
    );
}

App.propTypes = {

};

export default App;
