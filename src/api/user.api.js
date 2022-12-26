import { auth } from "../auth/firebase";

async function addUserToTenant(tenantId, email, uid) {
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
        let res = await fetch('http://localhost:3000/users/add-user-to-tenant', requestOptions);
        return await res.json();
    } catch (err) {
        console.error(err);
    }
}

async function inviteUser(email, name, uid) {
    try {
    var body = JSON.stringify({
        name: name,
        email: email,
        uid: uid,
    })
    var headers = {
        'Content-Type': 'application/json',
        'tenantId': auth.tenantId,
        'userId': auth.currentUser.uid
    }
    const requestOptions = {
        method: 'POST',
        headers: headers,
        body: body,
    };
        let res = await fetch('http://localhost:3000/users/invite-user', requestOptions);
        return await res.json();
    } catch (err) {
        console.error(err);
    }
}


export {
    addUserToTenant,
    inviteUser
  };