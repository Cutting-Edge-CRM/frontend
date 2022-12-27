import React, { Component } from 'react';
import { auth, currentUser } from '../../auth/firebase';


class Subscribe extends Component {
    constructor(props) {
        super(props);
        this.state = {};
      }

    render() {
        return (
            <div>
              <form action="http://localhost:3000/subscriptions/checkout" method="POST">
                <input type="hidden" name="priceId" value="price_1MJSEeKeym0SOuzyUzddnMVl" />
                <input type="hidden" name="tenantId" value={auth.tenantId}/>
                <input type="hidden" name="email" value={currentUser.email}/>
                <button id="checkout-and-portal-button" type="submit">
                  Basic
                </button>
                </form>
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

export default Subscribe;