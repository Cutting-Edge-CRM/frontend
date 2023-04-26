import { auth, currentUser } from "../auth/firebase";

async function dashboard(query: any) {
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
        let url = new URL(`${process.env.REACT_APP_SERVER_URL}/reports/dashboard`);
        url.searchParams.set('start', `${query.start}`);
        url.searchParams.set('end', `${query.end}`);
        url.searchParams.set('inc', `${query.inc}`);
        url.searchParams.set('unit', `${query.unit}`);
        return fetch(url, requestOptions)
        .then(res => {
            if (res.ok) {
                return res.json();
            }
            return res.json().then(err => {
                console.error(`Error getting dashboard: ${res.type} ${res.statusText} ${err.kind} ${err.message}`);
                throw new Error(`Error getting dashboard`);
            })
        })
    } catch (err) {
        console.error(err);
    }
}

export {
    dashboard
}