import { auth, currentUser } from "../auth/firebase";


async function updateProposalResources(proposalResources: any) {
    try {
    var headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + await currentUser.getIdToken(),
        'tenantId': auth.tenantId as string,
        'userId': auth.currentUser?.uid as string
    }
    var body = JSON.stringify(proposalResources);
    const requestOptions: RequestInit = {
        method: 'POST',
        headers: headers,
        body: body
    };
        let url = new URL(`${process.env.REACT_APP_SERVER_URL}/proposals/update-proposal-resources`);
        return fetch(url, requestOptions)
        .then(res => {
            if (res.ok) {
                return res.json();
            }
            return res.json().then(err => {
                console.error(`Error updating proposal resources: ${res.type} ${res.statusText} ${err.kind} ${err.message}`);
                throw new Error(`Error updating proposal resources`);
            })
        })
    } catch (err) {
        console.error(err);
    }
}

async function listProposalResources() {
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
        let url = new URL(`${process.env.REACT_APP_SERVER_URL}/proposals/list-proposal-resources`);
        return fetch(url, requestOptions)
        .then(res => {
            if (res.ok) {
                return res.json();
            }
            return res.json().then(err => {
                console.error(`Error listing proposal resources: ${res.type} ${res.statusText} ${err.kind} ${err.message}`);
                throw new Error(`Error listing proposal resources`);
            })
        })
    } catch (err) {
        console.error(err);
    }
}

async function updateQuoteResources(id: any, about: any, resources: any) {
    try {
    var headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + await currentUser.getIdToken(),
        'tenantId': auth.tenantId as string,
        'userId': auth.currentUser?.uid as string
    }
    var body = JSON.stringify({about: about, resources: resources});
    const requestOptions: RequestInit = {
        method: 'POST',
        headers: headers,
        body: body
    };
        let url = new URL(`${process.env.REACT_APP_SERVER_URL}/proposals/update-quote-resources/${id}`);
        return fetch(url, requestOptions)
        .then(res => {
            if (res.ok) {
                return res.json();
            }
            return res.json().then(err => {
                console.error(`Error updating quote resources: ${res.type} ${res.statusText} ${err.kind} ${err.message}`);
                throw new Error(`Error updating quote resources`);
            })
        })
    } catch (err) {
        console.error(err);
    }
}

async function listQuoteResources(id: any) {
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
        let url = new URL(`${process.env.REACT_APP_SERVER_URL}/proposals/list-quote-resources/${id}`);
        return fetch(url, requestOptions)
        .then(res => {
            if (res.ok) {
                return res.json();
            }
            return res.json().then(err => {
                console.error(`Error listing quote resources: ${res.type} ${res.statusText} ${err.kind} ${err.message}`);
                throw new Error(`Error listing quote resources`);
            })
        })
    } catch (err) {
        console.error(err);
    }
}

export {
    updateProposalResources,
    listProposalResources,
    listQuoteResources,
    updateQuoteResources
}