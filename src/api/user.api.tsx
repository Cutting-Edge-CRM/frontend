import { auth, currentUser } from "../auth/firebase";

async function addUserToTenant(tenantId: string, email: string, uid: string) {
    try {
    var body = JSON.stringify({
        company: tenantId,
        email: email,
        id: uid
    })
    var headers = {
        'Content-Type': 'application/json',
    }
    const requestOptions = {
        method: 'POST',
        headers: headers,
        body: body,
    };
        let res = await fetch(`${process.env.REACT_APP_SERVER_URL}/users/add-user-to-tenant`, requestOptions);
        return await res.json();
    } catch (err) {
        console.error(err);
    }
}

async function inviteUser(email: string, name: string, uid: string) {
    try {
    var body = JSON.stringify({
        name: name,
        email: email,
        uid: uid,
    })
    var headers: HeadersInit = {
        'Content-Type': 'application/json',
        'tenantId': auth.tenantId as string,
        'userId': auth.currentUser?.uid as string
    }
    const requestOptions: RequestInit = {
        method: 'POST',
        headers: headers,
        body: body,
    };
        let res = await fetch(`${process.env.REACT_APP_SERVER_URL}/users/invite-user`, requestOptions);
        return await res.json();
    } catch (err) {
        console.error(err);
    }
}

async function listUsers() {
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
        let url = new URL(`${process.env.REACT_APP_SERVER_URL}/users/list-users`);
        return fetch(url, requestOptions)
        .then(res => {
            if (res.ok) {
                return res.json();
            }
            res.json().then(err => {
                console.error(`Error listing users: ${res.type} ${res.statusText} ${err.kind} ${err.message}`);
            })
            throw new Error(`Error listing users`);
        })
    } catch (err) {
        console.error(err);
    }
}


export {
    addUserToTenant,
    inviteUser,
    listUsers
  };