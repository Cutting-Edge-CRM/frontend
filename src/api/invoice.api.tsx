import { auth, currentUser } from "../auth/firebase";

async function listInvoices(client?: string) {
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
        let url = new URL('http://localhost:3000/invoices/list-invoices');
        if (client) url.searchParams.set('client', client);
        return fetch(url, requestOptions)
        .then(res => {
            if (res.ok) {
                return res.json();
            }
            res.json().then(err => {
                console.error(`Error listing invoices: ${res.type} ${res.statusText} ${err.kind} ${err.message}`);
            })
            throw new Error(`Error listing invoices`);
        })
    } catch (err) {
        console.error(err);
    }
}


export {
    listInvoices
  };