import { auth, currentUser } from "../auth/firebase";

async function sendEmail(email: any) {
    try {
    var headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + await currentUser.getIdToken(),
        'tenantId': auth.tenantId as string,
        'userId': auth.currentUser?.uid as string
    }
    var body = JSON.stringify(email);
    const requestOptions: RequestInit = {
        method: 'POST',
        headers: headers,
        body: body
    };
        let url = new URL(`${process.env.REACT_APP_SERVER_URL}/emails/send-email`);
        return fetch(url, requestOptions)
        .then(res => {
            if (res.ok) {
                return res.json();
            }
            return res.json().then(err => {
                console.error(`Error sending email: ${res.type} ${res.statusText} ${err.kind} ${err.message}`);
                throw new Error(`Error sending email`);
            })
        })
    } catch (err) {
        console.error(err);
    }
}

async function sendQuote(email: any) {
    try {
    var headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + await currentUser.getIdToken(),
        'tenantId': auth.tenantId as string,
        'userId': auth.currentUser?.uid as string
    }
    var body = JSON.stringify(email);
    const requestOptions: RequestInit = {
        method: 'POST',
        headers: headers,
        body: body
    };
        let url = new URL(`${process.env.REACT_APP_SERVER_URL}/emails/send-quote`);
        return fetch(url, requestOptions)
        .then(res => {
            if (res.ok) {
                return res.json();
            }
            return res.json().then(err => {
                console.error(`Error sending quote: ${res.type} ${res.statusText} ${err.kind} ${err.message}`);
                throw new Error(`Error sending quote`);
            })
        })
    } catch (err) {
        console.error(err);
    }
}

async function sendInvoice(email: any) {
    try {
    var headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + await currentUser.getIdToken(),
        'tenantId': auth.tenantId as string,
        'userId': auth.currentUser?.uid as string
    }
    var body = JSON.stringify(email);
    const requestOptions: RequestInit = {
        method: 'POST',
        headers: headers,
        body: body
    };
        let url = new URL(`${process.env.REACT_APP_SERVER_URL}/emails/send-invoice`);
        return fetch(url, requestOptions)
        .then(res => {
            if (res.ok) {
                return res.json();
            }
            return res.json().then(err => {
                console.error(`Error sending invoice: ${res.type} ${res.statusText} ${err.kind} ${err.message}`);
                throw new Error(`Error sending invoice`);
            })
        })
    } catch (err) {
        console.error(err);
    }
}

async function sendReceipt(email: any) {
    console.log(email);
    try {
    var headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + await currentUser.getIdToken(),
        'tenantId': auth.tenantId as string,
        'userId': auth.currentUser?.uid as string
    }
    var body = JSON.stringify(email);
    const requestOptions: RequestInit = {
        method: 'POST',
        headers: headers,
        body: body
    };
        let url = new URL(`${process.env.REACT_APP_SERVER_URL}/emails/send-receipt`);
        return fetch(url, requestOptions)
        .then(res => {
            if (res.ok) {
                return res.json();
            }
            return res.json().then(err => {
                console.error(`Error sending receipt: ${res.type} ${res.statusText} ${err.kind} ${err.message}`);
                throw new Error(`Error sending receipt`);
            })
        })
    } catch (err) {
        console.error(err);
    }
}

export {
    sendEmail,
    sendQuote,
    sendInvoice,
    sendReceipt
}