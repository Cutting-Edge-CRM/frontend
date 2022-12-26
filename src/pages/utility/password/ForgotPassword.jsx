import React, { Component } from 'react';
import { sendPasswordReset } from '../../../auth/firebase.js';


class ForgotPassword extends Component {

    constructor(props) {
        super(props);
        this.state = {};
        this.resetPassword = this.resetPassword.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
      }
    
      resetPassword() {
        console.log(this.state);
        sendPasswordReset(this.state.email)
      }
    
      handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
          [name]: value
        });
      }

    render() {
        return (
            <div>
            <label>Email</label>
            <input type="email" name="email" onChange={this.handleInputChange}/>
            <button onClick={this.resetPassword}>Submit</button>
            </div>
        );
    }
}

export default ForgotPassword;