import { auth, currentUser } from "../auth/firebase";

async function createTax(tax: any) {
    try {
    var headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + await currentUser.getIdToken(),
        'tenantId': auth.tenantId as string,
        'userId': auth.currentUser?.uid as string
    }
    var body = JSON.stringify(tax);
    const requestOptions: RequestInit = {
        method: 'POST',
        headers: headers,
        body: body
    };
        let url = new URL(`http://localhost:3000/taxes/create-tax`);
        return fetch(url, requestOptions)
        .then(res => {
            if (res.ok) {
                return res.json();
            }
            res.json().then(err => {
                console.error(`Error creating tax: ${res.type} ${res.statusText} ${err.kind} ${err.message}`);
            })
            throw new Error(`Error creating tax`);
        })
    } catch (err) {
        console.error(err);
    }
}


async function getTax(id: string) {
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
        let url = new URL(`http://localhost:3000/taxes/get-tax/${id}`);
        return fetch(url, requestOptions)
        .then(res => {
            if (res.ok) {
                return res.json();
            }
            res.json().then(err => {
                console.error(`Error getting tax: ${res.type} ${res.statusText} ${err.kind} ${err.message}`);
            })
            throw new Error(`Error getting tax`);
        })
    } catch (err) {
        console.error(err);
    }
}

async function updateTax(tax: any) {
    try {
    var headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + await currentUser.getIdToken(),
        'tenantId': auth.tenantId as string,
        'userId': auth.currentUser?.uid as string
    }
    var body = JSON.stringify(tax);
    const requestOptions: RequestInit = {
        method: 'POST',
        headers: headers,
        body: body
    };
        let url = new URL(`http://localhost:3000/taxes/update-tax/${tax.id}`);
        return fetch(url, requestOptions)
        .then(res => {
            if (res.ok) {
                return res.json();
            }
            res.json().then(err => {
                console.error(`Error updating tax: ${res.type} ${res.statusText} ${err.kind} ${err.message}`);
            })
            throw new Error(`Error updating tax`);
        })
    } catch (err) {
        console.error(err);
    }
}

async function deleteTax(id: any) {
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
        let url = new URL(`http://localhost:3000/taxes/delete-tax/${id}`);
        return fetch(url, requestOptions)
        .then(res => {
            if (res.ok) {
                return res.json();
            }
            res.json().then(err => {
                console.error(`Error deleting tax: ${res.type} ${res.statusText} ${err.kind} ${err.message}`);
            })
            throw new Error(`Error deleting tax`);
        })
    } catch (err) {
        console.error(err);
    }
}

async function listTaxes(client?: string) {
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
        let url = new URL('http://localhost:3000/taxes/list-taxes');
        if (client) url.searchParams.set('client', client);
        return fetch(url, requestOptions)
        .then(res => {
            if (res.ok) {
                return res.json();
            }
            res.json().then(err => {
                console.error(`Error listing taxes: ${res.type} ${res.statusText} ${err.kind} ${err.message}`);
            })
            throw new Error(`Error listing taxes`);
        })
    } catch (err) {
        console.error(err);
    }
}


export {
    listTaxes,
    getTax,
    createTax,
    updateTax,
    deleteTax
  };