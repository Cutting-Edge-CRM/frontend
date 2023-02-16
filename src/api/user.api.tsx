import { auth, currentUser } from "../auth/firebase";

async function addUserToTenant(tenantId: string, email: string, uid: string) {
    try {
        var headers: HeadersInit = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + await currentUser.getIdToken(),
            'tenantId': auth.tenantId as string,
            'userId': auth.currentUser?.uid as string
        }
    var body = JSON.stringify({
        company: tenantId,
        email: email,
        id: uid
    })
    const requestOptions = {
        method: 'POST',
        headers: headers,
        body: body,
    };
        let url = `${process.env.REACT_APP_SERVER_URL}/users/add-user-to-tenant`;
        return fetch(url, requestOptions)
        .then(res => {
            if (res.ok) {
                return res.json();
            }
            return res.json().then(err => {
                console.error(`Error adding user to tenant: ${res.type} ${res.statusText} ${err.kind} ${err.message}`);
                throw new Error(`Error adding user to tenant`);
            })
        })
    } catch (err) {
        console.error(err);
    }
}

async function inviteUser(user: any) {
    try {
    var body = JSON.stringify(user)
    var headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + await currentUser.getIdToken(),
        'tenantId': auth.tenantId as string,
        'userId': auth.currentUser?.uid as string
    }
    const requestOptions: RequestInit = {
        method: 'POST',
        headers: headers,
        body: body,
    };
        let url = `${process.env.REACT_APP_SERVER_URL}/users/invite-user`;
        return fetch(url, requestOptions)
        .then(res => {
            if (res.ok) {
                return res.json();
            }
            return res.json().then(err => {
                console.error(`Error inviting user: ${res.type} ${res.statusText} ${err.kind} ${err.message}`);
                throw new Error(`Error inviting user`);
            })
        })
    } catch (err) {
        console.error(err);
    }
}

async function getUser(id?: string) {
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
        let url = new URL(`${process.env.REACT_APP_SERVER_URL}/users/get-user/${id ? id : auth.currentUser?.uid}`);
        return fetch(url, requestOptions)
        .then(res => {
            if (res.ok) {
                return res.json();
            }
            return res.json().then(err => {
                console.error(`Error getting user: ${res.type} ${res.statusText} ${err.kind} ${err.message}`);
                throw new Error(`Error getting user`);
            })
        })
    } catch (err) {
        console.error(err);
    }
}

async function updateUser(user: any) {
    try {
    var headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + await currentUser.getIdToken(),
        'tenantId': auth.tenantId as string,
        'userId': auth.currentUser?.uid as string
    }
    var body = JSON.stringify(user);
    const requestOptions: RequestInit = {
        method: 'POST',
        headers: headers,
        body: body
    };
        let url = new URL(`${process.env.REACT_APP_SERVER_URL}/users/update-user/${user.id}`);
        return fetch(url, requestOptions)
        .then(res => {
            if (res.ok) {
                return res.json();
            }
            return res.json().then(err => {
                console.error(`Error updating user: ${res.type} ${res.statusText} ${err.kind} ${err.message}`);
                throw new Error(`Error updating user`);
            })
        })
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
            return res.json().then(err => {
                console.error(`Error listing users: ${res.type} ${res.statusText} ${err.kind} ${err.message}`);
                throw new Error(`Error listing users`);
            })
        })
    } catch (err) {
        console.error(err);
    }
}


export {
    addUserToTenant,
    inviteUser,
    listUsers,
    getUser,
    updateUser
  };