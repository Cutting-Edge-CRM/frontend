import React, { useState } from 'react';
import { sendPasswordReset } from '../../../auth/firebase';


function ForgotPassword() {

  const [email, setEmail] = useState("");
    
     function resetPassword() {
        sendPasswordReset(email)
      }

        return (
            <div>
            <label>Email</label>
            <input type="email" name="email" onChange={(e) => setEmail(e.target.value)}/>
            <button onClick={resetPassword}>Submit</button>
            </div>
        );
}

export default ForgotPassword;