import { auth, currentUser } from "../auth/firebase";

async function getCompany() {
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
        let url = new URL(`${process.env.REACT_APP_SERVER_URL}/companies/get-company`);
        return fetch(url, requestOptions)
        .then(res => {
            if (res.ok) {
                return res.json();
            }
            res.json().then(err => {
                console.error(`Error getting company: ${res.type} ${res.statusText} ${err.kind} ${err.message}`);
                throw new Error(`Error getting company: ${err.message}`);
            })
        })
    } catch (err) {
        console.error(err);
    }
}

async function updateCompany(company: any) {
    try {
    var headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + await currentUser.getIdToken(),
        'tenantId': auth.tenantId as string,
        'userId': auth.currentUser?.uid as string
    }
    var body = JSON.stringify(company);
    const requestOptions: RequestInit = {
        method: 'POST',
        headers: headers,
        body: body
    };
        let url = new URL(`${process.env.REACT_APP_SERVER_URL}/companies/update-company`);
        return fetch(url, requestOptions)
        .then(res => {
            if (res.ok) {
                return res.json();
            }
            res.json().then(err => {
                console.error(`Error updating company: ${res.type} ${res.statusText} ${err.kind} ${err.message}`);
            })
            throw new Error(`Error updating company`);
        })
    } catch (err) {
        console.error(err);
    }
}

export {
    getCompany,
    updateCompany
  };