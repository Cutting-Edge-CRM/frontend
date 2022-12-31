import React, { useState } from 'react';
import { registerNewTenant } from '../../../api/tenant.api';
import { registerNewTenantUser } from '../../../auth/firebase';

function Register() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
    
    function register() {
        registerNewTenant(name, email)
        .then(tenant => {
          registerNewTenantUser(tenant.tenantId, email, password);
        })
    }
    
    return (
      <div>
      <label>Name</label>
      <input type="text" name="name" onChange={(e) => setName(e.target.value)}/>
      <label>Email</label>
      <input type="email" name="email" onChange={(e) => setEmail(e.target.value)}/>
      <label>Password</label>
      <input type="password" name='password' onChange={(e) => setPassword(e.target.value)}/>
      <button onClick={register}>Submit</button>
    </div>
    );
    }
export default Register;