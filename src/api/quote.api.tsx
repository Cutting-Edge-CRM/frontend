import { auth, currentUser } from "../auth/firebase";

async function createQuote(quote: any) {
    try {
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
        let url = new URL(`${process.env.REACT_APP_SERVER_URL}/quotes/create-quote`);
        return fetch(url, requestOptions)
        .then(res => {
            if (res.ok) {
                return res.json();
            }
            res.json().then(err => {
                console.error(`Error creating quote: ${res.type} ${res.statusText} ${err.kind} ${err.message}`);
            })
            throw new Error(`Error creating quote`);
        })
    } catch (err) {
        console.error(err);
    }
}

async function getQuote(id?: string) {
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
        let url = new URL(`${process.env.REACT_APP_SERVER_URL}/quotes/get-quote/${id}`);
        return fetch(url, requestOptions)
        .then(res => {
            if (res.ok) {
                return res.json();
            }
            res.json().then(err => {
                console.error(`Error getting quote: ${res.type} ${res.statusText} ${err.kind} ${err.message}`);
            })
            throw new Error(`Error getting quote`);
        })
    } catch (err) {
        console.error(err);
    }
}

async function updateQuote(quote: any) {
    try {
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
        let url = new URL(`${process.env.REACT_APP_SERVER_URL}/quotes/update-quote/${quote.quote.id}`);
        return fetch(url, requestOptions)
        .then(res => {
            if (res.ok) {
                return res.json();
            }
            res.json().then(err => {
                console.error(`Error updating quote: ${res.type} ${res.statusText} ${err.kind} ${err.message}`);
            })
            throw new Error(`Error updating quote`);
        })
    } catch (err) {
        console.error(err);
    }
}

async function deleteQuote(id: any) {
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
        let url = new URL(`${process.env.REACT_APP_SERVER_URL}/quotes/delete-quote/${id}`);
        return fetch(url, requestOptions)
        .then(res => {
            if (res.ok) {
                return res.json();
            }
            res.json().then(err => {
                console.error(`Error deleting quote: ${res.type} ${res.statusText} ${err.kind} ${err.message}`);
            })
            throw new Error(`Error deleting quote`);
        })
    } catch (err) {
        console.error(err);
    }
}

async function listQuotes(client?: string, query?: string, page?: number, pageSize?: number) {
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
        
    let url = new URL(`${process.env.REACT_APP_SERVER_URL}/quotes/list-quotes`);
    if (page) url.searchParams.set('page', `${page}`);
    if (client) url.searchParams.set('client', client);
    if (pageSize) url.searchParams.set('pageSize', `${pageSize}`);
    if (query) url.searchParams.set('query', query);
    return fetch(url, requestOptions)
        .then(res => {
            if (res.ok) {
                return res.json();
            }
            res.json().then(err => {
                console.error(`Error listing quotes: ${res.type} ${res.statusText} ${err.kind} ${err.message}`);
            })
            throw new Error(`Error listing quotes`);
        })
    } catch (err) {
        console.error(err);
    }
}


export {
    listQuotes,
    getQuote,
    updateQuote,
    createQuote,
    deleteQuote
  };