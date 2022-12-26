import React, { useEffect, useState, Component } from 'react';
import './Login.css';
import { auth, logInWithEmailAndPassword } from '../../../auth/firebase.js';
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { ErrorTypes } from '../../../util/errors';


function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [user, loading, error] = useAuthState(auth);

  function loginUser(email, password) {
    logInWithEmailAndPassword(email, password)
    .then(res => {

    })
    .catch(err => {
      console.error(err);
      if (err.message == ErrorTypes.NOTFOUND) {
        // this.setState({userNotFound: true});
        alert("show user not found error");
      }
      if (err.message == ErrorTypes.INVALIDCREDENTIALS) {
        // this.setState({userNotFound: true});
        alert("show invalid credentials error");
      }
    })
  }


  useEffect(() => {
    if (loading) {
      // maybe trigger a loading screen
      return;
    }
    if (user) navigate("/");
  }, [user, loading]);

  return (
    <div>
    <label>Email</label>
    <input type="email" name="email" onChange={(e) => setEmail(e.target.value)}/>
    <label>Password</label>
    <input type="password" name='password' onChange={(e) => setPassword(e.target.value)}/>
    <button onClick={() => loginUser(email, password)}>Submit</button>
    </div>
  )
}
export default Login;