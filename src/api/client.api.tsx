import { auth, currentUser } from "../auth/firebase";

async function listClients() {
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
        return fetch('http://localhost:3000/clients/list-clients', requestOptions)
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


export {
    listClients
  };