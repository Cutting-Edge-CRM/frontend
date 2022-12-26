import { auth } from '../auth/firebase.js';
import { ErrorTypes } from '../util/errors.js';


async function registerNewTenant(name, email) {
    var body = JSON.stringify({
        company: name,
        email: email
    })
    var headers = {
        'Content-Type': 'application/json',
    }
    const requestOptions = {
        method: 'POST',
        headers: headers,
        body: body,
    };
    try {
        let res = await fetch('http://localhost:3000/tenants/register-tenant', requestOptions);
        return await res.json();
    } catch (err) {
        console.log(err);
    }
}

async function getTenantForUser(email) {
    try {
        var headers = {
            'Content-Type': 'application/json',
        }
        const requestOptions = {
            method: 'GET',
            headers: headers,
        };
        let res = await fetch(`http://localhost:3000/tenants/get-tenant-for-user/${email}`, requestOptions);
        let response = await res.json();
        if (res.ok) {
            return response;
        }
        return Promise.reject(new Error(response.kind));
    } catch (err) {
        console.error(err);
        return Promise.reject(new Error(ErrorTypes.UNKNOWNERROR));
    }
}

export {
    registerNewTenant,
    getTenantForUser
  };