import { auth, currentUser } from "../auth/firebase";

async function getCheckoutSession(priceId: string) {
    try {
    var headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + await currentUser.getIdToken(),
        'tenantId': auth.tenantId as string,
        'userId': auth.currentUser?.uid as string
    }
    var body = JSON.stringify({priceId: priceId});
    const requestOptions: RequestInit = {
        method: 'POST',
        headers: headers,
        body: body
    };
        let url = new URL(`${process.env.REACT_APP_SERVER_URL}/subscriptions/checkout`);
        return fetch(url, requestOptions)
        .then(res => {
            if (res.ok) {
                return res.json();
            }
            return res.json().then(err => {
                console.error(`Error getting checkout session: ${res.type} ${res.statusText} ${err.kind} ${err.message}`);
                throw new Error(`Error getting checkout session`);
            })
        })
    } catch (err) {
        console.error(err);
    }
}

async function getPortalSession() {
    console.log('getting portal');
    try {
    var headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + await currentUser.getIdToken(),
        'tenantId': auth.tenantId as string,
        'userId': auth.currentUser?.uid as string
    }
    const requestOptions: RequestInit = {
        method: 'POST',
        headers: headers,
    };
        let url = new URL(`${process.env.REACT_APP_SERVER_URL}/subscriptions/portal`);
        return fetch(url, requestOptions)
        .then(res => {
            if (res.ok) {
                return res.json();
            }
            return res.json().then(err => {
                console.error(`Error getting portal session: ${res.type} ${res.statusText} ${err.kind} ${err.message}`);
                throw new Error(`Error getting portal session`);
            })
        })
    } catch (err) {
        console.error(err);
    }
}

async function getSubscription() {
    try {
        var headers: HeadersInit = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + await currentUser.getIdToken(),
            'tenantId': auth.tenantId as string,
            'userId': auth.currentUser?.uid as string
        }
        const requestOptions: RequestInit = {
            method: 'GET',
            headers: headers,
        };
            let url = new URL(`${process.env.REACT_APP_SERVER_URL}/subscriptions/get-subscription`);
            return fetch(url, requestOptions)
            .then(res => {
                if (res.ok) {
                    return res.json();
                }
                return res.json().then(err => {
                    console.error(`Error getting subscription: ${res.type} ${res.statusText} ${err.kind} ${err.message}`);
                    throw new Error(`Error getting subscription`);
                })
            })
        } catch (err) {
            console.error(err);
        }
}

export {
    getCheckoutSession,
    getSubscription,
    getPortalSession
}