import { auth, currentUser } from "../auth/firebase";

async function createVisit(visit: any) {
    try {
    var headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + await currentUser.getIdToken(),
        'tenantId': auth.tenantId as string,
        'userId': auth.currentUser?.uid as string
    }
    var body = JSON.stringify(visit);
    const requestOptions: RequestInit = {
        method: 'POST',
        headers: headers,
        body: body
    };
        let url = new URL(`${process.env.REACT_APP_SERVER_URL}/visits/create-visit`);
        return fetch(url, requestOptions)
        .then(res => {
            if (res.ok) {
                return res.json();
            }
            res.json().then(err => {
                console.error(`Error creating visit: ${res.type} ${res.statusText} ${err.kind} ${err.message}`);
            })
            throw new Error(`Error creating visit`);
        })
    } catch (err) {
        console.error(err);
    }
}

async function getVisit(id?: string) {
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
        let url = new URL(`${process.env.REACT_APP_SERVER_URL}/visits/get-visit/${id}`);
        return fetch(url, requestOptions)
        .then(res => {
            if (res.ok) {
                return res.json();
            }
            res.json().then(err => {
                console.error(`Error getting visit: ${res.type} ${res.statusText} ${err.kind} ${err.message}`);
            })
            throw new Error(`Error getting visit`);
        })
    } catch (err) {
        console.error(err);
    }
}

async function updateVisit(visit: any) {
    try {
    var headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + await currentUser.getIdToken(),
        'tenantId': auth.tenantId as string,
        'userId': auth.currentUser?.uid as string
    }
    var body = JSON.stringify(visit);
    const requestOptions: RequestInit = {
        method: 'POST',
        headers: headers,
        body: body
    };
        let url = new URL(`${process.env.REACT_APP_SERVER_URL}/visits/update-visit/${visit.id}`);
        return fetch(url, requestOptions)
        .then(res => {
            if (res.ok) {
                return res.json();
            }
            res.json().then(err => {
                console.error(`Error updating visit: ${res.type} ${res.statusText} ${err.kind} ${err.message}`);
            })
            throw new Error(`Error updating visit`);
        })
    } catch (err) {
        console.error(err);
    }
}
async function deleteVisit(id: any) {
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
        let url = new URL(`${process.env.REACT_APP_SERVER_URL}/visits/delete-visit/${id}`);
        return fetch(url, requestOptions)
        .then(res => {
            if (res.ok) {
                return res.json();
            }
            res.json().then(err => {
                console.error(`Error deleting visit: ${res.type} ${res.statusText} ${err.kind} ${err.message}`);
            })
            throw new Error(`Error deleting visit`);
        })
    } catch (err) {
        console.error(err);
    }
}


async function listVisits(client?: string, job?: string) {
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
        let url = new URL(`${process.env.REACT_APP_SERVER_URL}/visits/list-visits`);
        if (client) url.searchParams.set('client', client);
        if (job) url.searchParams.set('job', job);
        return fetch(url, requestOptions)
        .then(res => {
            if (res.ok) {
                return res.json();
            }
            res.json().then(err => {
                console.error(`Error listing visits: ${res.type} ${res.statusText} ${err.kind} ${err.message}`);
            })
            throw new Error(`Error listing visits`);
        })
    } catch (err) {
        console.error(err);
    }
}

async function listVisitsForCalendar() {
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
        let url = new URL(`${process.env.REACT_APP_SERVER_URL}/visits/list-event-calendar`);
        return fetch(url, requestOptions)
        .then(res => {
            if (res.ok) {
                return res.json();
            }
            res.json().then(err => {
                console.error(`Error listing visits: ${res.type} ${res.statusText} ${err.kind} ${err.message}`);
            })
            throw new Error(`Error listing visits`);
        })
    } catch (err) {
        console.error(err);
    }
}


export {
    listVisits,
    getVisit,
    createVisit,
    updateVisit,
    deleteVisit,
    listVisitsForCalendar
  };