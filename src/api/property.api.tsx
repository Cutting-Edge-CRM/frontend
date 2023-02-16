import { auth, currentUser } from "../auth/firebase";

async function createProperty(property: any) {
    try {
    var headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + await currentUser.getIdToken(),
        'tenantId': auth.tenantId as string,
        'userId': auth.currentUser?.uid as string
    }
    var body = JSON.stringify(property);
    const requestOptions: RequestInit = {
        method: 'POST',
        headers: headers,
        body: body
    };
        let url = new URL(`${process.env.REACT_APP_SERVER_URL}/properties/create-property`);
        return fetch(url, requestOptions)
        .then(res => {
            if (res.ok) {
                return res.json();
            }
            return res.json().then(err => {
                console.error(`Error creating property: ${res.type} ${res.statusText} ${err.kind} ${err.message}`);
                throw new Error(`Error creating property`);
            })
        })
    } catch (err) {
        console.error(err);
    }
}


async function getProperty(id: string) {
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
        let url = new URL(`${process.env.REACT_APP_SERVER_URL}/properties/get-property/${id}`);
        return fetch(url, requestOptions)
        .then(res => {
            if (res.ok) {
                return res.json();
            }
            return res.json().then(err => {
                console.error(`Error getting property: ${res.type} ${res.statusText} ${err.kind} ${err.message}`);
                throw new Error(`Error getting property`);
            })
        })
    } catch (err) {
        console.error(err);
    }
}

async function updateProperty(property: any) {
    try {
    var headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + await currentUser.getIdToken(),
        'tenantId': auth.tenantId as string,
        'userId': auth.currentUser?.uid as string
    }
    var body = JSON.stringify(property);
    const requestOptions: RequestInit = {
        method: 'POST',
        headers: headers,
        body: body
    };
        let url = new URL(`${process.env.REACT_APP_SERVER_URL}/properties/update-property/${property.id}`);
        return fetch(url, requestOptions)
        .then(res => {
            if (res.ok) {
                return res.json();
            }
            return res.json().then(err => {
                console.error(`Error updating property: ${res.type} ${res.statusText} ${err.kind} ${err.message}`);
                throw new Error(`Error updating property`);
            })
        })
    } catch (err) {
        console.error(err);
    }
}

async function deleteProperty(id: any) {
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
        let url = new URL(`${process.env.REACT_APP_SERVER_URL}/properties/delete-property/${id}`);
        return fetch(url, requestOptions)
        .then(res => {
            if (res.ok) {
                return res.json();
            }
            return res.json().then(err => {
                console.error(`Error deleting property: ${res.type} ${res.statusText} ${err.kind} ${err.message}`);
                throw new Error(`Error deleting property`);
            })
        })
    } catch (err) {
        console.error(err);
    }
}

async function listProperties(client?: string) {
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
        let url = new URL(`${process.env.REACT_APP_SERVER_URL}/properties/list-properties`);
        if (client) url.searchParams.set('client', client);
        return fetch(url, requestOptions)
        .then(res => {
            if (res.ok) {
                return res.json();
            }
            return res.json().then(err => {
                console.error(`Error listing properties: ${res.type} ${res.statusText} ${err.kind} ${err.message}`);
                throw new Error(`Error listing properties`);
            })
        })
    } catch (err) {
        console.error(err);
    }
}


export {
    listProperties,
    getProperty,
    createProperty,
    updateProperty,
    deleteProperty
  };