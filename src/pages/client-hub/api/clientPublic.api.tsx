import { auth, currentUser } from "../../../auth/firebase";


async function updateQuote(quote: any) {
    try {
        console.log(quote);
    var headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + await currentUser.getIdToken(),
        'tenantId': auth.tenantId as string,
        'userId': auth.currentUser?.uid as string
    }
    var body = JSON.stringify(quote);
    const requestOptions: RequestInit = {
        method: 'POST',
        headers: headers,
        body: body
    };
        let url = new URL(`${process.env.REACT_APP_SERVER_URL}/client-public/update-quote/${quote.quote.id}`);
        return fetch(url, requestOptions)
        .then(res => {
            if (res.ok) {
                return res.json();
            }
            return res.json().then(err => {
                console.error(`Error updating quote: ${res.type} ${res.statusText} ${err.kind} ${err.message}`);
                throw new Error(`Error updating quote`);
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
        let url = new URL(`${process.env.REACT_APP_SERVER_URL}/client-public/create-deposit`);
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
        let url = new URL(`${process.env.REACT_APP_SERVER_URL}/client-public/create-payment`);
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

async function createTimeline(timeline: any) {
    try {
    var headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + await currentUser.getIdToken(),
        'tenantId': auth.tenantId as string,
        'userId': auth.currentUser?.uid as string
    }
    var body = JSON.stringify(timeline);
    const requestOptions: RequestInit = {
        method: 'POST',
        headers: headers,
        body: body
    };
        let url = new URL(`${process.env.REACT_APP_SERVER_URL}/client-public/create-timeline`);
        return fetch(url, requestOptions)
        .then(res => {
            if (res.ok) {
                return res.json();
            }
            return res.json().then(err => {
                console.error(`Error creating timeline: ${res.type} ${res.statusText} ${err.kind} ${err.message}`);
                throw new Error(`Error creating timeline`);
            })
        })
    } catch (err) {
        console.error(err);
    }
}

export {
    updateQuote,
    createDeposit,
    createPayment,
    createTimeline
}