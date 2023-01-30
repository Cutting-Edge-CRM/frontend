import { auth, currentUser } from "../auth/firebase";


async function getSettings() {
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
        let url = new URL(`${process.env.REACT_APP_SERVER_URL}/settings/get-settings`);
        return fetch(url, requestOptions)
        .then(res => {
            if (res.ok) {
                return res.json();
            }
            res.json().then(err => {
                console.error(`Error getting settings: ${res.type} ${res.statusText} ${err.kind} ${err.message}`);
                throw new Error(`Error getting settings: ${err.message}`);
            })
        })
    } catch (err) {
        console.error(err);
    }
}

export {
    getSettings
}