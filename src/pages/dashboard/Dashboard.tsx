import React, { useState } from 'react';
import { logout, inviteNewUser, auth, currentUser } from '../../auth/firebase';


function Dashboard() {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    function inviteUser() {
        inviteNewUser(name, email)
      }

    return (
        <div>
            <button onClick={logout}>Logout</button>
            <div>
                <br></br>
                <h3>Invite User</h3>
                <label>Name</label>
                <input type="text" name="name" onChange={(e) => setName(e.target.value)}/>
                <label>Email</label>
                <input type="email" name="email" onChange={(e) => setEmail(e.target.value)}/>
                <button onClick={inviteUser}>Invite</button>
            </div>
            <form action="http://localhost:3000/subscriptions/checkout" method="POST">
            <input type="hidden" name="priceId" value="price_1MJLW5Keym0SOuzyP4lkwwuI" />
            <input type="hidden" name="tenantId" value={auth.tenantId as string}/>
            <input type="hidden" name="email" value={currentUser.email as string}/>
            <button id="checkout-and-portal-button" type="submit">
              Team
            </button>
            </form>
            <form action="http://localhost:3000/subscriptions/checkout" method="POST">
            <input type="hidden" name="priceId" value="price_1MJLZaKeym0SOuzyq8CIDUOK" />
            <input type="hidden" name="tenantId" value={auth.tenantId as string}/>
            <input type="hidden" name="email" value={currentUser.email as string}/>
            <button id="checkout-and-portal-button" type="submit">
              Enterprise
            </button>
            </form>
        </div>
    )

}

export default Dashboard;
