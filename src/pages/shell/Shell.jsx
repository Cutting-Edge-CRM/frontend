import React, { Component } from 'react';
import { logout, inviteNewUser, auth, currentUser } from '../../auth/firebase';

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
                <form action="http://localhost:3000/subscriptions/checkout" method="POST">
                <input type="hidden" name="priceId" value="price_1MJLW5Keym0SOuzyP4lkwwuI" />
                <input type="hidden" name="tenantId" value={auth.tenantId}/>
                <input type="hidden" name="email" value={currentUser.email}/>
                <button id="checkout-and-portal-button" type="submit">
                  Team
                </button>
                </form>
                <form action="http://localhost:3000/subscriptions/checkout" method="POST">
                <input type="hidden" name="priceId" value="price_1MJLZaKeym0SOuzyq8CIDUOK" />
                <input type="hidden" name="tenantId" value={auth.tenantId}/>
                <input type="hidden" name="email" value={currentUser.email}/>
                <button id="checkout-and-portal-button" type="submit">
                  Enterprise
                </button>
                </form>
            </div>
            
        );
    }
}

export default Shell;