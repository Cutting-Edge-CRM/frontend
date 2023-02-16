import { auth, currentUser } from "../auth/firebase";

async function createInvoice(invoice: any) {
    try {
    var headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + await currentUser.getIdToken(),
        'tenantId': auth.tenantId as string,
        'userId': auth.currentUser?.uid as string
    }
    var body = JSON.stringify(invoice);
    const requestOptions: RequestInit = {
        method: 'POST',
        headers: headers,
        body: body
    };
        let url = new URL(`${process.env.REACT_APP_SERVER_URL}/invoices/create-invoice`);
        return fetch(url, requestOptions)
        .then(res => {
            if (res.ok) {
                return res.json();
            }
            return res.json().then(err => {
                console.error(`Error creating invoice: ${res.type} ${res.statusText} ${err.kind} ${err.message}`);
                throw new Error(`Error creating invoice`);
            })
        })
    } catch (err) {
        console.error(err);
    }
}


async function getInvoice(id?: string) {
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
        let url = new URL(`${process.env.REACT_APP_SERVER_URL}/invoices/get-invoice/${id}`);
        return fetch(url, requestOptions)
        .then(res => {
            if (res.ok) {
                return res.json();
            }
            return res.json().then(err => {
                console.error(`Error getting invoice: ${res.type} ${res.statusText} ${err.kind} ${err.message}`);
                throw new Error(`Error getting invoice`);
            })
        })
    } catch (err) {
        console.error(err);
    }
}

async function updateInvoice(invoice: any) {
    try {
    var headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + await currentUser.getIdToken(),
        'tenantId': auth.tenantId as string,
        'userId': auth.currentUser?.uid as string
    }
    var body = JSON.stringify(invoice);
    const requestOptions: RequestInit = {
        method: 'POST',
        headers: headers,
        body: body
    };
        let url = new URL(`${process.env.REACT_APP_SERVER_URL}/invoices/update-invoice/${invoice.invoice.id}`);
        return fetch(url, requestOptions)
        .then(res => {
            if (res.ok) {
                return res.json();
            }
            return res.json().then(err => {
                console.error(`Error updating invoice: ${res.type} ${res.statusText} ${err.kind} ${err.message}`);
                throw new Error(`Error updating invoice`);
            })
        })
    } catch (err) {
        console.error(err);
    }
}

async function deleteInvoice(id: any) {
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
        let url = new URL(`${process.env.REACT_APP_SERVER_URL}/invoices/delete-invoice/${id}`);
        return fetch(url, requestOptions)
        .then(res => {
            if (res.ok) {
                return res.json();
            }
            return res.json().then(err => {
                console.error(`Error deleting invoice: ${res.type} ${res.statusText} ${err.kind} ${err.message}`);
                throw new Error(`Error deleting invoice`);
            })
        })
    } catch (err) {
        console.error(err);
    }
}

async function listInvoices(client?: string, query?: string, page?: number, pageSize?: number) {
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
    let url = new URL(`${process.env.REACT_APP_SERVER_URL}/invoices/list-invoices`);
    if (page) url.searchParams.set('page', `${page}`);
    if (client) url.searchParams.set('client', client);
    if (pageSize) url.searchParams.set('pageSize', `${pageSize}`);
    if (query) url.searchParams.set('query', query);
    return fetch(url, requestOptions)
        .then(res => {
            if (res.ok) {
                return res.json();
            }
            return res.json().then(err => {
                console.error(`Error listing invoices: ${res.type} ${res.statusText} ${err.kind} ${err.message}`);
                throw new Error(`Error listing invoices`);
            })
        })
    } catch (err) {
        console.error(err);
    }
}


export {
    listInvoices,
    getInvoice,
    updateInvoice,
    createInvoice,
    deleteInvoice
  };