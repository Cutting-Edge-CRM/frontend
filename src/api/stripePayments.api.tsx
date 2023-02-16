import { auth, currentUser } from "../auth/firebase";

async function startPaymentSetUp() {
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
        let url = new URL(`${process.env.REACT_APP_SERVER_URL}/stripe-payments/start-setup`);
        return fetch(url, requestOptions)
        .then(res => {
            if (res.ok) {
                return res.json();
            }
            return res.json().then(err => {
                console.error(`Error starting payments setup: ${res.type} ${res.statusText} ${err.kind} ${err.message}`);
                throw new Error(`Error starting payments setup`);
            })
        })
    } catch (err) {
        console.error(err);
    }
}

async function continuePaymentSetUp() {
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
        let url = new URL(`${process.env.REACT_APP_SERVER_URL}/stripe-payments/continue-setup`);
        return fetch(url, requestOptions)
        .then(res => {
            if (res.ok) {
                return res.json();
            }
            return res.json().then(err => {
                console.error(`Error starting payments setup: ${res.type} ${res.statusText} ${err.kind} ${err.message}`);
                throw new Error(`Error starting payments setup`);
            })
        })
    } catch (err) {
        console.error(err);
    }
}

async function createAccountSession() {
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
        let url = new URL(`${process.env.REACT_APP_SERVER_URL}/stripe-payments/create-account-session`);
        return fetch(url, requestOptions)
        .then(res => {
            if (res.ok) {
                return res.json();
            }
            return res.json().then(err => {
                console.error(`Error creating account session: ${res.type} ${res.statusText} ${err.kind} ${err.message}`);
                throw new Error(`Error creating account session`);
            })
        })
    } catch (err) {
        console.error(err);
    }
}

async function retrieveAccount() {
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
        let url = new URL(`${process.env.REACT_APP_SERVER_URL}/stripe-payments/retrieve-account`);
        return fetch(url, requestOptions)
        .then(res => {
            if (res.ok) {
                return res.json();
            }
            return res.json().then(err => {
                console.error(`Error retrieving account: ${res.type} ${res.statusText} ${err.kind} ${err.message}`);
                throw new Error(`Error retrieving account`);
            })
        })
    } catch (err) {
        console.error(err);
    }
}

async function createDeposit(client: string, quote: string, paymentAmount: number) {
    try {
    var headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + await currentUser.getIdToken(),
        'tenantId': auth.tenantId as string,
        'userId': auth.currentUser?.uid as string
    }
    var body = JSON.stringify({client: client, quote: quote, paymentAmount: paymentAmount});
    const requestOptions: RequestInit = {
        method: 'POST',
        headers: headers,
        body: body
    };
        let url = new URL(`${process.env.REACT_APP_SERVER_URL}/stripe-payments/create-deposit`);
        return fetch(url, requestOptions)
        .then(res => {
            if (res.ok) {
                return res.json();
            }
            return res.json().then(err => {
                console.error(`Error creating deposit: ${res.type} ${res.statusText} ${err.kind} ${err.message}`);
                throw new Error(`Error creating deposit`);
            })
        })
    } catch (err) {
        console.error(err);
    }
}

async function createPayment(client: string, invoice: string, paymentAmount: number) {
    try {
    var headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + await currentUser.getIdToken(),
        'tenantId': auth.tenantId as string,
        'userId': auth.currentUser?.uid as string
    }
    var body = JSON.stringify({client: client, invoice: invoice, paymentAmount: paymentAmount});
    const requestOptions: RequestInit = {
        method: 'POST',
        headers: headers,
        body: body
    };
        let url = new URL(`${process.env.REACT_APP_SERVER_URL}/stripe-payments/create-payment`);
        return fetch(url, requestOptions)
        .then(res => {
            if (res.ok) {
                return res.json();
            }
            return res.json().then(err => {
                console.error(`Error creating payment: ${res.type} ${res.statusText} ${err.kind} ${err.message}`);
                throw new Error(`Error creating payment`);
            })
        })
    } catch (err) {
        console.error(err);
    }
}

export {
    startPaymentSetUp,
    continuePaymentSetUp,
    retrieveAccount,
    createDeposit,
    createPayment,
    createAccountSession
  };