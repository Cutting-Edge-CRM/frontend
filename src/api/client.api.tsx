import { auth, currentUser } from "../auth/firebase";

async function createClient(client: any) {
    try {
    var headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + await currentUser.getIdToken(),
        'tenantId': auth.tenantId as string,
        'userId': auth.currentUser?.uid as string
    }
    var body = JSON.stringify(client);
    const requestOptions: RequestInit = {
        method: 'POST',
        headers: headers,
        body: body
    };
        let url = new URL(`${process.env.REACT_APP_SERVER_URL}/clients/create-client`);
        return fetch(url, requestOptions)
        .then(res => {
            if (res.ok) {
                return res.json();
            }
            res.json().then(err => {
                console.error(`Error creating client: ${res.type} ${res.statusText} ${err.kind} ${err.message}`);
                throw new Error(`Error creating client: ${err.message}`);
            })
        })
    } catch (err) {
        console.error(err);
    }
}

async function getClient(id: string) {
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
        let url = new URL(`${process.env.REACT_APP_SERVER_URL}/clients/get-client/${id}`);
        return fetch(url, requestOptions)
        .then(res => {
            if (res.ok) {
                return res.json();
            }
            res.json().then(err => {
                console.error(`Error getting client: ${res.type} ${res.statusText} ${err.kind} ${err.message}`);
                throw new Error(`Error getting client: ${err.message}`);
            })
        })
    } catch (err) {
        console.error(err);
    }
}

async function updateClient(client: any) {
    try {
    var headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + await currentUser.getIdToken(),
        'tenantId': auth.tenantId as string,
        'userId': auth.currentUser?.uid as string
    }
    var body = JSON.stringify(client);
    const requestOptions: RequestInit = {
        method: 'POST',
        headers: headers,
        body: body
    };
        let url = new URL(`${process.env.REACT_APP_SERVER_URL}/clients/update-client/${client.id}`);
        return fetch(url, requestOptions)
        .then(res => {
            if (res.ok) {
                return res.json();
            }
            res.json().then(err => {
                console.error(`Error updating client: ${res.type} ${res.statusText} ${err.kind} ${err.message}`);
                throw new Error(`Error updating client: ${err.message}`);
            })
        })
    } catch (err) {
        console.error(err);
    }
}

async function deleteClient(id: any) {
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
        let url = new URL(`${process.env.REACT_APP_SERVER_URL}/clients/delete-client/${id}`);
        return fetch(url, requestOptions)
        .then(res => {
            if (res.ok) {
                return res.json();
            }
            res.json().then(err => {
                console.error(`Error deleting client: ${res.type} ${res.statusText} ${err.kind} ${err.message}`);
            })
            throw new Error(`Error deleting client`);
        })
    } catch (err) {
        console.error(err);
    }
}

async function listClients( query?: string, page?: number, pageSize?: number) {
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
    let url = new URL(`${process.env.REACT_APP_SERVER_URL}/clients/list-clients`);
    if (page) url.searchParams.set('page', `${page}`);
    if (pageSize) url.searchParams.set('pageSize', `${pageSize}`);
    if (query) url.searchParams.set('query', query);
    return fetch(url, requestOptions)
        .then(res => {
            if (res.ok) {
                return res.json();
            }
            res.json().then(err => {
                console.error(`Error listing clients: ${res.type} ${res.statusText} ${err.kind} ${err.message}`);
            })
            throw new Error(`Error listing clients`);
        })
    } catch (err) {
        console.error(err);
    }
}

async function importClients(clients: any[]) {
    try {
    var headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + await currentUser.getIdToken(),
        'tenantId': auth.tenantId as string,
        'userId': auth.currentUser?.uid as string
    }
    var body = JSON.stringify(clients);
    const requestOptions: RequestInit = {
        method: 'POST',
        headers: headers,
        body: body
    };
        let url = new URL(`${process.env.REACT_APP_SERVER_URL}/clients/import-clients`);
        return fetch(url, requestOptions)
        .then(res => {
            if (res.ok) {
                return res.json();
            }
            res.json().then(err => {
                console.error(`Error importing clients: ${res.type} ${res.statusText} ${err.kind} ${err.message}`);
                throw new Error(`Error importing clients: ${err.message}`);
            })
        })
    } catch (err) {
        console.error(err);
    }
}

async function exportClients() {
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
    let url = new URL(`${process.env.REACT_APP_SERVER_URL}/clients/export-clients`);
    return fetch(url, requestOptions)
        .then(res => {
            if (res.ok) {
                return res.json();
            }
            res.json().then(err => {
                console.error(`Error exporting clients: ${res.type} ${res.statusText} ${err.kind} ${err.message}`);
            })
            throw new Error(`Error exporting clients`);
        })
    } catch (err) {
        console.error(err);
    }
}

export {
    listClients,
    getClient,
    createClient,
    updateClient,
    deleteClient,
    importClients,
    exportClients
  };