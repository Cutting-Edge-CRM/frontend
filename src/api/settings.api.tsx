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
            return res.json().then(err => {
                console.error(`Error getting settings: ${res.type} ${res.statusText} ${err.kind} ${err.message}`);
                throw new Error(`Error getting settings`);
            })
        })
    } catch (err) {
        console.error(err);
    }
}

async function updateSettings(settings: any) {
    try {
    var headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + await currentUser.getIdToken(),
        'tenantId': auth.tenantId as string,
        'userId': auth.currentUser?.uid as string
    }
    var body = JSON.stringify(settings);
    const requestOptions: RequestInit = {
        method: 'POST',
        headers: headers,
        body: body
    };
        let url = new URL(`${process.env.REACT_APP_SERVER_URL}/settings/update-settings/${settings.id}`);
        return fetch(url, requestOptions)
        .then(res => {
            if (res.ok) {
                return res.json();
            }
            return res.json().then(err => {
                console.error(`Error updating settings: ${res.type} ${res.statusText} ${err.kind} ${err.message}`);
                throw new Error(`Error updating settings`);
            })
        })
    } catch (err) {
        console.error(err);
    }
}

export {
    getSettings,
    updateSettings
}