import React from 'react';
import { auth, currentUser } from '../../auth/firebase';


function Subscribe() {

        return (
            <div>
              <form action={`${process.env.REACT_APP_SERVER_URL}/subscriptions/checkout`} method="POST">
                <input type="hidden" name="priceId" value="price_1MJSEeKeym0SOuzyUzddnMVl" />
                <input type="hidden" name="tenantId" value={auth.tenantId as string}/>
                <input type="hidden" name="email" value={currentUser.email as string}/>
                <button id="checkout-and-portal-button" type="submit">
                  Basic
                </button>
                </form>
                <form action={`${process.env.REACT_APP_SERVER_URL}/subscriptions/checkout`} method="POST">
                <input type="hidden" name="priceId" value="price_1MJLW5Keym0SOuzyP4lkwwuI" />
                <input type="hidden" name="tenantId" value={auth.tenantId as string}/>
                <input type="hidden" name="email" value={currentUser.email as string}/>
                <button id="checkout-and-portal-button" type="submit">
                  Team
                </button>
                </form>
                <form action={`${process.env.REACT_APP_SERVER_URL}/subscriptions/checkout`} method="POST">
                <input type="hidden" name="priceId" value="price_1MJLZaKeym0SOuzyq8CIDUOK" />
                <input type="hidden" name="tenantId" value={auth.tenantId as string}/>
                <input type="hidden" name="email" value={currentUser.email as string}/>
                <button id="checkout-and-portal-button" type="submit">
                  Enterprise
                </button>
                </form>
            </div>
            
        );
}

export default Subscribe;