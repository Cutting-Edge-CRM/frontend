import { auth, currentUser } from "../auth/firebase";

async function listNotes(client?: string) {
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
        let url = new URL('http://localhost:3000/notes/list-notes');
        if (client) url.searchParams.set('client', client);
        return fetch(url, requestOptions)
        .then(res => {
            if (res.ok) {
                return res.json();
            }
            res.json().then(err => {
                console.error(`Error listing notes: ${res.type} ${res.statusText} ${err.kind} ${err.message}`);
            })
            throw new Error(`Error listing notes`);
        })
    } catch (err) {
        console.error(err);
    }
}

async function getNote(id?: string) {
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
        let url = new URL(`http://localhost:3000/notes/get-note/${id}`);
        return fetch(url, requestOptions)
        .then(res => {
            if (res.ok) {
                return res.json();
            }
            res.json().then(err => {
                console.error(`Error getting note: ${res.type} ${res.statusText} ${err.kind} ${err.message}`);
            })
            throw new Error(`Error getting note`);
        })
    } catch (err) {
        console.error(err);
    }
}


export {
    listNotes,
    getNote
  };