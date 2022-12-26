import React, { Component } from 'react';
import { registerNewTenant } from '../../../api/tenant.api.js';
import { registerNewTenantUser } from '../../../auth/firebase.js';

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.register = this.register.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
      }
    
      register() {
        registerNewTenant(this.state.name, this.state.email)
        .then(tenant => {
          registerNewTenantUser(tenant.tenantId, this.state.email, this.state.password);
        })
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
          <label>Name</label>
          <input type="text" name="name" onChange={this.handleInputChange}/>
          <label>Email</label>
          <input type="email" name="email" onChange={this.handleInputChange}/>
          <label>Password</label>
          <input type="password" name='password' onChange={this.handleInputChange}/>
          <button onClick={this.register}>Submit</button>
        </div>
        );
      }
    }
export default Register;