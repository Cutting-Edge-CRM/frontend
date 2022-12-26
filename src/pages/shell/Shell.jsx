import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { logout, inviteNewUser } from '../../auth/firebase';

class Shell extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.inviteUser = this.inviteUser.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
      }
    
      inviteUser() {
        inviteNewUser(this.state.name, this.state.email)
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
                <button onClick={logout}>Logout</button>
                <div>
                    <br></br>
                    <h3>Invite User</h3>
                    <label>Name</label>
                    <input type="text" name="name" onChange={this.handleInputChange}/>
                    <label>Email</label>
                    <input type="email" name="email" onChange={this.handleInputChange}/>
                    <button onClick={this.inviteUser}>Invite</button>
                </div>
            </div>
            
        );
    }
}

Shell.propTypes = {

};

export default Shell;