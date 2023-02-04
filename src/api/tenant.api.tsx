import { ErrorTypes } from '../util/errors';


async function registerNewTenant(name: string, email: string) {
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
        let res = await fetch(`${process.env.REACT_APP_SERVER_URL}/tenants/register-tenant`, requestOptions);
        return await res.json();
    } catch (err) {
        console.error(err);
    }
}

async function getTenantForUser(email: string) {
    try {
        var headers = {
            'Content-Type': 'application/json',
        }
        const requestOptions = {
            method: 'GET',
            headers: headers,
        };
        let res = await fetch(`${process.env.REACT_APP_SERVER_URL}/tenants/get-tenant-for-user/${email}`, requestOptions);
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

async function getTenantForClient(client: string) {
    try {
        var headers = {
            'Content-Type': 'application/json',
        }
        const requestOptions = {
            method: 'GET',
            headers: headers,
        };
        let res = await fetch(`${process.env.REACT_APP_SERVER_URL}/tenants/get-tenant-for-client/${client}`, requestOptions);
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
    getTenantForUser,
    getTenantForClient,
  };